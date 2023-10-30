/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const axios = require('axios');
const fs = require('fs');

exports.main = ({ body }, sendResponse) => {
  const { objectType, objectId, description, type, name, binary } = body;
  const tableId = "7284336"; 
  const baseEndpoint = "https://api.hubapi.com";
  const fileEndpoint = `${baseEndpoint}/filemanager/api/v3/files/upload`;
  const resourceEndpoint = `${baseEndpoint}/cms/v3/hubdb/tables/${tableId}/rows`;

  const config = {
    headers: {
      'Authorization': `Bearer ${process.env.portal_token}`,
      'Content-Type': 'application/json'
    }
  };

  const file = fs.createReadStream(binary);

  const fileData = {
    // file,
    folderId: 142158985575,
  };

  return sendResponse({
    body: { status: "success", response: file },
    statusCode: 200
  });

  // Step 1: Upload the file & get the URL
  // axios.post(fileEndpoint, fileData, config)
  //   .catch(error => sendResponse({
  //     body: { status: "failure", error: error.message },
  //     statusCode: 500
  //   }))
  //   .then(fileResponse => {
  //     const resp = fileResponse.data
  //     // return fileResponse.data.url;
  //     return sendResponse({
  //       body: { status: "success", response: resp },
  //       statusCode: 200
  //     });
  //   })
    // .then(fileUrl => {
    //   // Step 2: Add the resource to HubDB
    //   const resourceData = {
    //     "name": description,  // Assuming name is description
    //     "values": {
    //       "object_type": objectType,
    //       "object_id": objectId,
    //       "description": description,
    //       "file_url": fileUrl // Assuming the HubDB table has a 'file_url' column
    //     }
    //   };
    //   return axios.post(resourceEndpoint, resourceData, config);
    // })
    // .then(hubDBResponse => {
    //   if (!hubDBResponse.data || hubDBResponse.data.error) {
    //     return Promise.reject(new Error("Failed to add the resource to HubDB."));
    //   }
    //   // Step 3: Send the response back
    //   return sendResponse({
    //     body: { status: "success", response: hubDBResponse.data },
    //     statusCode: 200
    //   });
    // })
    // .catch(error => {
    //   console.error("Error:", error);
    //   return sendResponse({
    //     body: { status: "failure", error: error.message },
    //     statusCode: 500
    //   });
    // });
};
