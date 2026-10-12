import express, { Express } from 'express'
import createError, { NotFound } from 'http-errors'

import { randomUUID } from 'crypto'
import { LaunchpadUser } from '@ministryofjustice/hmpps-prisoner-auth'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { Services } from '../../services'
import AuditService from '../../services/auditService'
import { HmppsUser, PrisonUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import HmppsAuditClient from '../../data/hmppsAuditClient'
import { DigitalPinPhoneApiClient } from '../../data'
import PinPhoneService from '../../services/pinPhoneService'
import TelemetryService from '../../services/telemetryService'
import { ApplicationInfo } from '../../applicationInfo'

jest.mock('../../services/auditService')
jest.mock('../../data/digitalPinPhoneApiClient')
jest.mock('../../services/telemetryService')

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
  productId: '1',
  branchName: 'main',
}

export const idToken = {
  name: 'name',
  given_name: 'FIRST',
  family_name: 'LAST',
  nonce: 'a nonce',
  iat: 123456,
  aud: 'aud',
  sub: 'sub',
  exp: 769012,
  booking: {
    id: '12345',
  },
  establishment: {
    id: '34567',
    agency_id: 'HEI',
    name: 'name',
    display_name: 'display name',
    youth: false,
  },
  iss: 'iss',
}

export const user: LaunchpadUser = {
  refreshToken: 'REFRESH_TOKEN',
  idToken,
  accessToken: 'ACCESS_TOKEN',
  token: 'ACCESS_TOKEN',
  authSource: 'prisoner-auth',
  name: '',
  username: '',
  userId: 'id',
  userUuid: undefined,
  displayName: '',
  userRoles: [],
  establishment: {
    agency_id: 'HEI',
    name: 'name',
    display_name: 'display name',
    youth: false,
  },
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean, userSupplier: () => HmppsUser): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, testAppInfo)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
      cspNonce: '',
      csrfToken: '',
      asset_path: '',
      applicationName: '',
      environmentName: '',
      environmentNameColour: '',
    }
    next()
  })
  app.use((req, _res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.get('/error', (_req, _res, next) => next(createError(500, 'Test Error')))
  app.get('/medusa-error', (_req, _res, next) => {
    const error = createError(400, 'Bad Request')
    error.data = { status: 400, userMessage: 'Medusa service is currently unavailable' }
    next(error)
  })
  app.use((_req, _res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService({} as HmppsAuditClient) as jest.Mocked<AuditService>,
    pinPhoneService: new PinPhoneService({} as DigitalPinPhoneApiClient) as jest.Mocked<PinPhoneService>,
    telemetryService: new TelemetryService(null) as jest.Mocked<TelemetryService>,
  },
  userSupplier = () => user,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
}): Express {
  return appSetup(services as Services, production, userSupplier)
}
