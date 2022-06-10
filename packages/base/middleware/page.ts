import { queryPage } from '../utils/queries'
import { defineNuxtRouteMiddleware, useNuxtApp } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/favicon.icon') return

  if (process.client && to.path !== from.path) {
    // @ts-expect-error - Untyped hook
    useNuxtApp().callHook('docus:page:start')
  }

  if (to === 'favicon.icon') return

  const data = await queryPage(to)

  if (typeof data === 'string') return data
})
