import { fromHtml } from './hast-util-from-html'
import rehypeFormat from './rehype-format/index'
import { toHtml } from './hast-util-to-html'

import type { Root } from './hast-util-from-html'
import type { Options as FormatOptions } from './rehype-format/index'
import type { Options as ParserOptions } from './hast-util-from-html'

const language: Language = {
  closedTags: ['Else', 'Field'],
}

export type Language = {
  closedTags: string[]
}

export type ParseOptions = ParserOptions & {
  fragment: boolean
  // sourceCodeLocationInfo: boolean
  language: any
}

const parseOptions: ParseOptions = {
  fragment: true,
}

const formatOptions: FormatOptions = {
  language,
}

const renderOptions = {
  allowDangerousHtml: true,
  // allowParseErrors: true,
  closeEmptyElements: true,
  collapseEmptyAttributes: true,
  preferUnquoted: true,

  closeSelfClosing: false,
  ...language,
}

export function defineLanguage(newLanguage: Language): Language {
  return Object.assign(language, newLanguage)
}

export function parse(content: string, options?: ParseOptions): Root {
  const allOptions = {
    language,
    ...parseOptions,
    ...options
  }
  if (options?.document===true) allOptions.fragment = false
  return fromHtml(content, allOptions)
}

let formatter: (rootNode: Root) => void

export function format(rootNode: Root): Root {
  if (!formatter) {
    formatter = rehypeFormat(formatOptions)
  }
  formatter(rootNode)
  return rootNode
}

export function render(rootNode: Root) {
  return toHtml(rootNode, renderOptions)
}
