import { Context } from '@nuxt/types'
import { Ref } from '@nuxtjs/composition-api'
import { MetaInfo } from 'vue-meta'
import { useDocusApi } from '../core/runtime/composables/api'
import { DefaultThemeSettings } from '../defaultTheme/index.d'
import { DocusRootNode } from './markdown'

export interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

export interface Toc {
  title: string
  depth: number
  searchDepth: number
  links: TocLink[]
}

// Navigation
export interface NavItemNavigationConfig {
  /**
   * Navigation title
   */
  title: string
  /**
   * If set to `false`, the nested pages will not display in Docus navigation menus
   */
  nested: boolean
  /**
   * If set to `true`, other pages will not show in the left menu when user visiting the page or its nested pages.
   */
  exclusive: boolean
  /**
   * If set to `true` in an `index.md`, the category will be collapsed by default in aside navigation.
   */
  collapse: boolean
  /**
   * If set in an `index.md`, the page will redirect to the specified path when loaded, can be useful for empty categories pages.
   */
  redirect: string
}

export interface NavItem extends NavItemNavigationConfig {
  /**
   * Page slug
   */
  slug: string
  /**
   * full path of page
   */
  to: string
  /**
   * Shows if the page is draft or not
   */
  draft?: boolean
  /**
   * Provide template name that should use to render the page
   */
  template?: string
  /**
   * Shows if this nav belogs to a real page or not
   */
  page: boolean
  /**
   * Small Icon that shows before page title
   */
  icon?: string
  /**
   * If set to `false`, the page will not show in navigation menus
   */
  hidden: boolean
  /**
   * Child pages
   */
  children: NavItem[]
}

export type PermissiveContext = Context & { [key: string]: any }

export type DocusNavigation = {
  [language: string]: NavItem[]
}

export type DocusCurrentNav = {
  title?: string
  to?: string
  navigation?: NavItemNavigationConfig | false
  parent?: NavItem
  links: NavItem[]
}

export interface DocusDocument {
  // FrontMatter
  title: string
  description: string
  badge: string
  version: number
  fullscreen: boolean
  head: MetaInfo
  position: string
  draft: boolean
  // Navigation
  navigation: NavItemNavigationConfig | false
  // url of nearest exclusive parent
  // parent uses to filter pages to find currect previous and next page
  parent: string
  // Template
  template: {
    self: string
    nested: string
    [key: string]: any
  }
  // Layout
  layout: {
    header: boolean
    footer: boolean
    aside: boolean
    asideClass: string
    fluid: boolean
    [key: string]: any
  }

  // Generated
  /**
   * If set to `false` the document will not render as a standalone page an can only accessible with `InjectContent` of `$docus` search API
   */
  page: boolean
  /**
   * It will set to `false` if the file does not containts any markdown content
   */
  empty: boolean
  /**
   * The unique key of document (file path)
   */
  key: string
  /**
   * Path of document in the storage.
   */
  path: string
  /**
   * Generated url of document. This url will be used to create anchor links of document.
   */
  to: string
  /**
   * File extension
   */
  extension: string
  slug: string
  toc: false | Toc
  language: string
  body: DocusRootNode
  dir: string
  createdAt: Date
  updatedAt: Date
}

export interface DocusSettings<T = DefaultThemeSettings> {
  title: string
  contentDir: string
  description: string
  credits: boolean
  url: string
  template: string
  theme?: T
  [key: string]: any
}

export type DocusState<T = DefaultThemeSettings> = {
  // Core
  currentPath: string
  currentPage: DocusDocument | null
  settings: DocusSettings<T> | null
  navigation: DocusNavigation
  theme: any
  layout: any
  // Addons
  ui?: any
  lastRelease?: any
}

export interface DocusAddonContext<T = DefaultThemeSettings> {
  ssrContext: Context['ssrContext']
  context: PermissiveContext
  state: DocusState
  settings: DocusSettings<T>
  createQuery: any
  api: ReturnType<typeof useDocusApi>
  $nuxt?: any
}

export type DocusRuntimeInstance<T = DefaultThemeSettings> = {
  settings: Ref<Omit<DocusSettings, 'theme'>>
  navigation: Ref<DocusNavigation>
  theme: Ref<T>
  [key: string]: any
} & ReturnType<typeof useDocusApi>

export interface DocusNavigationGetParameters {
  depth?: number
  locale?: string
  from?: string
  all?: boolean
}

export interface Colors {
  [key: string]: string | Colors
}

//  Storage
export interface DriverOptions {
  ignore?: string[]
  mountPoint: string
  base: string
}
export interface StorageOptions {
  drivers: DriverOptions[]
}

export interface MarkdownParserOptions {
  toc: {
    depth: number
    searchDepth: number
  }
  directives: any
  remarkPlugins: (string | [string, any])[]
  rehypePlugins: (string | [string, any])[]
}

export interface ParserOptions {
  markdown: Partial<MarkdownParserOptions>
}
