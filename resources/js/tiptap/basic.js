import Alpine from 'alpinejs'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Commands from './commands'
import suggestion from './commands/suggestions'

window.setupEditor = function(content) {
  let editor;

  return {
    content: content,
    updatedAt: Date.now(), // force Alpine to rerender on selection change

    isActive(type, opts = {}) {
      return editor.isActive(type, opts)
    },

    chain() {
      return editor.chain()
    },

    init(element) {
      editor = new Editor({
        element: element,
        extensions: [
          StarterKit,
          Placeholder.configure({
            placeholder: 'Type / to see available commands'
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
    },
  }
}
