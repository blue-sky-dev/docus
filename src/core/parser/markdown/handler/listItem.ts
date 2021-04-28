import u from 'unist-builder'
import { Node } from 'unist'
import { H } from 'mdast-util-to-hast'
import all from 'mdast-util-to-hast/lib/all'

export default function listItem(h: H, node: Node, parent: Node) {
  const result = all(h, node)
  let head = result[0]
  const loose = parent ? listLoose(parent) : listItemLoose(node)
  const props: any = {}
  let wrapped = []
  let index
  let child

  if (typeof node.checked === 'boolean') {
    if (!head || head.tagName !== 'p') {
      head = h(null, 'p', [])
      result.unshift(head)
    }

    if (head.children.length > 0) {
      head.children.unshift(u('text', ' '))
    }

    head.children.unshift(
      h(null, 'input', {
        type: 'checkbox',
        checked: node.checked,
        disabled: true
      })
    )

    // According to github-markdown-css, this class hides bullet.
    // See: <https://github.com/sindresorhus/github-markdown-css>.
    props.className = ['task-list-item']
  }

  const length = result.length
  index = -1

  while (++index < length) {
    child = result[index]

    // Add eols before nodes, except if this is a loose, first paragraph.
    if (loose || index !== 0 || child.tagName !== 'p') {
      wrapped.push(u('text', '\n'))
    }

    if (child.tagName === 'p' && !loose) {
      wrapped = wrapped.concat(child.children)
    } else {
      wrapped.push(child)
    }
  }

  // Add a final eol.
  if (length && (loose || child.tagName !== 'p')) {
    wrapped.push(u('text', '\n'))
  }

  return h(node, 'prose-li', props, wrapped)
}

function listLoose(node: Node) {
  let loose = node.spread
  const children = node.children as Node[]
  const length = children.length
  let index = -1

  while (!loose && ++index < length) {
    loose = listItemLoose(children[index])
  }

  return loose
}

function listItemLoose(node: Node) {
  const spread = node.spread
  const children = (node.children || []) as Node[]
  return spread === undefined || spread === null ? children.length > 1 : spread
}
