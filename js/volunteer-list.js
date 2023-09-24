// Get all the buttons and submenus
const buttons = document.querySelectorAll('[data-reach-menu-button]');
const submenus = document.querySelectorAll('[data-reach-menu]');

// Mapping of button IDs to URL parameters
const paramMapping = {
  'menu-button--menu--8': {
    param: 'schedule',
    valueText: 'Schedule'
  },
  'menu-button--menu--9': {
    param: 'location',
    valueText: 'Location'
  },
  'menu-button--menu--10': {
    param: 'experience',
    valueText: 'Requires Experience'
  },
  'menu-button--menu--11': {
    param: 'background',
    valueText: 'Background'
  },
}

// Function to hide all submenus
function hideAllSubmenus() {
  submenus.forEach((submenu) => {
    const subMenuElement = submenu;
    subMenuElement.style.display = 'none';
  });
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
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Hide all submenus first
      hideAllSubmenus();

      // Show the submenu associated with the clicked button
      submenus[index].style.display = 'block';

      // Calculate the position to place the submenu below the button
      const buttonRect = button.getBoundingClientRect();
      const buttonHeight = buttonRect.height;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Set the position of the submenu
      submenus[index].style.left = `${buttonRect.left}px`;
      submenus[index].style.top = `${buttonRect.top + buttonHeight + scrollTop}px`;
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
}

window.addEventListener('DOMContentLoaded', () => {
  updateButtonsFromUrlParams();
});