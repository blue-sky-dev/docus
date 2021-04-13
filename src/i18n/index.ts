import { resolve, join, relative } from 'path'
import defu from 'defu'
import { Module } from '@nuxt/types'

const r = (...args: string[]) => resolve(__dirname, ...args)

const config = {
  langDir: '',
  baseUrl: ({ $docus }: any) => ($docus && $docus.settings && $docus.settings.url) || '',
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      file: r('./languages/en-US.js'),
      name: 'English'
    }
  ],
  defaultLocale: 'en',
  parsePages: false,
  lazy: true,
  seo: false,
  vueI18n: {
    fallbackLocale: 'en',
    dateTimeFormats: {
      en: {
        long: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short'
        }
      },
      fr: {
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short'
        }
      }
    }
  }
}

export default <Module>function docusI18n() {
  const { requireModule, addPlugin, nuxt } = this
  const { options } = nuxt

  // Update i18n langDir to relative from `~` (https://github.com/nuxt-community/i18n-module/blob/4bfa890ff15b43bc8c2d06ef9225451da711dde6/src/templates/utils.js#L31)
  config.langDir = join(relative(options.srcDir, r('i18n')), '/')
  options.i18n = defu(options.i18n, config)

  nuxt.hook('build:before', () => {
    addPlugin({
      src: r('./runtime/plugin.js'),
      filename: 'docus-i18n.js'
    })

    requireModule('nuxt-i18n')
  })
}
