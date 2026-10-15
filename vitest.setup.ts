import '@testing-library/jest-dom/vitest'

// jsdom lacks modal <dialog> and scrollIntoView.
HTMLDialogElement.prototype.showModal ??= function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '')
}
HTMLDialogElement.prototype.close ??= function close(this: HTMLDialogElement) {
  this.removeAttribute('open')
}
Element.prototype.scrollIntoView ??= function scrollIntoView() {}
