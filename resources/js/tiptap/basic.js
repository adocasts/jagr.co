import Alpine from 'alpinejs'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Commands from './commands'
import suggestion from './commands/suggestions'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import CodeBlock from '@tiptap/extension-code-block'
import { commandList } from './commands/list'
import { languages } from '../syntax/languages'

window.setupEditor = function(content) {
  let editor;

  return {
    isInitialized: false,
    content: content,
    updatedAt: Date.now(), // force Alpine to rerender on selection change

    language: 'ts',
    languages: [...languages ],

    isActive(type, opts = {}) {
      return editor.isActive(type, opts)
    },

    chain() {
      return editor.chain()
    },

    command(name) {
      return commandList.find(cmd => cmd.name === name).command({ editor })
    },

    init(element) {
      if (!element) {
        return
      }

      editor = new Editor({
        element: element,
        extensions: [
          StarterKit,
          BubbleMenu.configure({
            element: document.querySelector('.bubble-menu'),
          }),
          Placeholder.configure({
            placeholder: 'Type / to see available commands'
          }),
          Link.configure({
            autolink: true,
            linkOnPaste: true,
            HTMLAttributes: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer'
            }
          }),
          CodeBlock.configure({
            languageClassPrefix: 'language-',
            HTMLAttributes: {
              class: 'code-block'
            },
          }).extend({
            addNodeView() {
              return (props) => {
                const container = document.createElement('div')
                container.classList.add('code-block', 'relative')
                container.dataset.nodeViewWrapper = ""

                const content = document.createElement('pre')
                const code = document.createElement('code')
                code.style = "white-space: pre-wrap;"
                content.append(code)
                container.append(content)

                const selector = document.createElement('select')
                selector.classList.add('absolute', 'top-1', 'right-1', 'rounded', 'text-xs', 'text-gray-200', 'bg-gray-900', 'border-gray-800', 'px-2', 'py-1')
                selector.contentEditable = false
                selector.addEventListener('change', (e) => {
                  const language = e.target.value
                  props.editor.commands.updateAttributes('codeBlock', { language })
                })
                languages.map(lang => {
                  const option = document.createElement('option')
                  option.value = lang.code
                  option.textContent = lang.name
                  option.selected = lang.code === props.node.attrs.language
                  selector.append(option)
                })
                container.append(selector)

                return {
                  dom: container,
                  contentDOM: content
                }
              }
            }
          }),
          Commands.configure({
            suggestion
          })
        ],
        content: this.content,
        onUpdate: ({ editor }) => {
          this.content = editor.getHTML()
        },
        onSelectionUpdate: () => {
          this.updatedAt = Date.now()
        },
      })

      this.isInitialized = true
    },
  }
}
