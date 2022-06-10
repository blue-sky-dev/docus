import { defineComponent, ref, useSlots } from 'vue'
import type { PropType } from 'vue'
import { useGithub } from '../composables/useGithub'
import type { GithubReleasesQuery } from '../../module'
import { useAsyncData, useState } from '#imports'

export default defineComponent({
  props: {
    query: {
      type: Object as PropType<GithubReleasesQuery>,
      required: false,
    },
  },
  async setup(props) {
    const { fetchReleases } = useGithub()

    const { data: _releases, refresh } = await useAsyncData('github-releases-component', () => fetchReleases(props.query))

    // TODO: remove this painful workaround: hotfix for https://github.com/vuejs/core/issues/5513
    const releases = process.client ? useState('github-releases') : ref()
    releases.value = releases.value || _releases.value

    return {
      releases,
      refresh,
    }
  },
  render({ releases, refresh }) {
    const slots = useSlots()

    return slots?.default?.({ releases, refresh })
  },
})
