import type { Dependencies } from '../../../infrastructure/diConfig'

import { APIAbstract } from './APIAbstract'
import type { UpdateVariantRequestBody, WorkspaceComponentsByName } from './types'

export class APIDitto extends APIAbstract {
  constructor({ config }: Dependencies) {
    const host = config.integrations.ditto.baseUrl
    if (!host) {
      throw new Error('Ditto API path not provided')
    }
    super(host)
  }

  public async getWorkspaceComponents(apiKey: string) {
    return this.get<WorkspaceComponentsByName>('/components', {
      apiKey,
    })
  }

  public async updateVariant(
    apiKey: string,
    variant: string,
    updateVariantPayload: UpdateVariantRequestBody,
  ) {
    console.log(updateVariantPayload, 'updateVariantPayload!!!!!!!!!!!!!!!!!!!!1')
    return this.put<any>('/components', {
      apiKey,
      body: updateVariantPayload,
      query: { variant },
    })
  }
}
