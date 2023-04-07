/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from 'axios'

// import { structuredComponentsResponse } from './schema'
import { getConfig } from '../infrastructure/config'

import { structuredComponentsResponse } from './schema'

export const getWorkspaceComponents = async (apiKey: string) => {
  const res = await axios.get(`${getConfig().integrations.ditto.baseUrl}/components`, {
    headers: { Authorization: `token ${apiKey}`, origin: 'lokalise' },
  })
  if (res.status !== 200) {
    return undefined
  }

  return structuredComponentsResponse.safeParse(res.data)
}

export const parseName = (name: string) => {
  if (!name.includes('/')) {
    return { groupName: null, name }
  }

  const [groupName, ...nameSplit] = name.split('/')
  const joinedName = nameSplit.join('/')

  return {
    groupName: groupName,
    name: joinedName,
  }
}

export type VariantUpdateData = Record<string, Record<string, { text: string }>>

export const updateVariants = async (toUpdate: VariantUpdateData, apiKey: string) => {
  const updatePromises: Array<Promise<unknown>> = Object.entries(toUpdate).map(([variant, data]) =>
    axios.put(
      `${getConfig().integrations.ditto.baseUrl}/components?variant=${variant}`,
      { data },
      {
        headers: { Authorization: `token ${apiKey}`, origin: 'lokalise' },
      },
    ),
  )

  await Promise.all(updatePromises)
}
