let isYtVideoPlaying = false
window.initVideo = function ({ el = 'ytEmbed', videoId } = {}) {
  const tag = document.createElement('script')
  let player
  tag.src = "https://www.youtube.com/iframe_api"
  document.body.appendChild(tag)

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player(el, {
      videoId: videoId,
      playerVars: {
        autoplay: window.$params.autoplay ?? 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        ecver: 2,
        start: 0 // set to user's last watch time
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    })
  }

  function onPlayerReady(event) {
    // player.playVideo()
    // setTimeout(() => player.pauseVideo(), 500)
    // setTimeout(() => player.seekTo(300), 500)
    window.player = player
  }

  function onPlayerStateChange(event) {
    isYtVideoPlaying = event.data == YT.PlayerState.PLAYING
  }
}
