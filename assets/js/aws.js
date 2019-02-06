const tokenUrl = "https://rco60s22e3.execute-api.eu-west-1.amazonaws.com/DEV/token";
const apiKey = "CovgPVCcHJ60ZGtdGCdMqaCC28qKVW0M1MYm2Qhs";

var token = undefined;

function connectToPureCloud(clientId, clientSecret, environment) {
  console.log(`Connecting to PureCloud... Client Id: ${clientId}, Client Secret: ${clientSecret}, environment: ${environment}`);
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
          token = data.token;
          resolve(data.token);
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

function getUsers() {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: tokenUrl + "?token=" + token,
        method: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("x-api-key", apiKey);
        }
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
        reject(error);
      })
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}