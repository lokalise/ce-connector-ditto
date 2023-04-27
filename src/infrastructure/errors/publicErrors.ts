import { PublicNonRecoverableError } from './PublicNonRecoverableError'

export type CommonErrorParams = {
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>
}

export type OptionalMessageErrorParams = {
  message?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>
}

export class AuthFailedError extends PublicNonRecoverableError {
  constructor(params: OptionalMessageErrorParams = {}) {
    super({
      message: params.message ?? 'Authorization failed',
      errorCode: 'AUTH_FAILED_ERROR',
      httpStatusCode: 401,
      details: {
        error: 'Invalid api key',
      },
    })
  }
}

export class AuthInvalidDataError extends PublicNonRecoverableError {
  constructor(params: OptionalMessageErrorParams = {}) {
    super({
      message: params.message ?? 'Invalid authentication data',
      errorCode: 'AUTH_INVALID_DATA_ERROR',
      httpStatusCode: 400,
      details: {
        errors: [
          {
            apiKey: ['The apiKey should not be empty'],
          },
        ],
      },
    })
  }
}

export class UnrecognizedError extends PublicNonRecoverableError {
  constructor(params: OptionalMessageErrorParams = {}) {
    super({
      message: params.message ?? 'Unrecognized error',
      errorCode: 'UNRECOGNIZED_ERROR',
      httpStatusCode: 500,
    })
  }
}
