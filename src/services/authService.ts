import axios from 'axios'
import config from 'src/config'
import type { PostAuthResultRequestPayload } from 'src/routes/auth/types'
import type { AuthConfig, IntegrationConfig } from 'src/types'

// API key flow
const validate = async (integrationConfig: IntegrationConfig) => {
  try {
    const res = await axios.get(`${config.app.dittoUrl}/components`, {
      headers: { Authorization: `Bearer ${integrationConfig.apiKey}` },
    })

    if (res.status !== 200) {
      return undefined
    }

    return {
      key: 'apiKey',
    }
  } catch {
    return undefined
  }
}

// OAuth flow
const generateAuthorizationUrl = async (config: IntegrationConfig) => {
  // TODO: implementation
  // response structure depends on auth strategy and platform specificity
  return Promise.resolve({
    url: 'https://example.io',
  })
}

const refresh = async (config: IntegrationConfig, auth: AuthConfig) => {
  // TODO: implementation
  // response structure depends on auth strategy and platform specificity
  return Promise.resolve({
    key: 'apiKey',
  })
}

const getAuthCredentials = async (authData: PostAuthResultRequestPayload) => {
  // TODO: implementation
  return Promise.resolve({
    accessToken: 'accessToken',
    expiresIn: 2000,
    refreshToken: 'refreshToken',
  })
}

const authService = {
  validate,
  refresh,
  getAuthCredentials,
  generateAuthorizationUrl,
}

export default authService
