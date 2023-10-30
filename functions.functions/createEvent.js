/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  // Create the Event Custom Object & Assoiciate it with the To Object
  const { toObjectType, toObjectId, eventName, starts_at, starts_at_time, ends_at, ends_at_time, description, repeating } = body;

  sendResponse({ body: { status: "success", response: body, step: "createEvent" }, statusCode: 200 })
};