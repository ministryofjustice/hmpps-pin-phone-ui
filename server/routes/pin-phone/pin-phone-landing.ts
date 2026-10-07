import { Router } from 'express'
import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import AuditService, { Page } from '../../services/auditService'
import { PATHS } from '../../constants/paths'
import TelemetryService from '../../services/telemetryService'
import FeatureFlagService from '../../services/featureFlagService'

export default function pinPhoneRoutes(
  router: Router,
  auditService: AuditService,
  telemetryService: TelemetryService,
  featureFlagService: FeatureFlagService,
): Router {
  router.get(PATHS.LANDING_PAGE, async (req, res, _next) => {
    await auditService.logPageView(Page.PIN_PHONE_LANDING, { who: res.locals.user.username, correlationId: req.id })
    const user = req.user as LaunchpadUser

    const prisonId = user.establishment.agency_id
    const canViewContacts = await featureFlagService.isEnabled('view-contacts', user.establishment.agency_id, {
      prisonId,
    })

    // reset buy credit session data
    delete req.session.requestedCreditAmountPounds
    delete req.session.amountType

    const userName = user.username
    telemetryService.trackEvent('PIN_PHONE_LANDING', user, {
      prisonCode: user.establishment.agency_id,
    })

    return res.render('pages/pin-phone/pin-phone-landing', {
      userName,
      buyCreditsUrl: PATHS.BUY_CREDIT,
      viewContactsUrl: PATHS.VIEW_CONTACTS,
      canViewContacts,
    })
  })

  return router
}
