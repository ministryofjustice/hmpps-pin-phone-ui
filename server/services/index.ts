import { dataAccess } from '../data'
import AuditService from './auditService'
import PinPhoneService from './pinPhoneService'
import TelemetryService from './telemetryService'
import FeatureFlagService from './featureFlagService'

const featureFlagService = new FeatureFlagService()

export { featureFlagService }

export const services = () => {
  const { applicationInfo, hmppsAuditClient, pinPhoneApiClient, applicationInsightsClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    telemetryService: new TelemetryService(applicationInsightsClient),
    pinPhoneService: new PinPhoneService(pinPhoneApiClient),
    featureFlagService,
  }
}

export type Services = ReturnType<typeof services>
