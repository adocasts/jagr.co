import '../css/app.css'
import 'babel-polyfill'
import axios from 'axios'

window.axios = axios

window.appWatchlist = function(route, payload, isInWatchlist) {
  return {
    payload,
    isInWatchlist,

    async toggle() {
      const { data } = await axios.post(route, this.payload)
      this.isInWatchlist = !data.wasDeleted
    }
  }
}

window.appCompleted = function(route, payload, isCompleted) {
  return {
    payload,
    isCompleted,

    async toggle() {
      const { data } = await axios.post(route, this.payload)
      this.isCompleted = !data.wasDeleted
    }
  }
}
