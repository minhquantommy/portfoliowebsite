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

  /* ── Scroll reveal for any .reveal elements ─────────── */
  const revealEls = document.querySelectorAll('.reveal')
  if (revealEls.length > 0) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

    revealEls.forEach(el => io.observe(el))
  }

  /* ── Smooth stat counter animation ──────────────────── */
  const statValues = document.querySelectorAll('.stat-value')
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el  = entry.target
      const raw = el.textContent.trim()           // e.g. "3+", "2K+", "5+"
      const num = parseFloat(raw)
      const suffix = raw.replace(/[\d.]/g, '')    // "+", "K+", etc.

      if (isNaN(num)) return
      counterIO.unobserve(el)

      let start = 0
      const duration = 900
      const startTime = performance.now()

      function tick(now) {
        const elapsed  = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased    = 1 - Math.pow(1 - progress, 3)  // ease-out cubic
        const current  = Math.floor(eased * num)
        el.textContent = current + suffix
        if (progress < 1) requestAnimationFrame(tick)
        else el.textContent = raw  // snap to original exact value
      }
      requestAnimationFrame(tick)
    })
  }, { threshold: 0.5 })

  statValues.forEach(el => counterIO.observe(el))

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

  // Restore saved preference
  if (localStorage.getItem('theme') === 'light') root.classList.add('light')

  toggle.addEventListener('click', () => {
    root.classList.toggle('light')
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark')
    // Clear any inline backgroundImage set by the spotlight so CSS takes over immediately
    spotlightEls.forEach(el => { el.style.backgroundImage = '' })
  })

})
