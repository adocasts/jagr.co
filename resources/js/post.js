let isYtVideoPlaying = false
window.initVideo = function ({ el = 'ytEmbed', videoId } = {}) {
  const tag = document.createElement('script')
  let player
  tag.src = "https://www.youtube.com/iframe_api"
  document.body.appendChild(tag)

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player(el, {
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    })
  }

  function onPlayerReady(event) {

  }

  function onPlayerStateChange(event) {
    isYtVideoPlaying = event.data == YT.PlayerState.PLAYING
  }
}
