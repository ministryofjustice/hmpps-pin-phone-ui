import { RequestHandler, Router } from 'express'
import AuditService, { Page } from '../services/auditService'
import TelemetryService from '../services/telemetryService'
import { PATHS } from '../constants/paths'
import { HmppsUser } from '../interfaces/hmppsUser'

export default function staffPinPhoneRoutes(
  router: Router,
  auditService: AuditService,
  telemetryService: TelemetryService,
  portalGuard: RequestHandler,
): Router {
  router.get(PATHS.STAFF_LANDING_PAGE, portalGuard, async (req, res, _next) => {
    await auditService.logPageView(Page.STAFF_PIN_PHONE_LANDING, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const user = req.user as HmppsUser
    const userName = user.username
    telemetryService.trackEvent('STAFF_PIN_PHONE_LANDING', user, {})

    return res.render('pages/staff-pinphone-landing', {
      userName,
    })
  })

  return router
}
