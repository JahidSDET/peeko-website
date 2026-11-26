// Peeko website behaviour: theme, mobile menu, and the Buy button.
//
// ▶ When Paddle approves your account, paste your Paddle checkout link below.
//   Until then, every Buy button sends visitors to the contact page to be
//   notified at launch.
const CONFIG = {
  checkoutUrl: '', // e.g. 'https://buy.paddle.com/product/...' or your Paddle hosted-checkout link
  launchPrice: '$19',
  regularPrice: '$24'
}

;(function () {
  const root = document.documentElement

  // Theme: remembered choice, otherwise the visitor's system setting.
  const saved = localStorage.getItem('peeko-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  const apply = (t) => {
    root.dataset.theme = t
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
      b.innerHTML = t === 'dark' ? ICON_SUN : ICON_MOON
    })
  }
  const ICON_SUN =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
  const ICON_MOON =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
  apply(saved || (prefersDark.matches ? 'dark' : 'light'))
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('peeko-theme')) apply(e.matches ? 'dark' : 'light')
  })
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-theme-toggle]')
    if (toggle) {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('peeko-theme', next)
      apply(next)
    }
    const menu = e.target.closest('[data-menu]')
    if (menu) {
      const links = document.querySelector('.nav-links')
      const open = links.classList.toggle('open')
      menu.setAttribute('aria-expanded', String(open))
    } else if (e.target.closest('.nav-links a')) {
      document.querySelector('.nav-links')?.classList.remove('open')
    }
  })

  // Buy buttons
  document.querySelectorAll('[data-buy]').forEach((a) => {
    if (CONFIG.checkoutUrl) {
      a.href = CONFIG.checkoutUrl
    } else {
      a.href = 'contact.html?notify=1'
      const label = a.querySelector('[data-buy-label]')
      if (label) label.textContent = a.dataset.soonLabel || 'Get notified at launch'
    }
  })
  document.querySelectorAll('[data-launch-price]').forEach((el) => (el.textContent = CONFIG.launchPrice))
  document.querySelectorAll('[data-regular-price]').forEach((el) => (el.textContent = CONFIG.regularPrice))

  // Contact page: launch-notification message
  if (new URLSearchParams(location.search).has('notify')) {
    document.querySelector('[data-notify]')?.removeAttribute('hidden')
  }

  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())))
})()
