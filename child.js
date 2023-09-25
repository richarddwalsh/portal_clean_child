// Function to set the window height as a CSS variable
function setWindowHeightVariable() {
  const windowHeight = window.innerHeight;
  const footer = document.querySelector('footer');
  const footerHeight = footer ? footer.offsetHeight : 0;
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 0;
  const adjustedHeight = windowHeight - headerHeight - footerHeight;
  document.documentElement.style.setProperty('--window-inner-height', `${adjustedHeight}px`);
}

// Set the variable on page load
window.addEventListener('load', setWindowHeightVariable);

// Update the variable whenever the window is resized
window.addEventListener('resize', setWindowHeightVariable);

const triggerBtns = document.querySelectorAll('.modal-trigger');
const cancelBtns = document.querySelectorAll('.cancel-btn');
const modals = document.querySelectorAll('.modal');

function openModal(event) {
  event.stopPropagation();
  const targetModalId = event.currentTarget.getAttribute('data-target');
  const targetModal = document.getElementById(targetModalId);
  targetModal.style.display = 'block';
}

function closeModal(event) {
  modals.forEach((modal) => {
    modal.style.display = 'none';
  });
}

triggerBtns.forEach((button) => {
  button.addEventListener('click', openModal);
})

cancelBtns.forEach((button) => {
  button.addEventListener('click', closeModal);
});

// Generalized function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const form = event.currentTarget;
  const formData = new FormData(form);

  // Convert FormData to JSON
  const formDataJSON = {};
  formData.forEach((value, key) => {
    formDataJSON[key] = value;
  });

  // Get the API endpoint from the form's data-endpoint attribute
  const apiEndpoint = form.getAttribute('data-endpoint');

  // Submit Data via POST request
  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataJSON),
  })
  .then(response => response.json())
  .then(data => {
    window.location.reload();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Add Event Listener to all forms within modals
const modalForms = document.querySelectorAll('.modal form');
modalForms.forEach((form) => {
  form.addEventListener('submit', handleFormSubmit);
});