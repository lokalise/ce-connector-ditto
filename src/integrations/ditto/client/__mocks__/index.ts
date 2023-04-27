import iterableData from './__data'

const getTemplateById = jest.fn(({ templateType, locale }) => {
  switch (templateType) {
    case 'Email': {
      return locale == 'fr' ? iterableData.emailTemplates.fr : iterableData.emailTemplates.en
    }
    case 'Push': {
      return locale == 'fr' ? iterableData.pushTemplates.fr : iterableData.pushTemplates.en
    }
    case 'InApp': {
      return locale == 'fr' ? iterableData.inAppTempaltes.fr : iterableData.inAppTempaltes.en
    }
    case 'SMS': {
      return locale == 'fr' ? iterableData.smsTemplates.fr : iterableData.smsTemplates.en
    }
  }
})

const getTemplates = jest.fn((apiKey, messageMedium) => {
  switch (messageMedium) {
    case 'Email': {
      return iterableData.templatesList.Email
    }
    case 'Push': {
      return iterableData.templatesList.Push
    }
    case 'InApp': {
      return iterableData.templatesList.InApp
    }
    case 'SMS': {
      return iterableData.templatesList.SMS
    }
  }
})

export default {
  getTemplateById,
  getTemplates,
  getLocales: jest.fn().mockResolvedValue(iterableData.locales),
  getAllUserFields: jest.fn().mockResolvedValue(iterableData.getAllUserFields),
  updateTemplate: jest.fn().mockResolvedValue({
    msg: 'Success',
    code: 200,
  }),
  getPushTemplateById: jest.fn().mockResolvedValue(iterableData.pushTemplates.en),
}
