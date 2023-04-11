import type { APIIterable } from './client/APIIterable'
import iterableData from './client/__mocks__/__data'

import {
  getCacheItemStructure,
  getContent,
  getItems,
  getLocales,
  listItems,
  publishContent,
  refresh,
  validate,
} from '.'

const getTemplateByIdMock = jest.fn()
const updateTemplateMock = jest.fn()
const apiIterable = {
  getTemplateById: getTemplateByIdMock,
  getTemplates: (apiKey: string, messageMedium: string) => {
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
  },
  getLocales: () => iterableData.locales,
  getAllUserFields: () => iterableData.getAllUserFields,
  updateTemplate: updateTemplateMock.mockImplementation(() => ({
    msg: 'Success',
    code: 200,
  })),

  getPushTemplateById: () => iterableData.pushTemplates.en,
}

const cacheItemsRequestBody = {
  items: [
    {
      metadata: { contentType: 'subject', templateType: 'Email' },
      uniqueId: '6341135||subject',
      groupId: '6341135',
    },
    {
      metadata: { contentType: 'preheaderText', templateType: 'Email' },
      uniqueId: '6341135||preheaderText',
      groupId: '6341135',
    },
    {
      metadata: { contentType: 'html', templateType: 'Email' },
      uniqueId: '6341135||html',
      groupId: '6341135',
    },
    {
      metadata: { contentType: 'payload', templateType: 'Push' },
      uniqueId: '7224465||payload',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'title', templateType: 'Push' },
      uniqueId: '7224465||title',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'message', templateType: 'Push' },
      uniqueId: '7224465||message',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonTitle_1', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_1',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonIdentifier_1', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_1',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonTitle_2', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_2',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonIdentifier_2', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_2',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_3',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonIdentifier_3', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_3',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonInputPlaceholder_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputPlaceholder_3',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'buttonInputTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputTitle_3',
      groupId: '7224465',
    },
    {
      metadata: { contentType: 'payload', templateType: 'InApp' },
      uniqueId: '7224454||payload',
      groupId: '7224454',
    },
    {
      metadata: { contentType: 'html', templateType: 'InApp' },
      uniqueId: '7224454||html',
      groupId: '7224454',
    },
    {
      metadata: { contentType: 'message', templateType: 'SMS' },
      uniqueId: '7232189||message',
      groupId: '7232189',
    },
  ],
}

