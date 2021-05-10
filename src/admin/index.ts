import { execSync } from 'child_process'
import { join, resolve } from 'upath'
import chalk from 'chalk'
import { NuxtOptionsServer } from '@nuxt/types/config/server'
import serveStatic from 'serve-static'
import { Module } from '@nuxt/types'
import api from './api'

const r = (...args: string[]) => resolve(__dirname, ...args)

export default <Module>function () {
  const { nuxt, addServerMiddleware, options } = this

  process.options = nuxt.options
  process.previewUrl = 'http://localhost:4000'

  addServerMiddleware({
    path: '/admin/api',
    handler: api
  })

  // Build the admin
  execSync('npx vite --config src/admin/vite.config.ts build')

  this.addServerMiddleware({
    path: '/admin/',
    handler: serveStatic(join(__dirname, 'app/dist'))
  })

  // TODO: Implement Vite as server middleware/proxy
  //       instead of using the built version.
  /* if (process.env.ADMIN_DEV && false) {
    // Start the admin in development
    const viteServer = await createServer({
      configFile: false,
      ...viteConfig
    })
    await viteServer.listen()
    const viteUrl = `http://localhost:${viteServer.config.server.port}`

    // TODO: handle when Array syntax
    const proxy = (this.options.proxy = this.options.proxy || {})
    proxy['/admin/'] = {
      target: viteUrl,
      pathRewrite: {
        '^/admin/': '/'
      }
    }

    this.requireModule('@nuxtjs/proxy')
  } */

  if (options.dev) this.options.plugins.push(r('runtime/plugin.ts'))

  nuxt.hook('listen', (_: any, { host, port }: NuxtOptionsServer) => {
    process.previewUrl = `http://${host}:${port}`

    nuxt.options.cli.badgeMessages.push(
      '',
      chalk.bold('📝 Admin: ') + chalk.underline.yellow(`${process.previewUrl}/admin/`)
    )
  })
}
