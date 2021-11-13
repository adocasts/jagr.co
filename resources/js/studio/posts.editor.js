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