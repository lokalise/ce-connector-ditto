import type { InternalError } from '@lokalise/node-core'

import type {
  ErrorInfoWithPerLocaleErrors,
  PerLocaleError,
} from '../../../infrastructure/errors/MultiStatusErrorResponse'
import { PerLocaleErrorCode } from '../../../infrastructure/errors/MultiStatusErrorResponse'
import { AuthFailedError } from '../../../infrastructure/errors/publicErrors'
import type { DittoError } from '../client/types'
import { isErrorResponse } from '../client/types'

export const buildTranslatePublishError = (
  error: InternalError,
  rejectedUniqueId: string,
  rejectedLocale: string,
): ErrorInfoWithPerLocaleErrors => {
  const httpStatusCode = (error.details?.response as DittoError).statusCode

  if (httpStatusCode === 401) {
    throw new AuthFailedError()
  }
  return {
    uniqueId: rejectedUniqueId,
    perLocaleErrors: buildPerLocaleErrors(error, rejectedLocale),
  }
}

export const buildPerLocaleErrors = (
  error: InternalError,
  rejectedLocale: string,
): Record<string, PerLocaleError> => {
  const httpStatusCode = (error.details?.response as DittoError).statusCode

  if (httpStatusCode === 401) {
    throw new AuthFailedError()
  }
  return {
    [rejectedLocale]:
      isErrorResponse(error) && (httpStatusCode === 404 || httpStatusCode === 400)
        ? { userErrors: [error.body.msg] }
        : { errorCode: PerLocaleErrorCode.UnrecognizedErrorCode },
  }
}

export const parseName = (name: string) => {
  if (!name.includes('/') || name.includes('Other components')) {
    return { groupName: null, name }
  }

  const [groupName, ...nameSplit] = name.split('/')
  const joinedName = nameSplit.join('/')

  return {
    groupName: groupName,
    name: joinedName,
  }
}
