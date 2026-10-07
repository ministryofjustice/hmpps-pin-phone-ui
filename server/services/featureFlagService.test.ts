import FeatureFlagService from './featureFlagService'
import createFliptClient from '../data/fliptClient'
import logger from '../../logger'

jest.mock('../data/fliptClient')
jest.mock('../../logger')

const mockEvaluateBoolean = jest.fn()
const mockClose = jest.fn()

const mockClient = {
  evaluateBoolean: mockEvaluateBoolean,
  close: mockClose,
}

;(createFliptClient as jest.Mock).mockResolvedValue(mockClient)

describe('FeatureFlagService', () => {
  let service: FeatureFlagService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new FeatureFlagService()
  })

  describe('isEnabled', () => {
    it('returns true when flag is enabled', async () => {
      mockEvaluateBoolean.mockReturnValue({ enabled: true })

      const result = await service.isEnabled('view-contacts', 'CKI', { prisonId: 'CKI' })

      expect(result).toBe(true)
      expect(mockEvaluateBoolean).toHaveBeenCalledWith({
        flagKey: 'view-contacts',
        entityId: 'CKI',
        context: { prisonId: 'CKI' },
      })
    })

    it('returns false when flag is disabled', async () => {
      mockEvaluateBoolean.mockReturnValue({ enabled: false })

      const result = await service.isEnabled('view-contacts', 'XYZ', { prisonId: 'XYZ' })

      expect(result).toBe(false)
    })

    it('returns false by default when evaluation fails', async () => {
      mockEvaluateBoolean.mockImplementation(() => {
        throw new Error('connection refused')
      })

      const result = await service.isEnabled('view-contacts', 'CKI', { prisonId: 'CKI' })

      expect(result).toBe(false)
      expect(logger.error).toHaveBeenCalledWith('Flipt evaluation failed for flag view-contacts', expect.any(Error))
    })

    it('returns custom default when evaluation fails', async () => {
      mockEvaluateBoolean.mockImplementation(() => {
        throw new Error('connection refused')
      })

      const result = await service.isEnabled('show-banana', 'banana', {}, true)

      expect(result).toBe(true)
    })
  })
})
