const environments: { [key: string]: string[] } = {
  PROD: ['EEI'],
  PREPROD: [],
  TEST: ['BWI', 'CKI', 'RNI', 'WLI'],
  DEV: ['BWI', 'CKI', 'RNI', 'WLI'],
}

// eslint-disable-next-line import/prefer-default-export
export const ACTIVE_AGENCIES: readonly string[] = environments[process.env.ENVIRONMENT_NAME] || []
