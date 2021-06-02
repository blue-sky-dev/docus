import { DocusSettings } from '../types'

export const docusDefaults: DocusSettings = {
  title: 'Docus',
  contentDir: 'content',
  url: '',
  description: '',
  template: 'docs',
  credits: true,
  layout: {
    header: true,
    footer: true,
    aside: false,
    asideClass: '',
    fluid: false
  }
}
