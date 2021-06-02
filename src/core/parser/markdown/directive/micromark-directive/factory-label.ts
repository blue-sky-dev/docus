import { Effects, Okay, NotOkay } from 'micromark/dist/shared-types'
import markdownLineEnding from 'micromark/dist/character/markdown-line-ending'

// This is a fork of:
// <https://github.com/micromark/micromark/blob/bf53bf9/lib/tokenize/factory-label.js>
// to allow empty labels, balanced brackets (such as for nested directives),
// text instead of strings, and optionally disallows EOLs.

// eslint-disable-next-line max-params
export default function createLabel(
  effects: Effects,
  ok: Okay,
  nok: NotOkay,
  type: string,
  markerType: string,
  stringType: string,
  disallowEol?: boolean
) {
  let size = 0
  let balance = 0

  return start

  function start(code: number) {
    /* istanbul ignore if - always `[` */
    if (code !== 91 /* `[` */) throw new Error('expected `[`')
    effects.enter(type)
    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    return afterStart
  }

  function afterStart(code: number) {
    if (code === 93 /* `]` */) {
      effects.enter(markerType)
      effects.consume(code)
      effects.exit(markerType)
      effects.exit(type)
      return ok
    }

    effects.enter(stringType)
    return atBreak(code)
  }

  function atBreak(code: number) {
    if (
      code === null /* EOF */ ||
      /* <https://github.com/micromark/micromark/blob/bf53bf9/lib/constant/constants.js#L34> */
      size > 999
    ) {
      return nok(code)
    }

    if (code === 93 /* `]` */ && !balance--) {
      return atClosingBrace(code)
    }

    if (markdownLineEnding(code)) {
      if (disallowEol) {
        return nok(code)
      }

      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      return atBreak
    }

    // @ts-ignore
    effects.enter('chunkText', { contentType: 'text' })
    return label(code)
  }

  function label(code: number) {
    if (
      code === null /* EOF */ ||
      markdownLineEnding(code) ||
      /* <https://github.com/micromark/micromark/blob/bf53bf9/lib/constant/constants.js#L34> */
      size > 999
    ) {
      effects.exit('chunkText')
      return atBreak(code)
    }

    if (code === 91 /* `[` */ && ++balance > 3) {
      return nok(code)
    }

    if (code === 93 /* `]` */ && !balance--) {
      effects.exit('chunkText')
      return atClosingBrace(code)
    }

    effects.consume(code)
    return code === 92 /* `\` */ ? labelEscape : label
  }

  function atClosingBrace(code: number) {
    effects.exit(stringType)
    effects.enter(markerType)
    effects.consume(code)
    effects.exit(markerType)
    effects.exit(type)
    return ok
  }

  function labelEscape(code: number) {
    if (code === 91 /* `[` */ || code === 92 /* `\` */ || code === 93 /* `]` */) {
      effects.consume(code)
      size++
      return label
    }

    return label(code)
  }
}
