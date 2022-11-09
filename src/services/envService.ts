import type { AuthConfig, IntegrationConfig } from 'src/types'

const getLocales = async (config: IntegrationConfig, auth: AuthConfig) => {
  // The default locale will just map to the base text in Ditto
  return Promise.resolve({
    defaultLocale: 'base',
    locales: [],
  })
}

const getCacheItemStructure = async (config: IntegrationConfig, auth: AuthConfig) => {
  return Promise.resolve({
    folder: 'Folder',
  })
}

const envService = {
  getLocales,
  getCacheItemStructure,
}

export default envService
