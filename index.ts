import { fromHtml } from './hast-util-from-html'
import rehypeFormat from './rehype-format'
import { toHtml } from './hast-util-to-html'

import type { Root } from './hast-util-from-html'
import type { Options as FormatOptions } from './rehype-format'
import type { Options as ParserOptions } from './hast-util-from-html'

export type Language = {
  closedTags?: string[]
}

export type ParseOptions = ParserOptions & {
  document?: boolean
  sourceCodeLocationInfo?: boolean
}

export type { FormatOptions }

export default create

export function create(newLanguage: Language): {
  parse(content: string, options?: ParseOptions): Root
  format(rootNode: Root): Root
  render(rootNode: Root): string
} {

  const {
    closedTags = []
  } = newLanguage

  function parse(content: string, options?: ParseOptions): Root {
    return fromHtml(content, {
      document: false,
      fragment: !options?.document,
      closedTags,
      ...options,
    })
  }

  const formatter = rehypeFormat({
    closedTags
  })

  function format(rootNode: Root): Root {
    formatter(rootNode)
    return rootNode
  }

  const renderOptions = {
    allowDangerousHtml: true,
    // allowParseErrors: true,
    closeEmptyElements: true,
    collapseEmptyAttributes: true,
    preferUnquoted: true,

    closeSelfClosing: false,
    closedTags,
  }

  function render(rootNode: Root): string {
    return toHtml(rootNode, renderOptions)
  }

  return {
    parse,
    format,
    render,
  }
}
