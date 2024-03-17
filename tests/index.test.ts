import fs from 'node:fs/promises'
import { expect, test, describe, afterAll } from 'bun:test'
import { parse, render, format } from '../index'

const { dirname } = import.meta
const testContent = await fs.readFile(`${dirname}/test-1.html`, 'utf-8')
const testContentTree = JSON.parse(await fs.readFile(`${dirname}/test-1-parse.json`, 'utf-8'))

describe('parse', () => {

  test('works', () => {
    expect(parse(testContent)).toStrictEqual(testContentTree)
  })
})

describe('format', () => {

  test('fragment', async () => {
    expect(render(
      format(
        parse(testContent)
      )
    )).toBe(await fs.readFile(`${dirname}/test-1-format-fragment.html`, 'utf-8'))
})


test('document', async () => {
  expect(render(
    format(
      parse(testContent, { document: true })
    )
  )).toBe(await fs.readFile(`${dirname}/test-1-format-document.html`, 'utf-8'))
  })

})
