function isMobile() {
  return navigator.maxTouchPoints > 0
}

export function animateButtonClicks() {
  if (isMobile()) {
    const buttonClasses = ['[data-submit-btn]', '[data-calculate-btn]']

    buttonClasses.forEach(v => {
      const element = document.querySelector(v) as HTMLElement

      element.ontouchstart = () => {
        element.classList.add('pressed')
      }
      element.ontouchend = () => {
        element.classList.remove('pressed')
      }
    })
  }
}
