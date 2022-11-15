const getLocales = async () => {
  // The default locale will just map to the base text in Ditto
  return Promise.resolve({
    defaultLocale: 'base',
    locales: [],
  })
}

const getCacheItemStructure = async () => {
  return Promise.resolve({
    folder: 'Folder',
  })
}

const envService = {
  getLocales,
  getCacheItemStructure,
}

export default envService
