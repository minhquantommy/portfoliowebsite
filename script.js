/* ── Staggered page load ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Fade-up the profile header first, then each card in sequence
  const profile = document.querySelector('.profile')
  const cards   = document.querySelectorAll('.card')

  if (profile) {
    profile.style.opacity = '0'
    profile.style.transform = 'translateY(20px)'
    profile.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)'
    requestAnimationFrame(() => {
      setTimeout(() => {
        profile.style.opacity = '1'
        profile.style.transform = 'translateY(0)'
      }, 80)
    })
  }

  cards.forEach((card, i) => {
    card.style.opacity = '0'
    card.style.transform = 'translateY(20px)'
    card.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)'
    setTimeout(() => {
      card.style.opacity = '1'
      card.style.transform = 'translateY(0)'
    }, 200 + i * 80)
  })

  /* ── Cursor spotlight on cards ───────────────────────── */
  document.querySelectorAll('.card, .profile').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect      = card.getBoundingClientRect()
      const x         = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1)
      const y         = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1)
      const spotlight = getComputedStyle(document.documentElement).getPropertyValue('--card-spotlight').trim()
      const base      = getComputedStyle(document.documentElement).getPropertyValue('--card').trim()
      card.style.backgroundImage =
        `radial-gradient(circle at ${x}% ${y}%, ${spotlight} 0%, ${base} 60%)`
    })
    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = ''
    })
  })

  /* ── Theme toggle ─────────────────────────────────────── */
  const root        = document.documentElement
  const toggle      = document.getElementById('theme-toggle')
  const spotlightEls = document.querySelectorAll('.card, .profile')

  // Default is light mode, dark is opt-in
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    root.classList.remove('light')
  } else {
    root.classList.add('light')
  }

  toggle.addEventListener('click', () => {
    root.classList.toggle('light')
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark')
    spotlightEls.forEach(el => { el.style.backgroundImage = '' })
    // Clear any inline backgroundImage set by the spotlight so CSS takes over immediately
    spotlightEls.forEach(el => { el.style.backgroundImage = '' })
  })

})
