import './server/utils/azureAppInsights'

import app from './server/index'
import logger from './logger'
import { featureFlagService } from './server/services'

const server = app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down')
  featureFlagService.close()
  server.close(() => {
    process.exit(0)
  })
})
