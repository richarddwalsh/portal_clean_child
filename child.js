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
const actionBtns = document.querySelectorAll('.minor-btn');
const submenus = document.querySelectorAll('[data-reach-menu]');

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

function toCamelCase(str) {
  return str.split('-').map((word, index) => {
    // Don't capitalize the first word
    if (index === 0) {
      return word.toLowerCase();
    }
    // Capitalize the rest
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}

function triggerAction(event) {
  const menuItem = event.currentTarget;
  const endpoint = menuItem.getAttribute('data-endpoint');
  const returnUrl = menuItem.getAttribute('data-return-url');
  console.log(endpoint)

  if (!endpoint) return;

  const data = {};
  Array.from(menuItem.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-')) {
      const key = toCamelCase(attr.name.split('data-')[1]);
      data[key] = attr.value;
    }
  });

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .catch((error) => {
    console.error('Error:', error);
  })
  .then(response => {
    if (response.error) {
      console.log(response.error);
      return
    } 
    
    if (returnUrl && response.status && response.status === 'success') {
      window.location.href = returnUrl;
    }

    if (response.status && response.status === 'success') {
      window.location.reload();
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
}

function hideAllSubmenus() {
  submenus.forEach((submenu) => {
    submenu.style.display = 'none';
  });
};

document.addEventListener('click', (event) => {
  // Check if the click event is not on any button or submenu
  const isButtonClick = Array.from(actionBtns).some((button) => button.contains(event.target));
  const isSubmenuClick = Array.from(submenus).some((submenu) => submenu.contains(event.target));

  if (!isButtonClick && !isSubmenuClick) {
    hideAllSubmenus();
  }
});

function showSubMenu(event) {
  event.stopPropagation();

  hideAllSubmenus();

  const button = event.currentTarget;
  const buttonId = button.id;
  const subMenuId = `${buttonId.split('--')[1]}--${buttonId.split('--')[2]}`;
  console.log(buttonId, subMenuId)
  const subMenu = document.getElementById(subMenuId);
  
  const buttonRect = button.getBoundingClientRect();

  subMenu.parentNode.style.left = `${buttonRect.left}px`;
  subMenu.parentNode.style.top = `${buttonRect.bottom + 15}px`;
  subMenu.parentNode.style.display = 'block';
}

actionBtns.forEach((button) => {
  button.addEventListener('click', showSubMenu);
  submenus.forEach((submenu) => {
    const menuItems = submenu.querySelectorAll('[role="menuitem"]');
    menuItems.forEach((menuItem) => {
      menuItem.addEventListener('click', triggerAction);
    });
  });
});

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
    if (data.error) {
      console.log(data.error);
      return
    } 
    
    if (data.status && data.status === 'success') {
      window.location.reload();
    }
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