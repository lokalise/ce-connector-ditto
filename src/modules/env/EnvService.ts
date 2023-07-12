export class EnvService {
  async getLocales() {
    // The default locale will just map to the base text in Ditto
    return Promise.resolve({
      defaultLocale: 'base',
      locales: [],
    })
  }

  async getCacheItemStructure() {
    return Promise.resolve({
      componentId: 'Component ID',
      status: 'Status',
      folder: 'Folder',
      notes: 'Notes',
      tags: 'Tags',
    })
  }
}
