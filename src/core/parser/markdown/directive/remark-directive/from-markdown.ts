import { Token } from 'micromark/dist/shared-types'
import decode from 'parse-entities/decode-entity'

const canContainEols = ['textDirective']
const enter = {
  directiveContainer: enterContainer,
  directiveContainerSection: enterContainerSection,
  directiveContainerAttributes: enterAttributes,
  directiveContainerLabel: enterContainerLabel,

  directiveLeaf: enterLeaf,
  directiveLeafAttributes: enterAttributes,

  directiveText: enterText,
  directiveTextAttributes: enterAttributes
}
const exit = {
  directiveContainerSectionTitle: exitContainerSectionTitle,
  listUnordered: conditionalExit,
  listOrdered: conditionalExit,
  listItem: conditionalExit,
  directiveContainerSection: exitContainerSection,
  directiveContainer: exitContainer,
  directiveContainerAttributeClassValue: exitAttributeClassValue,
  directiveContainerAttributeIdValue: exitAttributeIdValue,
  directiveContainerAttributeName: exitAttributeName,
  directiveContainerAttributeValue: exitAttributeValue,
  directiveContainerAttributes: exitAttributes,
  directiveContainerLabel: exitContainerLabel,
  directiveContainerName: exitName,

  directiveLeaf: exitToken,
  directiveLeafAttributeClassValue: exitAttributeClassValue,
  directiveLeafAttributeIdValue: exitAttributeIdValue,
  directiveLeafAttributeName: exitAttributeName,
  directiveLeafAttributeValue: exitAttributeValue,
  directiveLeafAttributes: exitAttributes,
  directiveLeafName: exitName,

  directiveText: exitToken,
  directiveTextAttributeClassValue: exitAttributeClassValue,
  directiveTextAttributeIdValue: exitAttributeIdValue,
  directiveTextAttributeName: exitAttributeName,
  directiveTextAttributeValue: exitAttributeValue,
  directiveTextAttributes: exitAttributes,
  directiveTextName: exitName
}

function enterContainer(token: Token) {
  enterToken.call(this, 'containerDirective', token)
}

function exitContainer(token: Token) {
  const container = this.stack[this.stack.length - 1]
  if (container.children.length > 1) {
    const dataSection = container.children.shift()
    container.rawData = dataSection.raw
  }

  container.children = container.children.flatMap(child => {
    if (child.name === 'default' || !child.name) {
      return child.children
    }
    child.data = {
      hName: 'directive-slot',
      hProperties: {
        ...child.attributes,
        [`v-slot:${child.name}`]: ''
      }
    }
    return child
  })

  this.exit(token)
}

function enterContainerSection(token: Token) {
  enterToken.call(this, 'directiveContainerSection', token)
}

function exitContainerSection(token: Token) {
  let section = this.stack[this.stack.length - 1]
  /**
   * Ensure lists and list-items are closed before closing section
   * This issue occurs because `---` separtors ar conflict with markdown lists
   */
  while (section.type === 'listItem' || section.type === 'list') {
    this.exit(this.tokenStack[this.tokenStack.length - 1])
    section = this.stack[this.stack.length - 1]
  }

  if (section.type === 'directiveContainerSection') {
    section.raw = this.sliceSerialize(token)
    this.exit(token)
  }
}

function exitContainerSectionTitle(token: Token) {
  this.stack[this.stack.length - 1].name = this.sliceSerialize(token)
}

function enterLeaf(token: Token) {
  enterToken.call(this, 'leafDirective', token)
}

function enterText(token: Token) {
  enterToken.call(this, 'textDirective', token)
}

function enterToken(type, token) {
  this.enter({ type, name: '', attributes: {}, children: [] }, token)
}

function exitName(token: Token) {
  this.stack[this.stack.length - 1].name = this.sliceSerialize(token)
}

function enterContainerLabel(token: Token) {
  this.enter({ type: 'paragraph', data: { directiveLabel: true }, children: [] }, token)
}

function exitContainerLabel(token: Token) {
  this.exit(token)
}

function enterAttributes() {
  this.setData('directiveAttributes', [])
  this.buffer() // Capture EOLs
}

function exitAttributeIdValue(token: Token) {
  this.getData('directiveAttributes').push(['id', decodeLight(this.sliceSerialize(token))])
}

function exitAttributeClassValue(token: Token) {
  this.getData('directiveAttributes').push(['class', decodeLight(this.sliceSerialize(token))])
}

function exitAttributeValue(token: Token) {
  const attributes = this.getData('directiveAttributes')
  attributes[attributes.length - 1][1] = decodeLight(this.sliceSerialize(token))
}

function exitAttributeName(token: Token) {
  // Attribute names in CommonMark are significantly limited, so character
  // references can’t exist.
  this.getData('directiveAttributes').push([this.sliceSerialize(token), ''])
}

function exitAttributes() {
  const attributes = this.getData('directiveAttributes')
  const cleaned: any = {}
  let index = -1
  let attribute

  while (++index < attributes.length) {
    attribute = attributes[index]

    if (attribute[0] === 'class' && cleaned.class) {
      cleaned.class += ' ' + attribute[1]
    } else {
      cleaned[attribute[0]] = attribute[1]
    }
  }

  this.setData('directiveAttributes')
  this.resume() // Drop EOLs
  this.stack[this.stack.length - 1].attributes = cleaned
}

function exitToken(token: Token) {
  this.exit(token)
}

function conditionalExit(token: Token) {
  const section: Token = this.tokenStack[this.tokenStack.length - 1]
  if (section.type === token.type) {
    this.exit(token)
  }
}

function decodeLight(value: string) {
  return value.replace(/&(#(\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi, decodeIfPossible)
}

function decodeIfPossible($0: string, $1: string) {
  return decode($1) || $0
}

export default {
  canContainEols,
  enter,
  exit
}
