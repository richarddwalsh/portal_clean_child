/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const axios = require("axios");

exports.main = async ({ params }, sendResponse) => {
  if (typeof params === "undefined") {
    sendResponse({
      body: { status: "error", error: "No params provided." },
      statusCode: 400
    });
  }

  const { fileId } = params;
  if (typeof fileId === "undefined") {
    sendResponse({
      body: { status: "error", error: "No fileId param provided." },
      statusCode: 400
    });
  }
  
  const baseEndpoint = "https://api.hubapi.com";
  const config = {
    method: 'get',
    url: `${baseEndpoint}/files/v3/files/${fileId[0]}`,
    headers: {
      "Authorization": `Bearer ${process.env.portal_token}`
    }
  };

  axios.request(config)
    .then((response) => {
      if (response.data) {
        const fileUrl = response.data.url;
        sendResponse({
          body: { status: "success", fileUrl },
          statusCode: 200
        });
      } else {
        sendResponse({
          body: { status: "failure", error: "could not find file" },
          statusCode: 500
        })
      }
    })
    .catch((error) => {
      sendResponse({
        body: { status: "failure", error: error.message },
        statusCode: 500
      })
    })
};
