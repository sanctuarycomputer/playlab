const Types = {
  SYMBOL: 'Symbol',
  TEXT: 'Text',
  INTEGER: 'Integer',
  NUMBER: 'Number',
  DATE: 'Date',
  BOOLEAN: 'Boolean',
  OBJECT: 'Object',
  LOCATION: 'Location',
  RICH_TEXT: 'RichText',
  ARRAY: 'Array',
  LINK: 'Link',
  ENTRY: 'Entry',
  ASSET: 'Asset'
};

const Widgets = {
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  URL_EDITOR: 'urlEditor',
  SLUG_EDITOR: 'slugEditor',
  BOOLEAN: 'boolean',
  ENTRY_LINK_EDITOR: 'entryLinkEditor',
  ENTRY_LINKS_EDITOR: 'entryLinksEditor',
  ENTRY_CARDS_EDITOR: 'entryCardsEditor',
  ASSET_GALLERY_EDITOR: 'assetGalleryEditor'
};

const WebhookFieldMappings = {
  'textfield': {
    contentfulType: Types.SYMBOL
  },
  'textarea': {
    contentfulType: Types.TEXT
  },
  'datetime': {
    contentfulType: Types.DATE
  },
  'markdown': {
    contentfulType: Types.TEXT
  },
  'url': {
    contentfulType: Types.SYMBOL,
  },
  'embedly': {
    contentfulType: Types.SYMBOL,
  },
  'email': {
    contentfulType: Types.SYMBOL
  },
  'phone': {
    contentfulType: Types.SYMBOL
  },
  'color': {
    contentfulType: Types.SYMBOL
  },
  'boolean': {
    contentfulType: Types.BOOLEAN,
  },
  'select': {
    contentfulType: Types.SYMBOL
  },
  'checkbox': {
    contentfulType: Types.SYMBOL
  },
  'relation': {},
  'image': {},
  'file': {},
  'gallery': {},
  'grid': {},
}

module.exports = {
  Types, Widgets, WebhookFieldMappings 
};
