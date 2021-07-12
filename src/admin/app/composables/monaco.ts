import { watch, Ref, unref, ref, watchEffect } from 'vue3'
import type { editor as Editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import { createSingletonPromise } from '@antfu/utils'
import { isDark } from '../composables/dark'

const setupMonaco = createSingletonPromise(async () => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    noUnusedLocals: false,
    noUnusedParameters: false,
    allowUnreachableCode: true,
    allowUnusedLabels: true,
    strict: true
  })

  await Promise.all([
    // load workers
    (async () => {
      const [
        { default: EditorWorker },
        { default: JsonWorker },
        { default: CssWorker },
        { default: HtmlWorker },
        { default: TsWorker }
      ] = await Promise.all([
        // @ts-expect-error
        import('monaco-editor/esm/vs/editor/editor.worker?worker'),
        // @ts-expect-error
        import('monaco-editor/esm/vs/language/json/json.worker?worker'),
        // @ts-expect-error
        import('monaco-editor/esm/vs/language/css/css.worker?worker'),
        // @ts-expect-error
        import('monaco-editor/esm/vs/language/html/html.worker?worker'),
        // @ts-expect-error
        import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')
      ])

      // @ts-expect-error
      window.MonacoEnvironment = {
        getWorker(_: any, label: string) {
          if (label === 'json') return new JsonWorker()
          if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker()
          if (label === 'html' || label === 'handlebars' || label === 'razor' || label === 'vue')
            return new HtmlWorker()
          if (label === 'typescript' || label === 'javascript') return new TsWorker()
          return new EditorWorker()
        }
      }

      watchEffect(() => {
        monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs')
      })
    })()
  ])

  return { monaco }
})

export function useMonaco(
  target: Ref,
  options: { code: string; language: string; onChanged?: (content: string) => void }
) {
  const isSetup = ref(false)
  let editor: Editor.IStandaloneCodeEditor

  const setContent = (content: string) => {
    if (!isSetup.value) return
    if (editor) editor.setValue(content)
  }

  const init = async () => {
    const { monaco } = await setupMonaco()

    watch(
      target,
      () => {
        const el = unref(target)

        if (!el) return

        const extension = () => {
          if (options.language === 'typescript') return 'ts'
          else if (options.language === 'javascript') return 'js'
          else if (options.language === 'html') return 'html'
        }

        const model = monaco.editor.createModel(
          options.code,
          options.language,
          monaco.Uri.parse(`file:///root/${Date.now()}.${extension()}`)
        )

        editor = monaco.editor.create(el, {
          model,
          tabSize: 2,
          wordWrap: 'on',
          insertSpaces: true,
          autoClosingQuotes: 'always',
          detectIndentation: false,
          folding: false,
          glyphMargin: false,
          lineNumbersMinChars: 3,
          overviewRulerLanes: 0,
          automaticLayout: true,
          theme: isDark.value ? 'vs-dark' : 'vs',
          minimap: {
            enabled: false
          }
        })

        isSetup.value = true

        editor.getModel()?.onDidChangeContent(() => {
          options.onChanged?.(editor.getValue())
        })
      },
      {
        flush: 'post',
        immediate: true
      }
    )
  }

  init()

  return {
    setContent
  }
}
