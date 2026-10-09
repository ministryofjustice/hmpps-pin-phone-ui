import { FliptClient } from '@flipt-io/flipt-client-js'
import config from '../config'

const createFliptClient = async (): Promise<FliptClient> => {
  return FliptClient.init({
    url: config.apis.fliptClient.url,
    namespace: config.apis.fliptClient.namespace,
    updateInterval: 120,
  })
}

export default createFliptClient
