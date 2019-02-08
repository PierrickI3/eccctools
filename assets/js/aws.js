const baseUrl = " https://qi8gcyskj4.execute-api.eu-west-1.amazonaws.com/DEV";
const tokenUrl = baseUrl + "/token";
const actionUrl = baseUrl + "/action";

const apiKey = "CovgPVCcHJ60ZGtdGCdMqaCC28qKVW0M1MYm2Qhs";

var pureCloudToken = undefined;
var pureCloudEnvironment = undefined;

function connectToPureCloud(clientId, clientSecret, environment) {
  console.log(`Connecting to PureCloud... Client Id: ${clientId}, Client Secret: ${clientSecret}, environment: ${environment}`);
  pureCloudEnvironment = environment;
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: tokenUrl,
        method: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        },
        data: JSON.stringify({
          clientId: clientId,
          clientSecret: clientSecret,
          env: environment
        }),
      }).done((data) => {
        if (data.hasOwnProperty("errorMessage")) {
          console.error(data);
          reject(JSON.stringify(data.errorMessage));
        } else if (data.hasOwnProperty("token")) {
          pureCloudToken = data.token;
          console.log("Token:", pureCloudToken)
          resolve(pureCloudToken);
        } else {
          console.error("Unknown response:", data);
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        console.error(errorThrown);
        reject(error);
      })
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#region Itens (users, queues, flows, etc.)

function getItems(type) {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: actionUrl,
        method: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        },
        data: JSON.stringify({
          env: pureCloudEnvironment,
          token: pureCloudToken,
          objectType: type,
          actionType: "GET"
        })
      }).done((data) => {
        if (data.hasOwnProperty("errorMessage")) {
          console.error(data);
          reject(JSON.stringify(data.errorMessage));
        } else if (data) {
          resolve(data.items);
        } else {
          console.error("Unknown response:", data);
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        console.error(errorThrown);
        reject(errorThrown);
      })
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function deleteItems(type, items) {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: actionUrl,
        method: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        },
        data: JSON.stringify({
          env: pureCloudEnvironment,
          token: pureCloudToken,
          objectType: type,
          actionType: "DELETE",
          items: items
        })
      }).done((data) => {
        if (data.hasOwnProperty("errorMessage")) {
          console.error(data);
          reject(JSON.stringify(data.errorMessage));
        } else if (data) {
          resolve(data);
        } else {
          console.error("Unknown response:", data);
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.error(jqXHR);
        console.error(textStatus);
        console.error(errorThrown);
        reject(errorThrown);
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#endregion