const buttons = document.querySelectorAll('[data-reach-menu-button]');
const actionBtns = document.querySelectorAll('.minor-btn');
const submenus = document.querySelectorAll('[data-reach-menu]');
const triggerBtns = document.querySelectorAll('.modal-trigger');
const cancelBtns = document.querySelectorAll('.cancel-btn');
const modals = document.querySelectorAll('.modal');

const paramMapping = {
  'menu-button--menu--group_type': {
    param: 'group_type',
    valueText: 'Group Type'
  },
  'menu-button--menu--location_type': {
    param: 'location_type_preference',
    valueText: 'Location Type'
  },
  'menu-button--menu--target-audience': {
    param: 'target_audience',
    valueText: 'Target Audience'
  },
  'menu-button--menu--frequency': {
    param: 'frequency',
    valueText: 'Frequency'
  },
  'menu-button--menu--neighborhood': {
    param: 'neighborhood___area',
    valueText: 'Neighborhood | Area'
  },
  'menu-button--menu--timezone': {
    param: 'time_zone',
    valueText: 'Time Zone'
  },
  'menu-button--menu--day_of_week': {
    param: 'day_of_week',
    valueText: 'Day of Week'
  },
  'menu-button--menu--time_of_day': {
    param: 'time_of_day',
    valueText: 'Time of Day'
  },
  'menu-button--menu--campus': {
    param: 'campus',
    valueText: 'All Campuses'
  },
  'menu-button--menu--category': {
    param: 'category',
    valueText: 'All Categories'
  },
  'menu-button--menu--schedule': {
    param: 'schedule',
    valueText: 'Schedule'
  },
  'menu-button--menu--location': {
    param: 'location',
    valueText: 'Location'
  },
  'menu-button--menu--experience': {
    param: 'experience',
    valueText: 'Requires Experience'
  },
  'menu-button--menu--background': {
    param: 'background',
    valueText: 'Background'
  },
}

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

function openModal(event) {
  event.stopPropagation();
  const targetModalId = event.currentTarget.getAttribute('data-target');
  const targetModal = document.getElementById(targetModalId);
  targetModal.style.display = 'block';
}

