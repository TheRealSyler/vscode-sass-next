const connection = new WebSocket('ws://localhost:3010')
const box = document.getElementById('_sass_message_box')
const style = document.getElementById('_sass_style')
const properties = document.getElementById('_sass_properties')
const previewDiv = document.getElementById('_sass_preview_div')

const form = document.getElementById('_sass_form')
const focusout = document.getElementById('_sass_focusout')

const header_copy = document.getElementById('_sass_header_copy')
const header_write = document.getElementById('_sass_header_write')
const header_edit = document.getElementById('_sass_header_edit')
const header_reload = document.getElementById('_sass_header_reload')
const header_options = document.getElementById('_sass_header_options')
let firstMessageBoxChild = undefined;
let sassData = undefined;
let _selector = undefined;

const showFormTypes = {
  edit: 'EDIT',
  options: 'OPTIONS',
  writeWarning: 'WRITE_WARNING'
}
const textBoxTypes = {
  sass: 'SASS',
  css: 'CSS'
}

let options = {
  showEdit: false
}

// # SECTION Focusout
focusout.addEventListener('click', () => toggleFocusout())
//. !SECTION
// # SECTION Header
header_copy.addEventListener('click', () => navigator.clipboard.writeText(getCopyText()))
header_reload.addEventListener('click', () => reload())
header_edit.addEventListener('click', () => showForm(showFormTypes.edit))
header_options.addEventListener('click', () => showForm(showFormTypes.options))
header_write.addEventListener('click', () => showForm(showFormTypes.writeWarning))
//. !SECTION

// # SECTION Content
connection.addEventListener('open', () => {
  console.log('Connected');
});

reload()

connection.addEventListener('message', e => {
  const data = JSON.parse(e.data)
  const payload = data.payload
  switch (data.type) {
    case 'message':
      addMessage(payload)
      break;
    case 'setPreview':
      previewDiv.classList = ['_sass_preview_class']
      style.innerHTML = payload.css;
      sassData = payload.sass;
      _selector = payload.selector
      addProperties(payload.sass);
      break;
  }

});

function addProperties (sass) {
  const lines = sass.split('\n');
  let currentSelectors = ''
  let lastLineDistance = 0
  while (properties.firstChild) {
    properties.removeChild(properties.firstChild);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineDistance = getDistance(line)
    if (isProperty(line) && !line.trim().startsWith('&')) {
      const split = line.split(':');
      let div = document.createElement('div');
      div.classList = ['_sass_property']
      // prop name
      let propName = document.createElement('div');
      propName.classList = ['_sass_property_name']
      propName.innerHTML = split[0].trim();
      // input
      let propInput = document.createElement('input');
      propInput.classList = ['_sass_inp']
      propInput.spellcheck = false;
      propInput.id = currentSelectors.concat('|-SPLIT-|', split[0].trim());
      propInput.value = split[1].trim();
      propInput.addEventListener('input', propertyChangeListener)

      div.appendChild(propName)
      div.appendChild(propInput)

      properties.appendChild(div)
    } else if (line.trim().startsWith('&')) {
      let div = document.createElement('p');
      div.classList = ['_sass_selector']

      const res = getSelectors(line, currentSelectors, lineDistance, lastLineDistance, div)
      div.innerHTML = res.div
      currentSelectors = res.currentSelectors

      properties.appendChild(div)
      lastLineDistance = lineDistance;
    }

  }

}

function addSass (id, value) {
  const split = id.split('|-SPLIT-|')
  let prop = undefined
  let parentSelectors = ''
  if (split[1]) {
    parentSelectors = split[0]
    prop = split[1]
  } else {
    prop = split[0]
  }
  let currentSelectors = ''
  let lastLineDistance = 0
  const data = sassData.split('\n')
  let newData = ''
  for (let i = 0; i < data.length; i++) {
    let line = data[i];
    const lineDistance = getDistance(line)

    if (new RegExp('^ *'.concat(escapeRegExp(prop), ':')).test(line) && currentSelectors === parentSelectors) {
      line = line.split(':')[0].concat(': ', value)
    } else if (line.trim().startsWith('&')) {

      const res = getSelectors(line, currentSelectors, lineDistance, lastLineDistance)
      currentSelectors = res.currentSelectors

      lastLineDistance = lineDistance;
    }

    if (line) {
      newData = newData.concat(line, '\n')
    }


  }
  addMessage(`Property: '${prop}' changed`)
  sassData = newData;
  return newData
}
//. !SECTION

//# SECTION Helper Functions


function writeSass () {
  fetch('/writeToFile', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify({ sass: sassData }),
  }).then(res => res.json()).then(data => {
    console.log('[Write File]:', data)
  })
}

function reload () {
  fetch('/setPreview', {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', },
    redirect: 'follow',
    referrer: 'no-referrer'
  }).then(res => res.json()).then(data => {
    console.log('[setPreview]:', data)
  })
}

function createTextBox (content, type) {
  const textBox = document.createElement('textarea')
  textBox.value = content
  textBox.spellcheck = false
  textBox.addEventListener('input', () => {
    switch (type) {
      case textBoxTypes.css:
        style.textContent = textBox.value
        break;
      case textBoxTypes.sass:
        sassData = textBox.value
        break;

    }
  })
  textBox.classList = '_sass_text_box'
  form.appendChild(textBox)
}

