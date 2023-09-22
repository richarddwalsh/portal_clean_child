const contactBtn = document.querySelector('#contact-btn');
const modal = document.querySelector('#message-modal');

contactBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});