const getItemsResponse = {
  errors: [],
  items: [
    {
      fields: {
        templateId: 6341135,
        updated: '09-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Email',
      },
      groupTitle: 'Template Email name in English',
      title: 'Subject',
      metadata: { contentType: 'subject', templateType: 'Email' },
      uniqueId: '6341135||subject',
      groupId: '6341135',
    },
    {
      fields: {
        templateId: 6341135,
        updated: '09-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Email',
      },
      groupTitle: 'Template Email name in English',
      title: 'Preheader text',
      metadata: { contentType: 'preheaderText', templateType: 'Email' },
      uniqueId: '6341135||preheaderText',
      groupId: '6341135',
    },
    {
      fields: {
        templateId: 6341135,
        updated: '09-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Email',
      },
      groupTitle: 'Template Email name in English',
      title: 'Html',
      metadata: { contentType: 'html', templateType: 'Email' },
      uniqueId: '6341135||html',
      groupId: '6341135',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Payload',
      metadata: { contentType: 'payload', templateType: 'Push' },
      uniqueId: '7224465||payload',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Title',
      metadata: { contentType: 'title', templateType: 'Push' },
      uniqueId: '7224465||title',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Message',
      metadata: { contentType: 'message', templateType: 'Push' },
      uniqueId: '7224465||message',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Title of the first button',
      metadata: { contentType: 'buttonTitle_1', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_1',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Identifier of the first button',
      metadata: { contentType: 'buttonIdentifier_1', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_1',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Title of the second button',
      metadata: { contentType: 'buttonTitle_2', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_2',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Identifier of the second button',
      metadata: { contentType: 'buttonIdentifier_2', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_2',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Title of the third button',
      metadata: { contentType: 'buttonTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_3',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Identifier of the third button',
      metadata: { contentType: 'buttonIdentifier_3', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_3',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Input placeholder of the third button',
      metadata: { contentType: 'buttonInputPlaceholder_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputPlaceholder_3',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224465,
        updated: '05-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'Push',
      },
      groupTitle: 'Template Push name in English',
      title: 'Input title of the third button',
      metadata: { contentType: 'buttonInputTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputTitle_3',
      groupId: '7224465',
    },
    {
      fields: {
        templateId: 7224454,
        updated: '09-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'In-app',
      },
      groupTitle: 'Template InApp name',
      title: 'Payload',
      metadata: { contentType: 'payload', templateType: 'InApp' },
      uniqueId: '7224454||payload',
      groupId: '7224454',
    },
    {
      fields: {
        templateId: 7224454,
        updated: '09-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'In-app',
      },
      groupTitle: 'Template InApp name',
      title: 'Html',
      metadata: { contentType: 'html', templateType: 'InApp' },
      uniqueId: '7224454||html',
      groupId: '7224454',
    },
    {
      fields: {
        templateId: 7232189,
        updated: '09-08-2022',
        creator: 'partners@lokalise.com',
        templateType: 'SMS',
      },
      groupTitle: 'Test SMS template',
      title: 'Message',
      metadata: { contentType: 'message', templateType: 'SMS' },
      uniqueId: '7232189||message',
      groupId: '7232189',
    },
  ],
}
const getItemsResponseWithErrors = {
  items: [],
  errors: [
    { uniqueId: '6341135||subject', errorCode: 'UNRECOGNIZED_ERROR' },
    {
      uniqueId: '6341135||preheaderText',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    { uniqueId: '6341135||html', errorCode: 'UNRECOGNIZED_ERROR' },
    { uniqueId: '7224465||payload', errorCode: 'UNRECOGNIZED_ERROR' },
    { uniqueId: '7224465||title', errorCode: 'UNRECOGNIZED_ERROR' },
    { uniqueId: '7224465||message', errorCode: 'UNRECOGNIZED_ERROR' },
    {
      uniqueId: '7224465||buttonTitle_1',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    {
      uniqueId: '7224465||buttonIdentifier_1',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    {
      uniqueId: '7224465||buttonTitle_2',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    {
      uniqueId: '7224465||buttonIdentifier_2',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    {
      uniqueId: '7224465||buttonTitle_3',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    {
      uniqueId: '7224465||buttonIdentifier_3',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    {
      uniqueId: '7224465||buttonInputPlaceholder_3',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    {
      uniqueId: '7224465||buttonInputTitle_3',
      errorCode: 'UNRECOGNIZED_ERROR',
    },
    { uniqueId: '7224454||payload', errorCode: 'ITEM_NOT_FOUND_ERROR' },
    { uniqueId: '7224454||html', errorCode: 'ITEM_NOT_FOUND_ERROR' },
    { uniqueId: '7232189||message', errorCode: 'ITEM_NOT_FOUND_ERROR' },
  ],
}
const contentItem = {
  items: [
    {
      metadata: { contentType: 'subject', templateType: 'Email' },
      uniqueId: '6341135||subject',
      groupId: '6341135',
      translations: { en: 'new subject in English', fr: 'new subject in French' },
    },
    {
      metadata: { contentType: 'preheaderText', templateType: 'Email' },
      uniqueId: '6341135||preheaderText',
      groupId: '6341135',
      translations: { en: 'new preheader text in English', fr: 'new preheader text in French' },
    },
    {
      metadata: { contentType: 'html', templateType: 'Email' },
      uniqueId: '6341135||html',
      groupId: '6341135',
      translations: { en: 'new html in English', fr: 'new html in French' },
    },
    {
      metadata: { contentType: 'payload', templateType: 'Push' },
      uniqueId: '7224465||payload',
      groupId: '7224465',
      translations: { en: '{"test":"new in English"}', fr: '{"test":"new in French"}' },
    },
    {
      metadata: { contentType: 'title', templateType: 'Push' },
      uniqueId: '7224465||title',
      groupId: '7224465',
      translations: { en: 'new title in English', fr: 'new title in French' },
    },
    {
      metadata: { contentType: 'message', templateType: 'Push' },
      uniqueId: '7224465||message',
      groupId: '7224465',
      translations: { en: 'new body in English', fr: 'new body in French' },
    },
    {
      metadata: { contentType: 'buttonTitle_1', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_1',
      groupId: '7224465',
      translations: { en: 'New button in English', fr: 'New button in French' },
    },
    {
      metadata: { contentType: 'buttonIdentifier_1', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_1',
      groupId: '7224465',
      translations: { en: 'newButton in English', fr: 'newButton in French' },
    },
    {
      metadata: { contentType: 'buttonTitle_2', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_2',
      groupId: '7224465',
      translations: {
        en: 'New button destructive in English',
        fr: 'New button destructive in French',
      },
    },
    {
      metadata: { contentType: 'buttonIdentifier_2', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_2',
      groupId: '7224465',
      translations: {
        en: 'newButton destructive in English',
        fr: 'newButton destructive in French',
      },
    },
    {
      metadata: { contentType: 'buttonTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_3',
      groupId: '7224465',
      translations: {
        en: 'New button textInput in English',
        fr: 'New button textInput in French',
      },
    },
    {
      metadata: { contentType: 'buttonIdentifier_3', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_3',
      groupId: '7224465',
      translations: {
        en: 'newButton textInput in English',
        fr: 'newButton textInput in French',
      },
    },
    {
      metadata: { contentType: 'buttonInputPlaceholder_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputPlaceholder_3',
      groupId: '7224465',
      translations: {
        en: 'inputPlaceholder in English',
        fr: 'inputPlaceholder in French',
      },
    },
    {
      metadata: { contentType: 'buttonInputTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputTitle_3',
      groupId: '7224465',
      translations: {
        en: 'inputTitle inputPlaceholder in English',
        fr: 'inputTitle inputPlaceholder in French',
      },
    },
    {
      metadata: { contentType: 'payload', templateType: 'InApp' },
      uniqueId: '7224454||payload',
      groupId: '7224454',
      translations: {
        en: '{"test":"new testfield in English"}',
        fr: '{"test":"new testfield in French"}',
      },
    },
    {
      metadata: { contentType: 'html', templateType: 'InApp' },
      uniqueId: '7224454||html',
      groupId: '7224454',
      translations: { en: 'new html in English', fr: 'new html in French' },
    },
    {
      metadata: { contentType: 'message', templateType: 'SMS' },
      uniqueId: '7232189||message',
      groupId: '7232189',
      translations: {
        en: 'new test message body in English',
        fr: 'new test message body in French',
      },
    },
  ],
}

const getContentResponse = {
  errors: [],
  items: [
    {
      metadata: { contentType: 'subject', templateType: 'Email' },
      uniqueId: '6341135||subject',
      groupId: '6341135',
      translations: { en: 'subject in English', fr: 'subject in French' },
    },
    {
      metadata: { contentType: 'preheaderText', templateType: 'Email' },
      uniqueId: '6341135||preheaderText',
      groupId: '6341135',
      translations: { en: 'preheader text in English', fr: 'preheader text in French' },
    },
    {
      metadata: { contentType: 'html', templateType: 'Email' },
      uniqueId: '6341135||html',
      groupId: '6341135',
      translations: { en: 'html in English', fr: 'html in French' },
    },
    {
      metadata: { contentType: 'payload', templateType: 'Push' },
      uniqueId: '7224465||payload',
      groupId: '7224465',
      translations: { en: '{"test":"in English"}', fr: '{"test":"in French"}' },
    },
    {
      metadata: { contentType: 'title', templateType: 'Push' },
      uniqueId: '7224465||title',
      groupId: '7224465',
      translations: { en: 'new title in English', fr: 'new title in French' },
    },
    {
      metadata: { contentType: 'message', templateType: 'Push' },
      uniqueId: '7224465||message',
      groupId: '7224465',
      translations: { en: 'new body in English', fr: 'new body in French' },
    },
    {
      metadata: { contentType: 'buttonTitle_1', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_1',
      groupId: '7224465',
      translations: { en: 'New button in English', fr: 'New button in French' },
    },
    {
      metadata: { contentType: 'buttonIdentifier_1', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_1',
      groupId: '7224465',
      translations: { en: 'newButton in English', fr: 'newButton in French' },
    },
    {
      metadata: { contentType: 'buttonTitle_2', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_2',
      groupId: '7224465',
      translations: {
        en: 'New button destructive in English',
        fr: 'New button destructive in French',
      },
    },
    {
      metadata: { contentType: 'buttonIdentifier_2', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_2',
      groupId: '7224465',
      translations: {
        en: 'newButton destructive in English',
        fr: 'newButton destructive in French',
      },
    },
    {
      metadata: { contentType: 'buttonTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonTitle_3',
      groupId: '7224465',
      translations: {
        en: 'New button textInput in English',
        fr: 'New button textInput in French',
      },
    },
    {
      metadata: { contentType: 'buttonIdentifier_3', templateType: 'Push' },
      uniqueId: '7224465||buttonIdentifier_3',
      groupId: '7224465',
      translations: {
        en: 'newButton textInput in English',
        fr: 'newButton textInput in French',
      },
    },
    {
      metadata: { contentType: 'buttonInputPlaceholder_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputPlaceholder_3',
      groupId: '7224465',
      translations: {
        en: 'inputPlaceholder in English',
        fr: 'inputPlaceholder in French',
      },
    },
    {
      metadata: { contentType: 'buttonInputTitle_3', templateType: 'Push' },
      uniqueId: '7224465||buttonInputTitle_3',
      groupId: '7224465',
      translations: {
        en: 'inputTitle inputPlaceholder in English',
        fr: 'inputTitle inputPlaceholder in French',
      },
    },
    {
      metadata: { contentType: 'payload', templateType: 'InApp' },
      uniqueId: '7224454||payload',
      groupId: '7224454',
      translations: {
        en: '{"test":"testfield in English"}',
        fr: '{"test":"testfield in French"}',
      },
    },
    {
      metadata: { contentType: 'html', templateType: 'InApp' },
      uniqueId: '7224454||html',
      groupId: '7224454',
      translations: { en: 'html in English', fr: 'html in French' },
    },
    {
      metadata: { contentType: 'message', templateType: 'SMS' },
      uniqueId: '7232189||message',
      groupId: '7232189',
      translations: {
        en: 'Test message body in English',
        fr: 'Test message body in French',
      },
    },
  ],
}

const getContentResponseWithErrors = {
  items: [],
  errors: [
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '6341135||subject',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '6341135||preheaderText',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '6341135||html',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||payload',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||title',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||message',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonTitle_1',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonIdentifier_1',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonTitle_2',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonIdentifier_2',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonTitle_3',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonIdentifier_3',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonInputPlaceholder_3',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224465||buttonInputTitle_3',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224454||payload',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7224454||html',
    },
    {
      perLocaleErrors: {
        en: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
        fr: {
          errorCode: 'UNRECOGNIZED_ERROR',
        },
      },
      uniqueId: '7232189||message',
    },
  ],
}

const locales = ['en', 'fr']

describe('Iterable service', () => {
  beforeEach(() => {
    getTemplateByIdMock.mockImplementation(({ templateType, locale }) => {
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
  })
  describe('item listing', () => {
    it('should obtain item identifier list', async () => {
      const key = 'some-key'
      const result = await listItems(apiIterable as unknown as APIIterable, key)
      expect(result).toEqual(cacheItemsRequestBody.items)
    })
  })

  describe('get items', () => {
    it('should obtain item list', async () => {
      const key = 'some-key'
      const result = await getItems(
        apiIterable as unknown as APIIterable,
        key,
        cacheItemsRequestBody.items,
      )
      expect(result).toEqual(getItemsResponse)
    })

    it('should return errors if some of requests are rejected', async () => {
      getTemplateByIdMock.mockImplementation(({ templateType }) => {
        switch (templateType) {
          case 'Email': {
            return Promise.reject({ statusCode: 500 })
          }
          case 'Push': {
            return Promise.reject({ statusCode: 500 })
          }
          case 'InApp': {
            return Promise.reject({ statusCode: 400 })
          }
          case 'SMS': {
            return Promise.reject({ statusCode: 404 })
          }
        }
      })
      const key = 'some-key'
      const { items, errors } = await getItems(
        apiIterable as unknown as APIIterable,
        key,
        cacheItemsRequestBody.items,
      )
      expect(items).toHaveLength(0)
      expect(errors).toHaveLength(17)
      expect(errors).toEqual(getItemsResponseWithErrors.errors)

      getTemplateByIdMock.mockReset()
    })
  })

  describe('get content', () => {
    it('should obtain content item list', async () => {
      const key = 'some-key'
      const result = await getContent(
        apiIterable as unknown as APIIterable,
        key,
        locales,
        cacheItemsRequestBody.items,
      )
      expect(result).toEqual(getContentResponse)
    })

    it('should return errors if some of requests are rejected', async () => {
      getTemplateByIdMock.mockImplementation(({ templateType }) => {
        switch (templateType) {
          case 'Email': {
            return Promise.reject({ statusCode: 500 })
          }
          case 'Push': {
            return Promise.reject({ statusCode: 500 })
          }
          case 'InApp': {
            return Promise.reject({ statusCode: 400 })
          }
          case 'SMS': {
            return Promise.reject({ statusCode: 404 })
          }
        }
      })
      const key = 'some-key'
      const { items, errors } = await getContent(
        apiIterable as unknown as APIIterable,
        key,
        locales,
        cacheItemsRequestBody.items,
      )
      expect(items).toHaveLength(0)
      expect(errors).toHaveLength(17)
      expect(errors).toEqual(getContentResponseWithErrors.errors)

      getTemplateByIdMock.mockReset()
    })
  })

  describe('validate key', () => {
    it('should obtain key', async () => {
      const key = 'some-key'
      const result = await validate(apiIterable as unknown as APIIterable, key)

      expect(result).toStrictEqual({ apiKey: key })
    })
  })

  describe('refresh key', () => {
    it('should obtain key', async () => {
      const key = 'some-key'
      const result = await refresh(apiIterable as unknown as APIIterable, key)

      expect(result).toStrictEqual({ apiKey: key })
    })
  })

  describe('get locales', () => {
    it('should obtain locales', async () => {
      const key = 'some-key'
      const result = await getLocales(apiIterable as unknown as APIIterable, key)

      expect(result).toEqual({
        defaultLocale: '',
        locales: locales.map((code) => ({
          code,
          name: code,
        })),
      })
    })
  })

  describe('get cache item structure', () => {
    it('should obtain cache item structure', () => {
      const result = getCacheItemStructure()

      expect(result).toEqual({
        creator: 'Creator',
        templateId: 'Template id',
        updated: 'Updated',
        templateType: 'Template type',
      })
    })
  })

  describe('publish content', () => {
    it('should update template', async () => {
      const key = 'some-key'
      await publishContent(apiIterable as unknown as APIIterable, key, contentItem.items)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(apiIterable.updateTemplate).toHaveBeenCalledTimes(8)
    })

    it('should return errors if some of requests are rejected', async () => {
      const key = 'some-key'
      updateTemplateMock.mockImplementation(() => Promise.reject({ statusCode: 500 }))
      const { errors } = await publishContent(
        apiIterable as unknown as APIIterable,
        key,
        contentItem.items,
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(apiIterable.updateTemplate).toHaveBeenCalledTimes(8)
      expect(errors).toHaveLength(17)
      expect(errors).toContainEqual({
        perLocaleErrors: {
          en: { errorCode: 'UNRECOGNIZED_ERROR' },
          fr: { errorCode: 'UNRECOGNIZED_ERROR' },
        },
        uniqueId: '6341135||subject',
      })
    })
  })
})
