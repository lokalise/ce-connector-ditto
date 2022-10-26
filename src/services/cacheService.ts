import axios from 'axios'
import config from 'src/config'
import type { AuthConfig, IntegrationConfig, ItemIdentifiers } from '../types'
import { structuredComponentsResponse } from './schema'

const listItems = async (integrationConfig: IntegrationConfig, auth: AuthConfig) => {
  if (!String(auth.apiKey) || auth.apiKey === '') {
    return undefined
  }

  const validatedData = await getWorkspaceComponents(auth.apiKey as string)

  if (!validatedData || !validatedData.success) {
    console.error('Unexpected data from Ditto')
    return undefined
  }

  return Object.entries(validatedData.data).map(([id, data]) => ({
    uniqueId: id,
    groupId: parseName(data.name).groupName || 'null',
    metadata: {},
  }))
}

const getItems = async (config: IntegrationConfig, auth: AuthConfig, ids: ItemIdentifiers[]) => {
  if (!String(auth.apiKey) || auth.apiKey === '') {
    return undefined
  }

  const validatedData = await getWorkspaceComponents(auth.apiKey as string)

  if (!validatedData || !validatedData.success) {
    console.error('Unexpected data from Ditto')
    return undefined
  }

  const desiredIds = ids.map((id) => id.uniqueId)
  const filteredWorkspaceComponentEntries = Object.entries(validatedData.data).filter(
    ([wsCompId]) => desiredIds.includes(wsCompId),
  )

  return filteredWorkspaceComponentEntries.map(([id, data]) => ({
    uniqueId: id,
    groupId: parseName(data.name).groupName || 'null',
    metadata: {},
    fields: {
      folder: data.folder || '',
    },
    title: data.name,
    groupTitle: parseName(data.name).groupName || 'No group',
  }))
}

const getWorkspaceComponents = async (apiKey: string) => {
  const res = await axios.get(`${config.app.dittoUrl}/components`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (res.status !== 200) {
    return undefined
  }

  return structuredComponentsResponse.safeParse(res.data)
}

const parseName = (name: string) => {
  if (!name.includes('/')) {
    return { groupName: null, name }
  }

  const [groupName, ...nameSplit] = name.split('/')
  const joinedName = nameSplit.join('/')

  return {
    groupName,
    name: joinedName,
  }
}

const cacheService = {
  listItems,
  getItems,
}

export default cacheService
