import { Router } from 'express'
import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import AuditService from '../../services/auditService'
import PinPhoneService from '../../services/pinPhoneService'
// import TelemetryService from '../../services/telemetryService'
import { PATHS } from '../../constants/paths'
import { CallHistoryRequest } from '../../pinPhone.model'

export const validateCallHistoryRequest = (request: {
  prisonerId: string
  startDate: Date
  endDate: Date
  pageSize: number
  pageNumber: number
}): string[] => {
  const errors: string[] = []

  if (!request.prisonerId?.trim()) {
    errors.push('prisonerId is required')
  }

  if (!request.startDate) {
    errors.push('startDate is required')
  } else if (Number.isNaN(request.startDate.getTime())) {
    errors.push('startDate must be a valid date')
  }

  if (!request.endDate) {
    errors.push('endDate is required')
  } else if (Number.isNaN(request.endDate.getTime())) {
    errors.push('endDate must be a valid date')
  }

  if (request.startDate && request.endDate && request.endDate < request.startDate) {
    errors.push('endDate must be after startDate')
  }

  if (!Number.isInteger(request.pageSize) || request.pageSize < 1) {
    errors.push('pageSize must be greater than 0')
  }

  if (!Number.isInteger(request.pageNumber) || request.pageNumber < 0) {
    errors.push('pageNumber must be greater than or equal to 0')
  }

  return errors
}

export function viewCallHistoryRoutes(
  router: Router,
  auditService: AuditService,
  pinPhoneService: PinPhoneService,
  // telemetryService: TelemetryService,
): Router {
  router.post(PATHS.CHECK_CALL_HISTORY_PAGE, async (req, res, next) => {
    try {
      const user = req.user as LaunchpadUser
      const request: { prisonerId: string; startDate: Date; endDate: Date; pageSize: 20; pageNumber: 0 } = {
        prisonerId: user.userId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        pageSize: req.body.pageSize ?? 20,
        pageNumber: req.body.pageNumber ?? 0,
      }

      const errors = validateCallHistoryRequest(request)

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors,
        })
      }

      const callHistory = await pinPhoneService.retrieveCallHistory(<CallHistoryRequest>request)

      return res.render('pages/pin-phone/check-call-history', {
        callHistory,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
