import { cacheOwnedApps, cacheSteamApps, clearOwnedCache } from "./steam"
import { closeModal, createModal, isBundlePage, isChoicePage, sanitize } from "./utils"

const HIDE_MODAL = "&&hh_extras_modal&&"

function showModal() {
  const modal = createModal(
    "hb-exclamation-circle",
    "You are not logged in to the steam store or your profile is private",
    `<p>Information about games already in your library will not be available.</p>
    <p>You can login using this <a href="https://store.steampowered.com/login" target="_blank" rel="noopener">link</a>. Reload the page after login to load the games in your library.</p>
    <p><div class="cta-button rectangular-button button-v2 red js-hero-cta" onclick="(function(){localStorage.setItem('${HIDE_MODAL}',1)})();${closeModal}">Don't show again</div></p>`
  )
  document.querySelector("#site-modal").appendChild(modal)
}

async function bundle() {
  const apps = await cacheSteamApps()
  const owned = await cacheOwnedApps()

  const loggedIn = owned.length != 0
  if (!loggedIn) {
    clearOwnedCache()
    if (!localStorage.getItem(HIDE_MODAL)) {
      showModal()
    }
  }

  document.querySelectorAll(".front-page-art-image-text").forEach((el) => {
    let appid
    if ((appid = apps[sanitize(el.textContent)])) {
      el.innerHTML = `<a href="https://store.steampowered.com/app/${appid}" style="text-decoration:underline;font-weight:normal" target="_blank" rel="noopener" title="Visit Steam Store">${el.textContent}</a>`

      if (loggedIn && owned.includes(appid)) {
        el.parentElement.parentElement
          .querySelector(".dd-caption-lock")
          .remove()
        el.firstChild.style.color = "#7f9a2f"
      }
    }
  })
}

async function choice() {
  const apps = await cacheSteamApps()
  const owned = await cacheOwnedApps()

  const loggedIn = owned.length != 0
  if (!loggedIn) {
    clearOwnedCache()
    if (!localStorage.getItem(HIDE_MODAL)) {
      showModal()
    }
  }

  document.querySelectorAll(".content-choice-title").forEach((el) => {
    let appid
    if ((appid = apps[sanitize(el.textContent)])) {
      el.innerHTML = `<a href="https://store.steampowered.com/app/${appid}" style="text-decoration:underline;color:#ecf1fe" target="_blank" rel="noopener" title="Visit Steam Store">${el.textContent}</a>`

      if (loggedIn && owned.includes(appid)) {
        el.firstChild.style.color = "#7f9a2f"
      }
    }
  })
}


if (isBundlePage()) {
  bundle()
} else if (isChoicePage()) {
  choice()
}
