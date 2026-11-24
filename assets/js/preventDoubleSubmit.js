;(() => {
  const disableSubmitButtons = event => {
    event.currentTarget.querySelectorAll('button[data-prevent-double-click="true"]').forEach(button => {
      button.setAttribute('data-clicked', 'true')
      button.setAttribute('disabled', '')
      button.setAttribute('aria-disabled', 'true')
    })
  }

  document.querySelectorAll('form').forEach(form => form.addEventListener('submit', disableSubmitButtons))
})()
