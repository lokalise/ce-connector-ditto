import axios from 'axios'
import type { IntegrationConfig } from 'src/types'

import config from '../config'

// API key flow
const validate = async (integrationConfig: IntegrationConfig) => {
  if (typeof integrationConfig.apiKey !== 'string') {
    return undefined
  }

  try {
    const res = await axios.get(`${config.app.dittoUrl}/components`, {
      headers: {
        Authorization: `token ${integrationConfig.apiKey}`,
        origin: 'lokalise',
      },
    })

    if (res.status !== 200) {
      return undefined
    }

    return {
      apiKey: integrationConfig.apiKey,
    }
  } catch {
    return undefined
  }
}

// OAuth flow
const generateAuthorizationUrl = async () => {
  // OAuth not used
  return Promise.resolve({
    url: 'https://example.io',
  })
}

const refresh = async () => {
  // OAuth not used
  return Promise.resolve({
    key: 'apiKey',
  })
}

const getAuthCredentials = async () => {
  // OAuth not used
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
