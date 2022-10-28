import axios from 'axios'
import config from 'src/config'
import { structuredComponentsResponse } from './schema'

export const getWorkspaceComponents = async (apiKey: string) => {
  const res = await axios.get(`${config.app.dittoUrl}/components`, {
    headers: { Authorization: `Bearer ${apiKey}` },
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
    groupName,
    name: joinedName,
  }
}
