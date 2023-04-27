const locales = [
  {
    code: 'en',
    name: 'en',
  },
  {
    code: 'fr',
    name: 'fr',
  },
]

const emailTemplates = {
  en: {
    templateId: 6341135,
    metadata: {
      templateId: 6206999,
      createdAt: 1656505419561,
      updatedAt: 1660035227033,
      name: 'Template Email name in English',
      creatorUserId: 'partners@lokalise.com',
      messageTypeId: 80708,
    },
    name: 'Template Email name in English',
    fromName: 'Test',
    fromEmail: 'kiryl.sidarau@lokalise.com',
    subject: 'subject in English',
    preheaderText: 'preheader text in English',
    ccEmails: [],
    bccEmails: [],
    html: 'html in English',
    plainText: '',
    dataFeedIds: [],
    messageTypeId: 80708,
    creatorUserId: 'partners@lokalise.com',
    locale: 'en',
  },
  fr: {
    templateId: 6341135,
    metadata: {
      templateId: 6207000,
      createdAt: 1656505419561,
      updatedAt: 1660035227033,
      name: 'Template Email name in French',
      creatorUserId: 'partners@lokalise.com',
      messageTypeId: 80708,
    },
    name: 'Template Email name in French',
    fromName: 'Test',
    fromEmail: 'kiryl.sidarau@lokalise.com',
    subject: 'subject in French',
    preheaderText: 'preheader text in French',
    ccEmails: [],
    bccEmails: [],
    html: 'html in French',
    plainText: '',
    dataFeedIds: [],
    messageTypeId: 80708,
    creatorUserId: 'partners@lokalise.com',
    locale: 'fr',
  },
}

const pushTemplates = {
  en: {
    cacheDataFeed: true,
    payload: { test: 'in English' },
    messageTypeId: 80710,
    buttons: [
      {
        identifier: 'newButton in English',
        title: 'New button in English',
        buttonType: 'default',
        action: { type: '', data: '' },
        openApp: false,
        requiresUnlock: false,
        inputPlaceholder: '',
        inputTitle: '',
        actionIcon: { iconType: 'systemImage', imageName: '' },
      },
      {
        identifier: 'newButton destructive in English',
        title: 'New button destructive in English',
        buttonType: 'destructive',
        action: { type: '', data: '' },
        openApp: false,
        requiresUnlock: false,
        inputPlaceholder: '',
        inputTitle: '',
        actionIcon: { iconType: 'systemImage', imageName: '' },
      },
      {
        identifier: 'newButton textInput in English',
        title: 'New button textInput in English',
        buttonType: 'textInput',
        action: { type: '', data: '' },
        openApp: false,
        requiresUnlock: false,
        inputPlaceholder: 'inputPlaceholder in English',
        inputTitle: 'inputTitle inputPlaceholder in English',
        actionIcon: { iconType: 'systemImage', imageName: '' },
      },
    ],
    templateId: 7224465,
    createdAt: 1666198495251,
    message: 'new body in English',
    title: 'new title in English',
    richMedia: {},
    dataFeedIds: [],
    interruptionLevel: 'active',
    name: 'Template Push name in English',
    updatedAt: 1666735125613,
    wake: false,
    isSilentPush: false,
    locale: 'en',
    mergeDataFeedContext: false,
  },
  fr: {
    cacheDataFeed: true,
    payload: { test: 'in French' },
    messageTypeId: 80710,
    buttons: [
      {
        identifier: 'newButton in French',
        title: 'New button in French',
        buttonType: 'default',
        action: { type: '', data: '' },
        openApp: false,
        requiresUnlock: false,
        inputPlaceholder: '',
        inputTitle: '',
        actionIcon: { iconType: 'systemImage', imageName: '' },
      },
      {
        identifier: 'newButton destructive in French',
        title: 'New button destructive in French',
        buttonType: 'destructive',
        action: { type: '', data: '' },
        openApp: false,
        requiresUnlock: false,
        inputPlaceholder: '',
        inputTitle: '',
        actionIcon: { iconType: 'systemImage', imageName: '' },
      },
      {
        identifier: 'newButton textInput in French',
        title: 'New button textInput in French',
        buttonType: 'textInput',
        action: { type: '', data: '' },
        openApp: false,
        requiresUnlock: false,
        inputPlaceholder: 'inputPlaceholder in French',
        inputTitle: 'inputTitle inputPlaceholder in French',
        actionIcon: { iconType: 'systemImage', imageName: '' },
      },
    ],
    templateId: 7224465,
    createdAt: 1666198495251,
    message: 'new body in French',
    title: 'new title in French',
    richMedia: {},
    dataFeedIds: [],
    interruptionLevel: 'active',
    name: 'Template Push name in French',
    updatedAt: 1666735125613,
    wake: false,
    isSilentPush: false,
    locale: 'fr',
    mergeDataFeedContext: false,
  },
}

