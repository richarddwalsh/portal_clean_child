// const buttons = document.querySelectorAll('.modal-trigger');
// const modals = document.querySelectorAll('.modal');

// function openModal(event) {
//   event.stopPropagation();
//   const targetModalId = event.currentTarget.getAttribute('data-target');
//   const targetModal = document.getElementById(targetModalId);
//   targetModal.style.display = 'block';
// }

// function closeModal(event) {
//   modals.forEach((el) => {
//     const modal = el;
//     if (event.target === modal) {
//       modal.style.display = 'none';
//     }
//   });
// }

// buttons.forEach((button) => {
//   button.addEventListener('click', openModal);
// })

// document.addEventListener('click', closeModal);

// // Generalized function to handle form submission
// function handleFormSubmit(event) {
//   event.preventDefault(); // Prevent default form submission

//   // Collect form data
//   const form = event.currentTarget;
//   const formData = new FormData(form);

//   // Convert FormData to JSON
//   const formDataJSON = {};
//   formData.forEach((value, key) => {
//     formDataJSON[key] = value;
//   });

//   // Get the API endpoint from the form's data-endpoint attribute
//   const apiEndpoint = form.getAttribute('data-endpoint');

//   // Submit Data via POST request
//   fetch(apiEndpoint, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(formDataJSON),
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);
//     modals.forEach((el) => {
//       const modal = el;
//       if (event.target === modal) {
//         modal.style.display = 'none';
//       }
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
// }

// // Add Event Listener to all forms within modals
// const modalForms = document.querySelectorAll('.modal form');
// modalForms.forEach((form) => {
//   form.addEventListener('submit', handleFormSubmit);
// });