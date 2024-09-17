/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const axios = require("axios");

exports.main = async ({ body }, sendResponse) => {
  const { fileId, rowId } = body;

  const baseEndpoint = "https://api.hubapi.com";
  const config = {
    headers: {
      "Authorization": `Bearer ${process.env.portal_token}`
    }
  };

  try {
    // Step 1: Delete the file from HubSpot Files system
    const fileEndpoint = `${baseEndpoint}/files/v3/files/${fileId}`;
    await axios.delete(fileEndpoint, config);
    console.log(`File with ID ${fileId} deleted successfully`);

    // Step 2: Delete the row from HubDB
    const hubDBEndpoint = `${baseEndpoint}/cms/v3/hubdb/ttables/7284336/rows/${rowId}`;
    await axios.delete(hubDBEndpoint, config);
    console.log(`HubDB row with ID ${rowId} deleted successfully`);

    // Step 3: Publish the HubDB table
    const publishEndpoint = `${baseEndpoint}/cms/v3/hubdb/tables/7284336/draft/publish`;
    await axios.post(publishEndpoint, {}, config);
    console.log("HubDB table published successfully");

    // Step 4: Send a success response
    sendResponse({
      body: { status: "success", message: "Resource removed successfully" },
      statusCode: 200
    });

  } catch (error) {
    console.error("Error:", error);
    sendResponse({
      body: { status: "failure", error: error.message },
      statusCode: 500
    });
  }
};
