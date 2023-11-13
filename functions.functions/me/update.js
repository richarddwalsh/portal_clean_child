/* eslint-disable import/no-unresolved */

// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  // Get the parameters from the body of the request
  const { properties, id } = body;

  // restructure the data for hubspot
  const data = {
    properties: {
      firstname: properties.firstname,
      lastname: properties.lastname,
      email: properties.email,
      hs_additional_emails: '',
      phone: '',
      mobilephone: '',
      fax: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      work_address: '',
      work_address_2: '',
      work_city: '',
      work_state: '',
      work_zip: '',
      other_address: '',
      other_address_2: '',
      other_city: '',
      other_state: '',
      other_zip: '',
      birthday: '',
      gender: '',
      anniversary: '',
    }
  };

  // Now we need to loop through the addresses and emails and add them to the data object
  properties.addresses.forEach((address) => {
    // if address.type === 'Home' no prefix use standard and use address2
    // if address.type === 'Work' use prefix work_ and use work_address_2
    // if address.type === 'Other' use prefix other_ and use other_address_2
    const prefix = address.type === 'Home' ? '' : `${address.type.toLowerCase()}_`;
    data.properties[`${prefix}address`] = address.address;
    if (address.type !== 'Home') {
      data.properties[`${prefix}address_2`] = address.address2;
    } else {
      data.properties[`${prefix}address2`] = address.address2;
    }
    data.properties[`${prefix}city`] = address.city;
    data.properties[`${prefix}state`] = address.state;
    data.properties[`${prefix}zip`] = address.zip;    
  });

  properties.phones.forEach((phone) => {
    // if phone.type === 'Home' use property phone
    // if phone.type === 'Mobile' use property mobilephone
    // if phone.type === 'Fax' use property fax
    switch (phone.type) {
      case 'Home':
        data.properties.phone = phone.number;
        break;
      case 'Mobile':
        data.properties.mobilephone = phone.number;
        break;
      case 'Fax':
        data.properties.fax = phone.number;
        break;
      default:
        data.properties.phone = phone.number;
        break;
    }
  });

  const additionalEmails = []; // Array to hold additional emails

  properties.emails.forEach((email) => {
    // if email.primary === true use property email
    // if email.primary === false use property hs_additional_emails as comma separated string
    if (email.primary) {
      data.properties.email = email.address;
    } else if (!data.properties.hs_additional_emails.includes(email.address)) {
      // Do not include the primary email in the additional emails,
      // do not include duplicates
      additionalEmails.push(email.address);
    }
  });

  // Join the array into a string with commas and no trailing comma
  data.properties.hs_additional_emails = additionalEmails.join(', ');

  // Format the birthday and anniversary dates
  // object { year: 1990, month: 1, day: 1 } render as 1990-01-01
  if (properties.birthday) {
    data.properties.birthday = `${properties.birthday.year}-${properties.birthday.month}-${properties.birthday.day}`;
  }

  if (properties.anniversary) {
    data.properties.anniversary = `${properties.anniversary.year}-${properties.anniversary.month}-${properties.anniversary.day}`;
  }

  // Loop through remaining keys and map to properties.
  Object.keys(properties).forEach((key) => {
    if (key !== 'addresses' && key !== 'phones' && key !== 'emails' && key !== 'firstname' && key !== 'lastname' && key !== 'anniversary' && key !== 'birthday') {
      data.properties[key] = properties[key];
    }
  });

  // Now we need to make the request to HubSpot
  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  const endpoint = `https://api.hubapi.com/crm/v3/objects/contacts/${id}`;
  sendResponse({ body: { status: "success", response: data, endpoint, step: "patch" }, statusCode: 200 });
  // axios
  //   .patch(endpoint, JSON.stringify(data), config)
  //   .catch(error => {
  //     sendResponse({ body: { status: "error", error: error.message, step: "patch" }, statusCode: 200 });
  //   })
  //   .then((response) => {
  //     sendResponse({ body: { status: "success", response: response.data, step: "patch" }, statusCode: 200 });
  //   });
};