const inAppTempaltes = {
  en: {
    templateId: 7224454,
    name: 'Template InApp name',
    html: 'html in English',
    inAppDisplaySettings: {
      top: { percentage: 0 },
      right: { percentage: 0 },
      bottom: { percentage: 0 },
      left: { percentage: 0 },
    },
    webInAppDisplaySettings: { position: 'Full' },
    payload: { test: 'testfield in English' },
    locale: 'en',
    messageTypeId: 89908,
  },
  fr: {
    templateId: 7224454,
    name: 'Template InApp name',
    html: 'html in French',
    inAppDisplaySettings: {
      top: { percentage: 0 },
      right: { percentage: 0 },
      bottom: { percentage: 0 },
      left: { percentage: 0 },
    },
    webInAppDisplaySettings: { position: 'Full' },
    payload: { test: 'testfield in French' },
    locale: 'fr',
    messageTypeId: 89908,
  },
}

const smsTemplates = {
  en: {
    templateId: 7232189,
    createdAt: 1666263735906,
    updatedAt: 1666263769331,
    name: 'Test SMS template',
    message: 'Test message body in English',
    locale: 'en',
    messageTypeId: 89907,
  },
  fr: {
    templateId: 7232189,
    createdAt: 1666263735906,
    updatedAt: 1666263769331,
    name: 'Test SMS template',
    message: 'Test message body in French',
    locale: 'fr',
    messageTypeId: 89907,
  },
}

const templatesList = {
  Email: {
    templates: [
      {
        templateId: 6341135,
        createdAt: 1656505419561,
        updatedAt: 1660035227033,
        name: 'Template Email name',
        creatorUserId: 'partners@lokalise.com',
        messageTypeId: 80708,
      },
    ],
  },
  Push: {
    templates: [
      {
        templateId: 7224465,
        createdAt: 1657874799062,
        updatedAt: 1659714357324,
        name: 'Template Push name in English',
        creatorUserId: 'partners@lokalise.com',
        messageTypeId: 80708,
      },
    ],
  },
  InApp: {
    templates: [
      {
        templateId: 7224454,
        createdAt: 1656684633242,
        updatedAt: 1660035227767,
        name: 'Template InApp name',
        creatorUserId: 'partners@lokalise.com',
        messageTypeId: 80708,
      },
    ],
  },
  SMS: {
    templates: [
      {
        templateId: 7232189,
        createdAt: 1656684633242,
        updatedAt: 1660035227767,
        name: 'Test SMS template',
        creatorUserId: 'partners@lokalise.com',
        messageTypeId: 80708,
      },
    ],
  },
}

const getAllUserFields = {
  fields: {
    additionalField: 'additionalField',
  },
}

const iterableData = {
  locales,
  emailTemplates,
  pushTemplates,
  inAppTempaltes,
  smsTemplates,
  templatesList,
  getAllUserFields,
}

export default iterableData
