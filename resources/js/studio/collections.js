import Autocomplete from '@tarekraafat/autocomplete.js'
import axios from 'axios'
import 'babel-polyfill'

function collectionManager({ parentId, collections = [], posts = [] }) {
  return {
    parentId,
    collections,
    posts,
    options: [],
    loading: false,

    init() {
      this.$nextTick(() => {
        this.initAutocomplete('#autocomplete_main')

        this.collections.map(c => {
          this.initAutocomplete(`#autocomplete_collection_${c.id}`, c)
        })
      })
    },

    async addCollection() {
      const { data } = await axios.post('/api/studio/collections/stub', { parentId })
      this.collections.push(data.collection)
    },

    removePost(post, subcollection) {
      if (subcollection) {
        subcollection.posts = subcollection.posts.filter(p => p.id !== post.id)
      } else {
        this.posts = this.posts.filter(p => p.id !== post.id)
      }
    },

    getIgnoreIds(collection) {
      if (collection) {
        const c = this.collections.find(c => c.id === collection.id)
        return c.posts.map(p => p.id)
      }

      return this.posts.map(p => p.id)
    },

    initAutocomplete(selector, collection) {
      // The autoComplete.js Engine instance creator
      const autoCompleteJS = new Autocomplete({
        selector,
        data: {
          src: async (query) => {
            try {
              this.loading = true
              const ignoreIds = this.getIgnoreIds(collection).join(',')
              const { data } = await axios.get(`/api/studio/posts/search?term=${query}&ignore=${ignoreIds}`)
              this.loading = false
              this.options = data.posts
              return data.posts
            } catch (error) {
              this.loading = false
              return error;
            }
          },
          keys: ["title"],
          // cache: true
        },
        placeHolder: "Search for Food & Drinks!",
        resultsList: {
          element: (list, data) => {
            const info = document.createElement("p");
            if (data.results.length > 0) {
              info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
            } else {
              info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
            }
            list.prepend(info);
          },
          noResults: true,
          maxResults: 15,
          tabSelect: true
        },
        resultItem: {
          element: (item, data) => {
            // Modify Results Item Style
            item.style = "display: flex; justify-content: space-between;";
            // Modify Results Item Content
            item.innerHTML = `
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${data.match}
            </span>
            <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
              ${data.key}
            </span>`;
          },
          highlight: true
        }
      });

      autoCompleteJS.input.addEventListener("selection", (event) => {
        const feedback = event.detail;
        autoCompleteJS.input.blur();
        
        // Render selected choice to selection div
        if (!collection) {
          this.posts.push(feedback.selection.value)
        } else {
          const c = this.collections.find(c => c.id === collection.id)
          c.posts.push(feedback.selection.value)
          this.collections = this.collections.map(col => col.id === c.id ? c : col)
        }

        autoCompleteJS.input.value = ''
        console.log(feedback);
      });
    }
  }
}

window.collectionManager = collectionManager