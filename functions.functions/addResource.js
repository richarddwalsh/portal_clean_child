/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

exports.main = ({ body }, sendResponse) => {
  const {
    file,
    type,
    name,
    description,
    retain,
    objectType,
    objectId
  } = body;

  console.log(retain);

  let fileBuffer;

  try {
    fileBuffer = Buffer.from(file, "base64");
  } catch (error) {
    console.error("Error:", error);
    sendResponse({
      body: { status: "failure", error: error.message },
      statusCode: 500
    });
  }  

  if (!fileBuffer) {
    sendResponse({
      body: { status: "failure", error: "No file buffer" },
      statusCode: 500
    });
  }

  const formData = new FormData();
  formData.append("file", fileBuffer, {filename: name, contentType: type});
  formData.append("options", JSON.stringify({ "access": "PRIVATE" }));  // Adjust options as needed
  formData.append("folderId", 142158985575);
  let config = {
    headers: {
      ...formData.getHeaders(),
      "Authorization": `Bearer ${process.env.portal_token}`
    }
  };
  
  const baseEndpoint = "https://api.hubapi.com";
  const fileEndpoint = `${baseEndpoint}/files/v3/files`;
  let row;
  axios.post(fileEndpoint, formData, config)
    .then(fileResponse => {
      const singedUrlEndpoint = `${baseEndpoint}/files/v3/files/${fileResponse.data.id}/signed-url`;
      config = {
        headers: {
          "Authorization": `Bearer ${process.env.portal_token}`
        }
      };
      return axios.get(singedUrlEndpoint, config);
    })
    .catch(error => {
      console.error("Error:", error);
      sendResponse({
        body: { status: "failure", error: error.message, step: "file" },
        statusCode: 500
      });
    })
    .then(signedUrlResponse => {
      const fileUrl = signedUrlResponse.data.url;
      const resourceEndpoint = `${baseEndpoint}/cms/v3/hubdb/tables/7284336/rows`;
      const resourceData = {
        "name": description,
        "values": {
          "object_type": objectType,
          "object_id": objectId,
          "description": description,
          "retain": retain ? 1 : 0,
          "file_url": fileUrl,
          "name": name,
          "type": type
        }
      };
      
      return axios.post(resourceEndpoint, resourceData, config);
    })
    .then(hubDBResponse => {
      row = hubDBResponse;
      const publishEndpoint = `${baseEndpoint}/cms/v3/hubdb/tables/7284336/draft/publish`;
      return axios.post(publishEndpoint, {}, config);
    })
    .catch(error => {
      console.error("Error:", error);
      sendResponse({
        body: { status: "failure", error: error.message, step: "hubdb" },
        statusCode: 500
      });
    })
    .then(publishResponse => {
      sendResponse({
        body: { status: "success", response: row.data },
        statusCode: 200
      });
    })
    .catch(error => {
      console.error("Error:", error);
      sendResponse({
        body: { status: "failure", error: error.message, step: "publish" },
        statusCode: 500
      });
    });
}