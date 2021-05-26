import { pascalCase } from 'scule'
import Vue from 'vue'
import { ComputedRef } from '@nuxtjs/composition-api'
import { DocusAddonContext, DocusDocument, NavItem } from '../../../types'

export const useDocusTemplates = ({ api, state }: Partial<DocusAddonContext>, currentNav: ComputedRef<NavItem[]>) => {
  function getPageTemplate(page: DocusDocument) {
    let template = typeof page.template === 'string' ? page.template : page.template?.self

    if (!template) {
      // Fetch from nav (root to link) and fallback to settings.template
      const slugs: string[] = page.to.split('/').filter(Boolean).slice(0, -1) // no need to get latest slug since it is current page

      let links = currentNav?.value || []

      slugs.forEach((_slug: string, index: number) => {
        // generate full path of parent
        const to = '/' + slugs.slice(0, index + 1).join('/')
        const link = api.findLink(links, to)

        if (link?.template) {
          template = link.template.nested
        }

        if (!link?.children) {
          return
        }

        links = link.children
      })

      template = template || state.settings.template
    }

    template = pascalCase(template)

    if (!Vue.component(template)) {
      // eslint-disable-next-line no-console
      console.error(`Template ${template} does not exists, fallback to Page template.`)

      template = 'Page'
    }

    return template
  }

  return {
    getPageTemplate
  }
}