function closeModal() {
  modals.forEach((el) => {
    const modal = el;
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

    if (response.status === 'success') {
      if (returnUrl) {
        window.location.href = returnUrl;
        return;
      }

      window.location.reload();
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
}

// Function to hide all submenus
function hideAllSubmenus() {
  console.log("Hide all submenus");
  submenus.forEach((submenu) => {
    const subMenuElement = submenu;
    subMenuElement.style.display = 'none';
  });
}

// document.addEventListener('click', (event) => {
//   // Check if the click event is not on any button or submenu
//   const isButtonClick = Array.from(buttons).some((button) => button.contains(event.target));
//   const isActionButtonClick = Array.from(actionBtns).some((button) => button.contains(event.target));
//   const isSubmenuClick = Array.from(submenus).some((submenu) => submenu.contains(event.target));

//   if (!isButtonClick && !isSubmenuClick || !isActionButtonClick && !isSubmenuClick) {
//     hideAllSubmenus(event);
//   }
// });

function showActionMenu(event) {
  event.stopPropagation();

  const button = event.currentTarget;
  const buttonId = button.id;

  if (buttonId === 'add-participant-btn') return;

  hideAllSubmenus();

  const subMenuId = `${buttonId.split('--')[1]}--${buttonId.split('--')[2]}`;
  const subMenu = document.getElementById(subMenuId);
  
  const buttonRect = button.getBoundingClientRect();

  subMenu.parentNode.style.left = `${buttonRect.left}px`;
  subMenu.parentNode.style.top = `${buttonRect.bottom + 15}px`;
  subMenu.parentNode.style.display = 'block';
}

function updateButtonsFromUrlParams() {
  const url = new URL(window.location);
  const {searchParams} = url;

  Object.keys(paramMapping).forEach((buttonId) => {
    const urlParamObj = paramMapping[buttonId];
    const button = document.getElementById(buttonId);

    if (!button) return;

    const paramValue = searchParams.get(urlParamObj.param);
    
    if (paramValue === "true") { 
      button.innerText = "Yes";
    } else if (paramValue === "false") { 
      button.innerText = "No";
    } else if (paramValue) {
      button.innerText = paramValue;
    } else {
      button.innerText = urlParamObj.valueText; // Reset to default text
    }
  });
}

// Function to update button text and URL
function updateButtonAndUrl(event) {
  const valueText = event.target.getAttribute('data-valuetext');
  const buttonId = event.target.parentNode.getAttribute('aria-labelledby');
  const button = document.getElementById(buttonId);

  if (button) {
    if (valueText === 'true') {
      button.innerText = "Yes";
    } else if (valueText === 'false') {
      button.innerText = "No";
    } else {
      button.innerText = valueText;
    }
  }

  // Find the corresponding URL parameter
  const urlParamObj = paramMapping[buttonId];
  if (!urlParamObj) {
    console.error(`No URL parameter mapping found for button ID ${buttonId}`);
    return;
  }

  // Update the URL
  const url = new URL(window.location);
  if (valueText === '(any)') {
    button.innerText = urlParamObj.valueText;  // Reset to default label
    url.searchParams.delete(urlParamObj.param);  // Delete the URL param
  } else {
    url.searchParams.set(urlParamObj.param, valueText);  // Set the URL param
  }

  // To change the URL without reloading the page
  // window.history.pushState({}, '', url);

  // Uncomment the next line if you want to reload the page after changing the URL
  window.location.href = url;

  hideAllSubmenus();
}

// Check if the number of buttons and submenus match
if (buttons.length === submenus.length) {
  buttons.forEach((button, index) => {
    // Your existing code to add click event listeners and manage submenu displays

    // Add click event listener to menu items within each submenu
    const menuItems = submenus[index].querySelectorAll('[role="menuitem"]');
    menuItems.forEach((menuItem) => {
      menuItem.addEventListener('click', updateButtonAndUrl);
    });
  });

  // Loop through each button to add click event listeners
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      // Hide all submenus first
      hideAllSubmenus();

      const buttonId = button.id;
      const subMenuId = `${buttonId.split('--')[1]}--${buttonId.split('--')[2]}`;
      const subMenu = document.getElementById(subMenuId);
      const subMenuWrapper = subMenu.parentNode;
      
      const buttonRect = button.getBoundingClientRect();
      console.log(buttonRect);

      subMenuWrapper.style.left = `${buttonRect.left}px`;
      subMenuWrapper.style.top = `${buttonRect.bottom + 15}px`;
      subMenuWrapper.style.display = 'block';
      console.log(subMenuWrapper);
    });
  });

  // Add a click event listener to the document to close the submenu when clicking outside
  document.addEventListener('click', (event) => {
    // Check if the click event is not on any button or submenu
    const isButtonClick = Array.from(buttons).some((button) => button.contains(event.target));
    const isSubmenuClick = Array.from(submenus).some((submenu) => submenu.contains(event.target));

    if (!isButtonClick && !isSubmenuClick) {
      hideAllSubmenus();
    }
  });
} else {
  console.error('Number of buttons and submenus do not match.');
  console.log(buttons);
  console.log(submenus);
}

actionBtns.forEach((button) => {
  button.addEventListener('click', showActionMenu);
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

  const progressCircle = form.querySelector('.progress-circle');
  progressCircle.style.display = 'block';

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

window.addEventListener('DOMContentLoaded', () => {
  updateButtonsFromUrlParams();
});

const addParticipantBtn = document.getElementById('add-participant-btn');
if (addParticipantBtn) {
  addParticipantBtn.addEventListener('click', () => {
    const participantContainer = document.getElementById('participant-container');
    const template = document.getElementById('participant-template');
    console.log(template.content, participantContainer);
    // First We Need To Clone The Template DOM
    const clone = template.content.cloneNode(true);
    // Then we need to add the clone to the container
    participantContainer.appendChild(clone);
  });
}