function toggleFocusout (show) {
  if (show === undefined) {
    if (focusout.style.display === 'block') {
      focusout.style.display = 'none'
      form.classList = ''
      while (form.firstChild) {
        form.removeChild(form.firstChild);
      }
    } else {
      focusout.style.display = 'block'
    }
  } else {
    if (show) {
      form.classList = ''
    }
    focusout.style.display = show === true ? 'block' : 'none'

  }
}
function showForm (type) {
  toggleFocusout(true)
  form.classList = '_sass_show_form'

  const closeButton = document.createElement('div')
  closeButton.classList = '_sass_btn'
  closeButton.textContent = 'Close'
  closeButton.style.margin = '10px'
  closeButton.style.cssFloat = 'right'
  closeButton.addEventListener('click', () => toggleFocusout())
  form.appendChild(closeButton)

  switch (type) {
    case showFormTypes.edit:
      createTextBox(style.textContent, textBoxTypes.css)
      createTextBox(sassData, textBoxTypes.sass)

      break;
    case showFormTypes.options:
      const showEditDiv = document.createElement('div')
      showEditDiv.textContent = 'Show Edit: '
      showEditDiv.style.margin = '20px'
      showEditDiv.style.background = '#00000000'
      showEditDiv.style.display = 'flex'
      const showEdit = document.createElement('input')
      showEdit.type = 'checkbox'
      showEdit.checked = options.showEdit

      showEdit.classList = '_sass_checkbox'
      showEdit.addEventListener('input', (e) => {
        options.showEdit = showEdit.checked
        header_edit.style.display = options.showEdit ? 'block' : 'none'
      })

      showEditDiv.appendChild(showEdit)
      form.appendChild(showEditDiv)

      break;
    case showFormTypes.writeWarning:
      //
      form.classList = '_sass_show_form _sass_show_form_compact'
      const msg = document.createElement('div')
      msg.textContent = 'Are you sure that you want to write to the file.'
      msg.classList = '_sass_show_form_msg'
      const yesBtn = document.createElement('div')
      yesBtn.classList = '_sass_btn _sass_show_form_btn'
      yesBtn.textContent = 'Yes'
      yesBtn.addEventListener('click', () => {
        writeSass()
        toggleFocusout()
      })
      const noBtn = document.createElement('div')
      noBtn.classList = '_sass_btn _sass_show_form_btn'
      noBtn.textContent = 'No'
      noBtn.style.left = '144px'
      noBtn.addEventListener('click', () => toggleFocusout())

      form.appendChild(msg)
      form.appendChild(yesBtn)
      form.appendChild(noBtn)
      break;
  }


}

function getCopyText () {
  return sassData.replace('_sass_preview_class', _selector)
}

function addMessage (message) {
  let div = document.createElement('div');
  div.classList = ['_sass_message']
  if (message.startsWith('ERROR')) {
    message = message.replace('ERROR ', '')
    div.classList = '_sass_err _sass_message'
  }
  div.innerHTML = message;
  if (firstMessageBoxChild === undefined) {
    firstMessageBoxChild = div
    box.appendChild(div)
  } else {
    box.insertBefore(div, firstMessageBoxChild)
    firstMessageBoxChild = div
  }
  if (box.children.length > 100) {
    console.log('REMOVE CHILD')
    while (box.children.length > 100) {
      box.removeChild(box.lastChild)
    }
  }
}

function propertyChangeListener (e) {

  let data = { sass: addSass(e.srcElement.id.replace(/&amp;/g, '&'), e.srcElement.value) };
  // TODO add delay 
  fetch('/compileSass', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(data),
  }).then(res => res.json()).then(data => {
    if (data.css) {
      style.textContent = data.css
    }
  })
}

function getSelectors (line, currentSelectors, lineDistance, lastLineDistance, div) {
  if (lineDistance > lastLineDistance) {
    currentSelectors = currentSelectors === '' ? line.trim() : currentSelectors.concat(' ', line.trim());
    div = currentSelectors.replace(/ /g, '<br>')
    return { div, currentSelectors }
  } else {
    if (div) {
      div = line
    }
    currentSelectors = line.trim()
    return { div, currentSelectors }
  }

}
//. !SECTION



// # SECTION  Lib
/**
 * Check whether text is a property
 */
function isProperty (text) {
  return /^ *.*:/.test(text);
}

/**
 * returns the distance between the beginning and the first char that is not the checkAgainstChar in form of a number.
 * @param checkAgainstChar defaults to `' '` should always be only one char.
 */
function getDistance (text, checkAgainstChar = ' ') {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char !== checkAgainstChar) {
      break;
    }
    count++;
  }
  return count;
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


/**
 * adds or removes whitespace based on the given offset, a positive value adds whitespace a negative value removes it.
 */
function replaceWithOffset (text, offset) {
  if (offset < 0) {
    text = text.replace(new RegExp(`^ {${Math.abs(offset)}}`), '');
  } else {
    let space = '';
    for (let i = 0; i < offset; i++) {
      space = space.concat(' ');
    }
    text = text.replace(/^/, space);
  }
  return text;
}





//. !SECTION