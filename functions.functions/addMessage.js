/* eslint-disable import/no-unresolved */

// Require axios library to make API requests
const axios = require('axios');

// This function is executed when a request is made to the endpoint associated with this file in the serverless.json file
exports.main = ({ body }, sendResponse) => {

  // Get the parameters from the body of the request
  const { name, objectType, objectId, createdById, createdByEmail, createdByName, originalId, reply, message } = body;

  // Create the Resource HubDB Record
  const data = {
    "name": name,
    "values": {
      "name": name,
      "object_type": objectType,
      "object_id": objectId,
      "created_by_id": createdById,
      "created_by_email": createdByEmail,
      "created_by_name": createdByName,
      "reply": reply,
      "message": message,
      "date_added": Date.now()
    }
  };

  if (originalId) {
    data.values.original_id = originalId;
  }

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  }

  // Set the tableId
  const tableId = "7272351";

  const baseURI = `https://api.hubapi.com/cms/v3/hubdb/tables/${tableId}`;

  const addRowEndpoint = `${baseURI}/rows`;
  const pusblishEndpoint = `${baseURI}/draft/publish`;
  let row;
  axios
    .post(addRowEndpoint, JSON.stringify(data), config)
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "post" }, statusCode: 200 });
    })
    .then((response) => {
      row = response;
      // We now need to publish the table
      return axios.post(pusblishEndpoint, {}, config);
    })
    .catch(error => {
      sendResponse({ body: { status: "error", error: error.message, step: "publish" }, statusCode: 200 });
    })
    .then(() => {
      sendResponse({ body: { status: "success", response: row.data, step: "publish" }, statusCode: 200 });
    });
};