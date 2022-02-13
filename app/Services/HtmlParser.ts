import { parse } from 'node-html-parser'
import Application from '@ioc:Adonis/Core/Application'
const shiki = require('shiki')

const highlighter = shiki.getHighlighter({
  theme: 'github-dark',
  langs: [...shiki.BUNDLED_LANGUAGES,
    {
      id: 'edge',
      scopeName: 'text.html.edge',
      path: Application.publicPath('/shiki/edge.json')
    }
  ]
})

export default class HtmlParser {
  public static async highlight(html: string) {
    const root = parse(html)
    const preBlocks = root.querySelectorAll('pre')
    if (preBlocks?.length) {
      const promises = preBlocks.map(async (c) => {
        const codeRoot = parse(c.rawText, {
          blockTextElements: {
            code: false
          }
        })

        const codeBlock = codeRoot.querySelector('code')

        if (codeBlock) {
          const classList = [...codeBlock.classList.values()]
          const lang = classList.find((c) => c.startsWith('language-'))?.replace('language-', '')

          if (!lang) return

          const outerHTML = codeBlock.outerHTML
          const tagStart = outerHTML.replace('</code>', '')
          const code = c.rawText.replace(tagStart, '').replace('</code>', '')
          const highlighted = await (await highlighter).codeToHtml(code, { lang })

          c.replaceWith(highlighted)
        }
      })

      await Promise.all(promises)
    }
    return root.toString()
  }
}
