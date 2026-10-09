import { FliptClient } from '@flipt-io/flipt-client-js'
import createFliptClient from '../data/fliptClient'
import logger from '../../logger'

export default class FeatureFlagService {
  private client: FliptClient | null = null

  private async getClient(): Promise<FliptClient> {
    if (!this.client) {
      this.client = await createFliptClient()
    }
    return this.client
  }

  async isEnabled(
    flagKey: string,
    entityId: string,
    context: Record<string, string> = {},
    defaultValue: boolean = false,
  ): Promise<boolean> {
    try {
      const client = await this.getClient()
      const result = client.evaluateBoolean({ flagKey, entityId, context })
      return result.enabled
    } catch (error) {
      logger.error(`Flipt evaluation failed for flag ${flagKey}`, error)
      return defaultValue
    }
  }

  close(): void {
    this.client?.close()
    this.client = null
  }
}
