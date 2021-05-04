import { withoutTrailingSlash } from 'ufo'
import { DocusDocument, DocusMarkdownNode } from '../../types'
import { expandTags } from '../runtime/utils'

export function generatePosition(path: string, document: DocusDocument): string {
  const position = path
    .split('/')
    .filter(Boolean)
    .map(part => {
      const match = part.match(/^(\d+)\./)
      if (match) {
        return padLeft(match[1], 4)
      }
      return document.position ? padLeft(document.position, 4) : '9999' // Parts without a position are going down to the bottom
    })
    .join('')
  return padRight(position, 12)
}

export function generateSlug(name: string): string {
  return name
    .replace(/(\d+\.)?(.*)/, '$2')
    .replace(/^index/, '')
    .replace(/\.draft/, '')
}

export function generateTo(path: string): string {
  return withoutTrailingSlash(path.split('/').map(generateSlug).join('/'))
}

export function isDraft(path: string): boolean {
  return !!path.match(/(\.draft)$/)
}

export function processDocumentInfo(document: DocusDocument): DocusDocument {
  if (document.title && document.description) {
    return document
  }
  const [first, second] = document.body.children
    // top level `text` can be ignored
    .filter(node => node.type !== 'text')

  if (first && expandTags(['h1']).includes(first.tag)) {
    if (!document.title) {
      document.title = getTextContent(first)
      Object.assign(first, {
        type: 'text',
        value: ''
      })
    }
    // look for second element to find description
    if (second && expandTags(['blockquote']).includes(second.tag)) {
      if (!document.description) {
        document.description = getTextContent(second)
        Object.assign(second, {
          type: 'text',
          value: ''
        })
      }
    }
  } else if (first && first.type === 'blockquote') {
    if (!document.description) {
      document.description = getTextContent(first)
      Object.assign(first, {
        type: 'text',
        value: ''
      })
    }
  }
  return document
}

// Locals

function getTextContent(node: DocusMarkdownNode): string {
  let text = node.value || ''
  if (node.children) {
    text = text + node.children.map(child => getTextContent(child)).join('')
  }
  return text
}

function padLeft(value: string, length: number): string {
  return ('0'.repeat(length) + value).substr(String(value).length)
}

function padRight(value: string, length: number): string {
  return (value + '0'.repeat(length)).substr(0, length)
}
