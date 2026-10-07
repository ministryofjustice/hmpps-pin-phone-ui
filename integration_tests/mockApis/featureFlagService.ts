import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/flipt/health',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubFeatureFlags: (flags: { key: string; enabled: boolean }[] = []): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/flipt/internal/v1/evaluation/snapshot/namespace/hmpps-pin-phone',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          namespace: {
            key: 'hmpps-pin-phone',
          },
          flags: flags.map(flag => ({
            key: flag.key,
            name: flag.key,
            description: '',
            enabled: flag.enabled,
            type: 'BOOLEAN_FLAG_TYPE',
            createdAt: '2026-10-06T00:00:00Z',
            updatedAt: '2026-10-06T00:00:00Z',
            rules: [],
            rollouts: [],
          })),
        },
      },
    }),
}
