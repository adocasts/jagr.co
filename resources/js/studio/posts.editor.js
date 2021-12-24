import EditorJS from '@editorjs/editorjs';
import Checklist from '@editorjs/checklist'
import Code from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import Link from '@editorjs/link'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import NestedList from '@editorjs/nested-list'
import Paragraph from '@editorjs/paragraph'
import Raw from '@editorjs/raw'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import { DateTime } from 'luxon'
import axios from "axios";

const editor = new EditorJS({
  /**
   * Id of Element that should contain Editor instance
   */
  holder: 'editorjs',

  tools: {
    header: {
      class: Header,
      inlineToolbar: true
    },
    list: List,
    checklist: Checklist,
    code: Code,
    delimiter: Delimiter,
    embed: Embed,
    image: Image,
    link: {
      class: Link,
      inlineToolbar: true
    },
    marker: {
      class: Marker,
      inlineToolbar: true
    },
    nestedList: NestedList,
    paragraph: {
      class: Paragraph,
      inlineToolbar: true
    },
    raw: Raw,
    table: Table,
    warning: Warning,
  }
});

// publish at btn updator
document.addEventListener('DOMContentLoaded', function() {

  const now = DateTime.now()

  const dateEl = document.forms.postForm.publishAtDate
  const timeEl = document.forms.postForm.publishAtTime

  dateEl.addEventListener('input', (event) => {
    const dte = getDateTimeFromForm()
    updatePublishText(dte)
  })

  timeEl.addEventListener('input', (event) => {
    const dte = getDateTimeFromForm()
    updatePublishText(dte)
  })

  const dte = getDateTimeFromForm()
  const btnPublish = document.getElementById('btnPublish')
  const initialPublishText = btnPublish.innerText;

  if (dte.isValid) {
    updatePublishText(dte)
  } else {
    updatePublishText(now)
  }

  function getDateTimeFromForm() {
    const date = dateEl.value
    const time = timeEl.value
    return DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm')
  }

  function updatePublishText(dte) {
    if (dte > now) {
      btnPublish.innerText = `Publish ${dte.toFormat('ccc DD t ZZZZ')}`
    } else {
      btnPublish.innerText = initialPublishText
    }
  }

})

class VideoManager {
  static #normalizeSource(source) {
    return source
      .replace('www.', '')
      .replace('https://youtu.be/', 'https://youtube.com/watch?v=')
      .replace('https://youtube-nocookie.com/embed/', 'https://youtube.com/watch?v=')
      .replace('https://youtube.com/embed/', 'https://youtube.com/watch?v=')
      .replace('https://player.vimeo.com/video', 'https://vimeo.com/')
      .trim()
      .split('&')[0]
  }

  static #isSourceValid(source) {
    const videoId = source.replace('https://youtube.com/watch?v=', '')
    return (source.startsWith('https://youtube.com/watch?v=') || source.startsWith('https://vimeo.com/')) && videoId.length
  }

  static getEmbed(source) {
    var embedUrl = source
      .replace('https://youtube.com/watch?v=', 'https://youtube.com/embed/')
      .replace('https://vimeo.com/', 'https://player.vimeo.com/video/')

    return `
      <iframe
        style="width: 100%;"
        src="${embedUrl}"
        frameborder="0"
        allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture"
        allowfullscreen
      ></iframe>`
  }

  static onInput(event) {
    if (!event.target.dataset.previewSelector) {
      console.warn('Video input is missing a preview selector')
      return
    }

    const source = this.#normalizeSource(event.target.value)
    const isValid = this.#isSourceValid(source)

    if (!isValid) return

    const embed = this.getEmbed(source)
    const previewSelector = event.target.dataset.previewSelector

    document.querySelector(previewSelector).innerHTML = embed
  }
}

window.videoManager = VideoManager
