import { Router } from 'express'

import type { Services } from '../services'
import pinPhoneRoutes from './pin-phone/pin-phone-landing'
import buyPinPhoneCreditRoutes from './pin-phone/buy-pin-phone-credit'
import checkOrderDetailsRoutes from './pin-phone/check-order-details'
import buyCreditConfirmation from './pin-phone/buy-credit-confirmation'
import viewContacts from './pin-phone/view-contacts'
import { PATHS } from '../constants/paths'
import { requirePortal } from '../middleware/setUpPortals'
import staffPinPhoneRoutes from './staff-pinphone-landing'

export default function routes({ auditService, pinPhoneService, telemetryService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, _next) => {
    res.redirect(req.portalType === 'staff' ? PATHS.STAFF_LANDING_PAGE : PATHS.LANDING_PAGE)
  })

  pinPhoneRoutes(router, auditService, telemetryService)
  // staff pin phone routes
  staffPinPhoneRoutes(router, auditService, telemetryService, requirePortal('staff'))
  buyPinPhoneCreditRoutes(router, auditService, pinPhoneService, telemetryService)
  checkOrderDetailsRoutes(router, auditService, pinPhoneService, telemetryService)
  buyCreditConfirmation(router, auditService, telemetryService)
  viewContacts(router, auditService, pinPhoneService, telemetryService)
  return router
}
