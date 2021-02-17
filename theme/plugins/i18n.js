export default function ({ app, $docus }, inject) {
  app.i18n.onLanguageSwitched = () => $docus.fetchCategories()

  // Generate local path for static contents.
  // This helper does not respect `router.trailingSlash`
  // and add/remove trailingSlash baded on original path
  inject('contentLocalePath', (path) => {
    let localePath = app.localePath(path)
    if (path.endsWith('/') && !localePath.endsWith('/')) {
      localePath += '/'
    }
    if (!path.endsWith('/') && localePath.endsWith('/')) {
      localePath = localePath.replace(/\/*$/, '')
    }
    return localePath
  })
}
