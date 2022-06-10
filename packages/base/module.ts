import { resolve } from 'pathe'
import { addTemplate, defineNuxtModule, logger } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { greenBright } from 'chalk'
import { generateTypes, resolveSchema } from 'untyped'
import { name, version } from './package.json'
import type { NuxtLayer } from './utils/theme'
import { resolveTheme } from './utils/theme'

const pkgName = greenBright(name)
const motd = () => logger.success(`Using ${pkgName} v${version}`)

/**
 * Setup theme layer.
 */
const setupTheme = (nuxt: Nuxt) => {
  nuxt.hook('modules:done', () => {
    const layers = nuxt.options._layers

    const theme = resolveTheme(layers as NuxtLayer[])

    addTemplate({
      filename: 'types/theme.d.ts',
      getContents: () => `${generateTypes(resolveSchema(theme), { addDefaults: true, allowExtraKeys: true, interfaceName: 'DocusThemeConfig' })}\n
declare module '@nuxt/schema' {
  interface NuxtConfig {
    theme: Partial<DocusThemeConfig>
  }
}`,
    })

    nuxt.options.runtimeConfig.public.docus.defaultThemeConfig = theme
  })

  nuxt.hook('prepare:types', (opts) => {
    opts.references.push({ path: resolve(nuxt.options.buildDir, 'types/theme.d.ts') })
  })
}

export default defineNuxtModule({
  meta: {
    name: 'docus',
    version: '3.0.0',
    compatibility: {
      nuxt: '^3.0.0-rc.3',
      bridge: false,
    },
    configKey: 'docus',
  },
  defaults: {},
  setup(_, nuxt) {
    // Make also VT detects it
    nuxt.options.runtimeConfig.public.docus = nuxt.options.runtimeConfig.public.docus || {}

    setupTheme(nuxt)

    nuxt.hook('modules:done', async () => {
      motd()

      // Transpile @nuxt/content
      // Related: https://github.com/nuxt/framework/pull/4070
      nuxt.options.build.transpile = [...(nuxt.options.build.transpile || []), '@nuxt/content', '@nuxt/content-edge']
    })
  },
})
