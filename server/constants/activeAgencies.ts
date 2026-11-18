const environments: { [key: string]: string[] } = {
  PROD: ['EEI'],
  PREPROD: ['BWI', 'CKI', 'RNI', 'EEI', 'WLI'],
  TEST: ['BWI', 'CKI', 'RNI', 'EEI', 'WLI'],
  DEV: ['BWI', 'CKI', 'RNI', 'EEI', 'WLI'],
}

// eslint-disable-next-line import/prefer-default-export
export const ACTIVE_AGENCIES: readonly string[] = environments[process.env.ENVIRONMENT_NAME] || []
