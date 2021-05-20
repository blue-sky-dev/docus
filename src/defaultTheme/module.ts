import { resolve, join } from 'path'
import { Config as WindiConfig } from 'windicss/types/interfaces'
import { existsSync } from 'fs-extra'
import { glob } from 'siroc'
import defu from 'defu'
import { Module, NuxtOptions } from '@nuxt/types'
import gracefulFs from 'graceful-fs'
import clearModule from 'clear-module'
import jiti from 'jiti'
import defaultWindiConfig from './windi.config'

const r = (...args: string[]) => resolve(__dirname, ...args)

const _require = jiti(__filename)

export const readyHook = ({ options }) => {
  // Override editor style on dev mode
  if (options.dev) options.css.push(r('css/main.dev.css'))
}

export const beforeBuildHook = async ({ options }) => {
  // Add default error page if not defined
  const errorPagePath = resolve(options.srcDir, options.dir.layouts, 'error.vue')
  const errorPageExists = await gracefulFs.promises.stat(errorPagePath).catch(() => false)
  if (!errorPageExists) options.ErrorPage = options.ErrorPage || r('layouts/error.vue')
}

const loadWindiConfig = (options: NuxtOptions): WindiConfig | undefined => {
  // Get Windi config path
  let windiPath = resolve(options.srcDir)
  if (existsSync(windiPath + '/windi.config.js')) windiPath += '/windi.config.js'
  else if (existsSync(windiPath + '/windi.config.ts')) windiPath += '/windi.config.ts'
  else if (existsSync(windiPath + '/tailwind.config.js')) windiPath += '/tailwind.config.js'
  else if (existsSync(windiPath + '/tailwind.config.ts')) windiPath += '/tailwind.config.ts'

  // Delete Node cache for Windi config
  clearModule(windiPath)

  // Get Windi config
  let localWindiConfig
  try {
    localWindiConfig = _require(windiPath)
    localWindiConfig = localWindiConfig?.default || localWindiConfig
  } catch (_) {}

  return localWindiConfig
}

// WindiCSS setup
export default <Module>function themeSetupModule() {
  const { nuxt, $docus } = this
  const { options, hook } = nuxt
  const { settings } = $docus

  // Get Windi config at user project level
  const localWindiConfig = loadWindiConfig(options)

  hook('windicss:options', (windiOptions: WindiConfig) => {
    // Merge user and theme Windi configs
    windiOptions.config = defu.arrayFn(windiOptions.config || {}, localWindiConfig || {}, defaultWindiConfig)

    // Include local & npm depencies directories in scan process
    windiOptions.scanOptions.dirs.push(
      __dirname,
      join(__dirname, '/node_modules/docus/dist'),
      join(options.rootDir, '/node_modules/docus/dist'),
      join(options.themeDir)
    )

    windiOptions.scanOptions.include.push(
      join(__dirname, '/**/*.{html,vue,md,mdx,pug,jsx,tsx,svelte}'),
      join(options.rootDir, '/node_modules/docus/dist/**/*.{html,vue,md,mdx,pug,jsx,tsx,svelte}'),
      join(options.themeDir, '/**/*.{html,vue,md,mdx,pug,jsx,tsx,svelte}')
    )

    // Merge shortcuts
    windiOptions.config.shortcuts = {
      ...(windiOptions.shortcuts || {}),
      ...(settings?.theme?.shortcuts || {})
    }
  })

  hook('components:dirs', async (dirs: any) => {
    // Get the user root `components` folder
    // TODO: This should be done via nuxt-extend
    const componentsDirPath = resolve(nuxt.options.rootDir, 'components')
    const componentsDirStat = await gracefulFs.promises.stat(componentsDirPath).catch(() => null)

    if (componentsDirStat && componentsDirStat.isDirectory()) {
      // Register the root `components` directory
      dirs.push({
        path: componentsDirPath,
        global: true
      })

      // Check for sub directories
      const subDirs = await glob(componentsDirPath + '/*/')

      // Register each subdirectories
      subDirs.forEach((path: string) => dirs.push({ path, global: true }))
    } else {
      // Watch existence of root `components` directory
      nuxt.options.watch.push(componentsDirPath)
    }
  })
}
