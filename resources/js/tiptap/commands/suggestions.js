import tippy from 'tippy.js'

export default {
  items: ({ query }) => {
    return [
      {
        title: 'Heading 2',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 2 })
            .run()
        },
      },
      {
        title: 'Heading 3',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run()
        },
      },
      {
        title: 'Heading 4',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 4 })
            .run()
        },
      },
      {
        title: 'Bold',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMark('bold')
            .run()
        },
      },
      {
        title: 'Italic',
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMark('italic')
            .run()
        },
      },
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
  },

  render: () => {
    let state
    let popup
    let commandState

    const mount = (name, data) => {
      const event = new CustomEvent('mounted', { detail: { name, data } })
      document.body.dispatchEvent(event)
    }

    const call = (namespace, name, args) => {
      const event = new CustomEvent('call', { detail: { namespace, name, args } })
      document.body.dispatchEvent(event)
    }

    return {
      onStart: props => {
        state = props

        commandState = {
          selectedIndex: 0,
          items: state.items,
          onClick(index) {
            const item = this.items[index]

            if (item) {
              state.command(item)
            }
          },
          onKeyDown({ event }) {
            if (event.key === 'ArrowUp') {
              call('tiptapCommand', 'upHandler')
              return true
            }

            if (event.key === 'ArrowDown') {
              call('tiptapCommand', 'downHandler')
              return true
            }

            if (event.key === 'Enter') {
              call('tiptapCommand', 'enterHandler')
              return true
            }

            return false
          },
          upHandler() {
            this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
          },
          downHandler() {
            this.selectedIndex = (this.selectedIndex + 1) % this.items.length
          },
          enterHandler() {
            this.onClick(this.selectedIndex)
          },
        }

        const component = `
          <div class="items flex flex-col bg-white border border-gray-300 rounded-lg p-2">
            <template x-for="(item, index) in state.tiptapCommand.items" :key="index">
              <button class="item w-full pl-3 pr-12 rounded-lg text-left" :class="{ 'bg-gray-300': state.tiptapCommand.selectedIndex === index }" @click="state.tiptapCommand.onClick(index)" class="block py-1">
                <div class="title" class="text-left" x-text="item.title"></div>
              </button>
            </template>
            <div x-show="!state.tiptapCommand.items.length" class="text-gray-700">
              No results found
            </div>
          </div>
        `

        popup = tippy('body', {
          allowHTML: true,
          getReferenceClientRect: state.clientRect,
          appendTo: () => document.body,
          content: component,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })

        mount('tiptapCommand', commandState)
      },

      onUpdate(props) {
        state = props

        commandState.selectedIndex = 0
        commandState.items = props.items

        mount('tiptapCommand', { ...commandState, ...props })

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return commandState.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
      },
    }
  },
}
