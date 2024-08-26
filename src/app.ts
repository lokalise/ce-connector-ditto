import type http from 'http'

import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import { fastifyCors } from '@fastify/cors'
import {
  bugsnagPlugin,
  getRequestIdFastifyAppConfig,
  metricsPlugin,
  publicHealthcheckPlugin,
} from '@lokalise/fastify-extras'
import type { FastifyBaseLogger } from 'fastify'
import fastify from 'fastify'
import customHealthCheck from 'fastify-custom-healthcheck'
import fastifyGracefulShutdown from 'fastify-graceful-shutdown'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

import { getConfig, isDevelopment } from './infrastructure/config'
import { registerDependencies } from './infrastructure/diConfig'
import { errorHandler } from './infrastructure/errors/errorHandler'
import { resolveGlobalErrorLogObject } from './infrastructure/errors/globalErrorHandler'
import { resolveLoggerConfiguration } from './infrastructure/logger'
import { routeDefinitions } from './modules/routes'
import { healthcheckPlugin } from './plugins/healthcheckPlugin'
import { integrationConfigPlugin } from './plugins/integrationConfigPlugin'

const GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS = 10000
const API_VERSION = '2.1.1'

const getMajorApiVersion = (): string => {
  return parseInt(API_VERSION).toString()
}

export function getPrefix() {
  return `/v${getMajorApiVersion()}`
}

export type ConfigOverrides = {
  enableMetrics?: boolean
}

export async function getApp(configOverrides: ConfigOverrides = {}) {
  const config = getConfig()
  const appConfig = config.app
  const loggerConfig = resolveLoggerConfiguration(appConfig)
  const logLevels = ['debug', 'trace']
  const enableRequestLogging = logLevels.includes(appConfig.logLevel)

  const app = fastify<http.Server, http.IncomingMessage, http.ServerResponse, FastifyBaseLogger>({
    ...getRequestIdFastifyAppConfig(),
    logger: loggerConfig,
    disableRequestLogging: !enableRequestLogging,
  })

  const versionPrefix = getPrefix()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(fastifyAwilixPlugin, { disposeOnClose: true })
  registerDependencies(
    diContainer,
    {
      app: app,
      logger: app.log,
    },
    {},
  )

  await app.register(integrationConfigPlugin, {
    skipList: [
      '/$', // Healthcheck
      '/health$', // Healthcheck
      ...[`\\/auth$`].map((url) => `^\\${versionPrefix}`.concat(url)),
    ],
  })

  await app.register(customHealthCheck, {
    path: '/',
    logLevel: 'warn',
    info: {
      env: appConfig.nodeEnv,
      version: appConfig.appVersion,
      gitCommitSha: appConfig.gitCommitSha,
    },
    schema: false,
    exposeFailure: false,
  })
  await app.register(publicHealthcheckPlugin, {
    url: '/health',
    healthChecks: [],
    responsePayload: {
      version: appConfig.appVersion,
      gitCommitSha: appConfig.gitCommitSha,
    },
  })
  await app.register(healthcheckPlugin)

  // Vendor-specific plugins
  if (configOverrides.enableMetrics) {
    await app.register(metricsPlugin, {
      bindAddress: appConfig.bindAddress,
      errorObjectResolver: resolveGlobalErrorLogObject,
      loggerOptions: loggerConfig,
      disablePrometheusRequestLogging: true,
    })
  }

  await app.register(bugsnagPlugin, {
    isEnabled: config.vendors.bugsnag.isEnabled,
    bugsnag: {
      apiKey: config.vendors.bugsnag.apiKey ?? '',
      releaseStage: appConfig.appEnv,
      appVersion: appConfig.appVersion,
    },
  })

  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      if (origin === undefined) {
        cb(null, false)
        return
      }

      const hostname = new URL(origin).hostname

      // CE pass-through
      if (hostname.endsWith('.lokalise.cloud')) {
        cb(null, true)
        return
      }

      // Local pass-through, if app is in development
      if (isDevelopment() && hostname === 'localhost') {
        cb(null, true)
        return
      }

      // Generate an error on other origins, disabling access
      cb(new Error('Not allowed'), false)
    },
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
    exposedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
    ],
  })

  if (!isDevelopment()) {
    await app.register(fastifyGracefulShutdown, {
      resetHandlersOnInit: true,
      timeout: GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS,
    })
  }
  app.setErrorHandler(errorHandler)

  app.after(() => {
    routeDefinitions.routes.forEach((route) =>
      app.withTypeProvider<ZodTypeProvider>().route({
        ...route,
        url: versionPrefix.concat(route.url),
      }),
    )

    // Graceful shutdown hook
    if (!isDevelopment()) {
      app.gracefulShutdown((signal, next) => {
        app.log.info('Starting graceful shutdown')
        next()
      })
    }
  })

  await app.ready()

  return app
}
