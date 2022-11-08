import type { AuthConfig, IntegrationConfig } from 'src/types'

const getLocales = async (config: IntegrationConfig, auth: AuthConfig) => {
  return Promise.resolve({
    defaultLocale: 'en',
    locales: [],
  })
}

const getCacheItemStructure = async (config: IntegrationConfig, auth: AuthConfig) => {
  return Promise.resolve({})
}

const envService = {
  getLocales,
  getCacheItemStructure,
}

export default envService
