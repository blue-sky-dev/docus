export default defineAppConfig({
  docus: {
    title: 'Docus',
    description: 'The best place to start your documentation.',
    image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
    socials: {
      // twitter: '',
      // github: '',
      // facebook: '',
      // instagram: '',
      // youtube: '',
      // medium: ''
    },
    github: true,
    aside: {
      level: 1,
      exclude: []
    },
    // TODO: replace to navbar
    header: {
      title: '',
      logo: false, // TODO: handle logo as string for component
      showLinksIcons: false, // Toggle links icons in the header
      exclude: []
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.dev'
      },
      icons: []
    }
  }
})

// TODO: declare types when happy about them
// declare module '@nuxt/schema' {
//   interface AppConfigInput {
//     docus?: {
//       /** Project name */
//       title?: string
//     }
//   }
// }
