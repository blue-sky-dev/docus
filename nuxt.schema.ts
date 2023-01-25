export default defineNuxtConfigSchema({
  appConfig: {
    /**
     * Docus theme configuration.
     *
     * @studioIcon material-symbols:docs
     */
    docus: {
      /**
       * Website title, used as header default title and meta title.
       *
       * @studioIcon material-symbols:title
       */
      title: 'Docus',
      /**
       * Website description, used for meta description.
       *
       * @studioIcon material-symbols:description
       */
      description: 'The best place to start your documentation.',
      /**
       * Cover image.
       *
       * @example '/cover.jpg'
       *
       * @studioIcon dashicons:cover-image
       * @studioInput file
       */
      image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
      /**
       * Social links
       *
       * Will be used in AppSocialIcons component.
       *
       * @studioIcon material-symbols:share-outline
       */
      socials: {
        /**
         * Twitter social handle
         * @example 'nuxt_js'
         * @studioIcon simple-icons:twitter
         */
        twitter: '',
        /**
         * GitHub org or repository
         * @example 'nuxt/framework'
         * @studioIcon simple-icons:github
         */
        github: '',
        /**
         * Facebook page url
         * @example https://www.facebook.com/groups/nuxtjs
         * @studioIcon simple-icons:facebook
         */
        facebook: '',
        /**
         * Instagram page url
         * @example https://www.instagram.com/wearenuxt
         * @studioIcon simple-icons:instagram
         */
        instagram: '',
        /**
         * Instagram page url
         * @example https://www.youtube.com/@NuxtLabs
         * @studioIcon simple-icons:youtube
         */
        youtube: '',
        /**
         * Medium page url
         * @example https://medium.com/nuxt
         * @studioIcon simple-icons:medium
         */
        medium: ''
      },
      /**
       * Theme layout configuration.
       *
       * @studioIcon tabler:arrow-autofit-width
       */
      layout: {
        /**
         * Enables the `fluid` layout mode.
         */
        fluid: true
      },
      /**
       * Aside navigation configuration.
       *
       * @studioIcon fluent:document-page-24-regular
       */
      aside: {
        /**
         * Aside navigation level
         *
         * Use 0 to disable all nesting.
         * Use 1 and more to display nested navigation in header and aside navigation.
         */
        level: 0,
        /**
         * Specify if default collapsibles state globally for aside navigation.
         */
        collapsed: false,
        /**
         * Paths to be excluded from aside navigation.
         *
         * @type {string[]}
         */
        exclude: []
      },
      /**
       * Header configuration.
       *
       * @studioIcon fluent:document-header-24-regular
       */
      header: {
        /**
         * Website title
         *
         * Title to be displayed in header or as aria-label if logo is defined.
         *
         * Default to docus.title
         *
         * @studioIcon material-symbols:title
         */
        title: '',
        /**
         * Logo configuration
         *
         * Boolean to disable or use the `Logo.vue` component.
         *
         * String to be used as a name of a component.
         *
         * @example 'MyLogo'
         * @studioInput boolean
         */
        logo: false,
        /**
         * Header links
         *
         * Toggle links icons in the header.
         */
        showLinkIcon: false,
        /**
         * Paths to be excluded from header links.
         *
         * @type {string[]}
         *
         */
        exclude: []
      },
      /**
       * Footer configuration
       *
       * @studioIcon fluent:document-footer-24-regular
       */
      footer: {
        /**
         * Website credits configuration.
         *
         * @type {false|object}
         *
         * @studioIcon material-symbols:copyright
         */
        credits: {
          /**
           * Icon to show on credits
           * @formtype Icon
           */
          icon: 'IconDocus',
          text: 'Powered by Docus',
          href: 'https://docus.dev'
        },
        /**
         * Text links
         *
         * Will be added into center section of the footer.
         *
         * @studioIcon material-symbols:add-link
         */
        textLinks: {
          $schema: {
            type: 'array',
            items: {
              type: 'object',
              required: ['text', 'href'],
              properties: {
                href: {
                  type: 'string',
                  description: 'URL when clicking the link'
                },
                text: { type: 'string', description: 'Text of the link' },
                target: { type: 'string', description: 'Target attribute of the link' }
              }
            }
          }
        },
        /**
         * Icon links
         *
         * Icons to be added to Social Icons in footer.
         *
         * @studioIcon material-symbols:add-link
         */
        iconLinks: {
          $schema: {
            type: 'array',
            items: {
              type: 'object',
              required: ['icon', 'href'],
              properties: {
                icon: { type: 'string', description: 'Icon name' },
                href: {
                  type: 'string',
                  description: 'Link when clicking on the icon'
                },
                label: { type: 'string', description: 'Label of the icon' }
              }
            }
          }
        }
      }
    }
  }
})
