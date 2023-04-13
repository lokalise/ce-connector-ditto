import { Client } from 'undici'
import type { Dispatcher, errors } from 'undici'

import { AuthFailedError } from '../../../infrastructure/errors/publicErrors'

import type { ApiRequest } from './types'
import { isErrorResponse } from './types'

export class APIAbstract {
  private readonly undiciClient: Client

  constructor(apiEndpoint: string) {
    this.undiciClient = new Client(apiEndpoint)
  }

  public async send<R>(method: Dispatcher.HttpMethod, url: string, req: ApiRequest): Promise<R> {
    const { body, headers = {}, apiKey, query, throwOnError = true } = req

    const finalHeaders = {
      Authorization: `token ${apiKey}`,
      origin: 'lokalise',
      'Content-Type': 'application/json',
      ...headers,
    }

    const response = await this.undiciClient.request({
      method,
      path: url,
      headers: finalHeaders,
      query,
      body: body ? JSON.stringify(body) : undefined,
      throwOnError,
    })
    return this.parseResponse<R>(response)
  }

  private async parseResponse<R>(response: Dispatcher.ResponseData): Promise<R> {
    const contentType = response.headers['content-type']
    if (
      !contentType ||
      (typeof contentType === 'string' && !contentType.startsWith('application/json'))
    ) {
      return (await response.body.text()) as unknown as R
    }

    return (await response.body.json()) as R
  }

  public async get<R>(url: string, req: ApiRequest): Promise<R> {
    try {
      return await this.send<R>('GET', url, req)
    } catch (error) {
      return this.handleError(error as errors.ResponseStatusCodeError)
    }
  }

  public async post<R>(url: string, req: ApiRequest): Promise<R> {
    try {
      return await this.send<R>('POST', url, req)
    } catch (error) {
      return this.handleError(error as errors.ResponseStatusCodeError)
    }
  }

  public async put<R>(url: string, req: ApiRequest): Promise<R> {
    try {
      return await this.send<R>('PUT', url, req)
    } catch (error) {
      return this.handleError(error as errors.ResponseStatusCodeError)
    }
  }

  public isValidNotFoundResponse = (data: unknown): boolean => {
    if (!isErrorResponse(data)) return false
    return (
      data.body.code === 'NotFound' && data.body.msg.includes('Content does not exist for locale')
    )
  }

  private handleError(error: errors.ResponseStatusCodeError): never {
    if (error.statusCode === 401) {
      throw new AuthFailedError()
    }
    throw error
  }
}
