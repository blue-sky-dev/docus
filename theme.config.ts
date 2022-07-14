import { defineTheme } from '@nuxt-themes/config'

export default defineTheme({
  title: 'Docus',
  socials: {
    twitter: '@docus_',
    github: 'nuxtlabs/docus',
  },
  github: {
    root: 'content',
    edit: true,
  },
  aside: {
    level: 1,
    filter: [],
  },
  header: {
    title: false,
    logo: true,
  },
  cover: {
    src: 'https://user-images.githubusercontent.com/904724/105075054-872fac80-5a89-11eb-8aab-46dd254ad986.png',
    alt: 'A screenshot of a website built with Docus with the Docus logo on top of it.',
  },
  footer: {
    credits: {
      icon: 'IconDocus',
      text: 'Powered by Docus',
      href: 'https://docus.dev',
    },
    icons: [],
  },
})
