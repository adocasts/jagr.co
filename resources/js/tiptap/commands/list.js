export const commandList = [
  {
    name: 'h2',
    title: 'Heading 2',
    inline: true,
    command: ({ editor, range }) => {
      let level = 2
      let callList = editor.chain().focus()
      if (range) return callList.deleteRange(range).setNode('heading', { level }).run()
      callList.toggleHeading({ level }).run()
    },
  },
  {
    name: 'h3',
    title: 'Heading 3',
    inline: true,
    command: ({ editor, range }) => {
      let level = 3
      let callList = editor.chain().focus()
      if (range) return callList.deleteRange(range).setNode('heading', { level }).run()
      callList.toggleHeading({ level }).run()
    },
  },
  {
    name: 'h4',
    title: 'Heading 4',
    inline: true,
    command: ({ editor, range }) => {
      let level = 4
      let callList = editor.chain().focus()
      if (range) return callList.deleteRange(range).setNode('heading', { level }).run()
      callList.toggleHeading({ level }).run()
    },
  },
  {
    name: 'bold',
    title: 'Bold',
    inline: true,
    command: ({ editor, range }) => {
      let callList = editor.chain().focus()
      if (range) return callList.deleteRange(range).setMark('bold').run()
      callList.toggleMark('bold').run()
    },
  },
  {
    name: 'italic',
    title: 'Italic',
    inline: true,
    command: ({ editor, range }) => {
      let callList = editor.chain().focus()
      if (range) return callList.deleteRange(range).setMark('italic').run()
      callList.toggleItalic().run()
    },
  },
  {
    name: 'strike',
    title: 'Strikethrough',
    inline: true,
    command: ({ editor, range }) => {
      let callList = editor.chain().focus()
      if (range) return callList.deleteRange(range).setMark('strikethrough').run()
      callList.toggleStrike().run()
    },
  },
  {
    name: 'link',
    title: 'Link',
    inline: true,
    command: ({ editor, range }) => {
      const previousUrl = editor.getAttributes('link').href
      const url = window.prompt('Enter your link URL', previousUrl)

      if (url === null) {
        return
      }

      let callList = editor.chain().focus()
      if (range) callList.deleteRange(range)

      if (url === '') {
        callList.extendMarkRange('link').unsetLink().run()
        return
      }

      callList.extendMarkRange('link').setLink({ href: url }).run()
    }
  }
]
