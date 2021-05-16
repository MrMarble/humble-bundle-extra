/**
 * Promisify GM_xmlhttpRequest
 *
 * @param {Tampermonkey.Request<any>} options
 * @returns {Promise<Tampermonkey.RequestEventListener<Tampermonkey.Response<any>>>}
 */
export const xtmlHttp = (options) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      ...options,
      onload: resolve,
      onabort: reject,
      ontimeout: reject,
      onerror: reject,
    })
  })
}

/**
 * Removes html entities from string
 *
 *  @param {string} input string
 *  @returns {string} decoded string
 */
const decodeEntities = (() => {
  const element = document.createElement("div")

  function decodeHTMLEntities(str) {
    if (str && typeof str === "string") {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "")
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "")
      element.innerHTML = str
      str = element.textContent
      element.textContent = ""
    }

    return str
  }

  return decodeHTMLEntities
})()

/**
 * Sanitizes string by removing unwanted entities and converting to lower case
 *
 * @param {string} str input string
 * @returns {string}
 */
export const sanitize = (str) => {
  return decodeEntities(str)
    .replace(/[\u{2122}\u{00AE}]/gu, "")
    .toLowerCase()
}

/**
 * Constructs a html element from string
 *
 * @param {String} HTML representing a single element
 * @return {Element}
 */
export const htmlToElement = (html) => {
  var template = document.createElement("template")
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

/**
 *  Checks if current page is bundle
 * @returns {boolean}
 */
export const isBundlePage = () => {
  return !!document.querySelector(
    "div.inner-main-wrapper div.bundle-info-container"
  )
}

export const createModal = (icon, title, text) =>
  htmlToElement(`
  <div class="charity-details-view humblemodal-wrapper" tabindex="0">
    <div class="humblemodal-modal humblemodal-modal--open" style="opacity: 1;">
      <a class="js-close-modal close-modal" href="#" onclick="(function(e){e.preventDefault();e.target.parentElement.parentElement.parentElement.remove()})(event)">
        <i class="hb ${icon}"></i>
      </a>
      <div class="charity-info-wrapper">
        <div class="charity-media">
          <div class="charity-logo">
            <i class="hb hb-exclamation-circle" style="font-size:13em;color:#c9262c"></i>
          </div> 
        </div>
        <div class="charity-details">
          <div class="charity-title">
            <h2>${title}</h2>
          </div>
          <div class="charity-description">
            ${text}
          </div>
        </div>
        </div>
    </div>
</div>
  `)
