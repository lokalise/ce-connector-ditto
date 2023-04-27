export const MultiStatusErrorCode = 'SOME_ITEMS_HAVE_ERRORS'

export enum SingleItemErrorCode {
  ItemNotFoundErrorCode = 'ITEM_NOT_FOUND_ERROR',
  UnrecognizedErrorCode = 'UNRECOGNIZED_ERROR',
  ClientErrorCode = 'CLIENT_ERROR',
}

export enum PerLocaleErrorCode {
  UnrecognizedErrorCode = 'UNRECOGNIZED_ERROR',
  ClientErrorCode = 'CLIENT_ERROR',
}

export interface BaseErrorInfo {
  uniqueId: string
}

export interface ErrorInfoWithErrorCode extends BaseErrorInfo {
  errorCode: SingleItemErrorCode
  userErrors?: never
  perLocaleErrors?: never
}

export interface ErrorInfoWithUserErrors extends BaseErrorInfo {
  errorCode?: never
  userErrors: string[]
  perLocaleErrors?: never
}

export type PerLocaleError =
  | {
      userErrors: string[]
      errorCode?: never
    }
  | {
      errorCode: PerLocaleErrorCode
      userErrors?: never
    }

export interface ErrorInfoWithPerLocaleErrors extends BaseErrorInfo {
  errorCode?: never
  userErrors?: never
  perLocaleErrors: Record<string, PerLocaleError>
}

export type ErrorInfo =
  | ErrorInfoWithErrorCode
  | ErrorInfoWithUserErrors
  | ErrorInfoWithPerLocaleErrors

export default interface MultiStatusErrorResponse {
  statusCode: number
  items: unknown[]
  payload: {
    message: string
    errorCode: typeof MultiStatusErrorCode
    details: {
      errors: ErrorInfo[]
    }
  }
}
