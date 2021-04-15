---
menu: false
template: landing
title: Documentation Generator based on Nuxt and Windi.
description: >-
  Write pages in markdown, use Vue components, add style with Windi CSS and enjoy the power of Nuxt with a blazing fast developer experience.
hero:
  cta: [Get started, /get-started/installation]
  secondary: [Open on GitHub, https://github.com/nuxtlabs/docus]
features:
  - icon: IconNuxt
    iconClass: 'text-hex-00DC82'
    title: Nuxt Architecture
    description: >-
      Get the Nuxt power by using all the features, Docus is one of the first Nuxt
      theme.
  - icon: IconVue
    title: Vue Components
    description: Use your components or Docus built-in right inside your content.
  - icon: IconMarkdown
    title: Write Markdown
    description: Enjoy the power of Markdown to write your documentation.
  - icon: IconWindi
    title: Windi CSS
    description: >-
      Windi CSS is built in for great developer experience and rapid customization of Docus.
  - icon: IconSSG
    title: Static Generation
    description: Generate your documentation as a static website and host it everywhere.
  - icon: IconLighthouse
    title: Lighthouse Optimised
    description: Start with a blazing fast documentation with a perfect score on lighthouse.
  - icon: IconZap
    title: Smart Generation
    description: >-
      Docus knows if he can skip the Webpack build if you only changed Markdown
      files.
  - icon: IconPuzzle
    title: Extensible
    description: 'Customize the whole design, or add components using slots, make it your own.'
  - icon: IconGitHub
    title: Open Source
    description: Docus is released as MIT license and made with love by the NuxtLabs team.
---

<block-hero :title="title" :description="description" v-bind="hero"></block-hero>

<block-features title="What's included?" :features="features"></block-features>
