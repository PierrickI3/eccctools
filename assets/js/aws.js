const apiKey = "CovgPVCcHJ60ZGtdGCdMqaCC28qKVW0M1MYm2Qhs";

const baseUrl = " https://qi8gcyskj4.execute-api.eu-west-1.amazonaws.com/DEV";
const tokenUrl = baseUrl + "/token";
const actionUrl = baseUrl + "/action";

const aebaseurl = "https://rco60s22e3.execute-api.eu-west-1.amazonaws.com/DEV";
const requestUrl = aebaseurl + "/request";

const stateMachineArn = "arn:aws:states:eu-west-1:715662236651:stateMachine:upsell-startProcess";

const jobsUrl = "https://bulkdownloader.azurewebsites.net/job";

//#region PureCloud Connection

function connectToPureCloud(clientId, clientSecret, environment) {
  console.log(`Connecting to PureCloud... Client Id: ${clientId}, environment: ${environment}`);
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
        })
      })
        .done(data => {
          if (data.hasOwnProperty("errorMessage")) {
            console.error(data);
            reject(JSON.stringify(data.errorMessage));
          } else if (data.hasOwnProperty("token")) {
            pureCloudToken = data.token;
            console.log("Token:", pureCloudToken);
            resolve(pureCloudToken);
          } else {
            console.error("Unknown response:", data);
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(jqXHR);
          console.error(textStatus);
          console.error(errorThrown);
          reject(error);
        });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#endregion

//#region AE Upsell

function submitRequest(orgId, startDate, duration, emailAddress, taskId) {
  console.log("Submitting Request...");
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        async: true,
        crossDomain: true,
        url: requestUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        processData: false,
        data: `{ \"input\": \"{ \\\"purecloud\\\": { \\\"orgId\\\": \\\"${orgId}\\\" }, \\\"name\\\": \\\"${taskId}\\\", \\\"clientId\\\" : \\\"\\\", \\\"clientSecret\\\" : \\\"\\\",\\\"env\\\" : \\\"\\\" , \\\"startDate\\\": \\\"${startDate}\\\", \\\"duration\\\": ${duration} }\", \"name\": \"${taskId}\", \"stateMachineArn\": \"${stateMachineArn}\"}`
      };

      console.log(options);

      $.ajax(options)
        .done(response => {
          console.log(response);
          if (response.hasOwnProperty("errorMessage")) {
            reject(response);
            return;
          }
          resolve(response.token);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(jqXHR);
          console.error(textStatus);
          reject(errorThrown);
        });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function getRequestData(taskId) {
  console.log(`Getting Request (${taskId})...`);
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        async: true,
        crossDomain: true,
        url: `${requestUrl}?name=${taskId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        processData: false
      };

      console.log(options);

      $.ajax(options)
        .done(response => {
          console.log("Request Data:", response);
          if (response) {
            resolve(response);
          } else {
            reject(response);
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(jqXHR);
          console.error(textStatus);
          reject(errorThrown);
        });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#endregion

//#region PureClean

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
      })
        .done(data => {
          if (data.hasOwnProperty("errorMessage")) {
            console.error(data);
            reject(JSON.stringify(data.errorMessage));
          } else if (data) {
            resolve(data.items);
          } else {
            console.error("Unknown response:", data);
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
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
      })
        .done(data => {
          if (data.hasOwnProperty("errorMessage")) {
            console.error(data);
            reject(JSON.stringify(data.errorMessage));
          }

          console.log("data:", data);
          $.each(data, (i, dataItem) => {
            if (dataItem.statusCode == 400) {
              showMessage("An error occurred while deleting " + dataItem.id, true);
            }
          });

          if (data) {
            resolve(data);
          } else {
            console.error("Unknown response:", data);
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(jqXHR);
          console.error(textStatus);
          console.error(errorThrown);
          showMessage();
          reject(errorThrown);
        });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

//#endregion

//#region Recordings

async function createJob(name, environment, clientId, clientSecret, intervalFrom, intervalTo, email, queueNames, sasToken) {
  return await $.ajax({
    url: jobsUrl,
    method: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
    },
    data: JSON.stringify({
      name: name,
      env: environment,
      clientId: clientId,
      clientSecret: clientSecret,
      intervalFrom: intervalFrom,
      intervalTo: intervalTo,
      mail: email,
      queueNames: queueNames,
      sasTokenInMinutes: sasToken
    })
  })
    .done(data => {
      return data;
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.error(jqXHR);
      console.error(textStatus);
      console.error(errorThrown);
      return new Error(errorThrown);
    });
}

async function getJob(jobId) {
  return await $.ajax({
    url: `${jobsUrl}?jobId=${jobId}`,
    method: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
  })
    .done(data => {
      return data;
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.error(jqXHR);
      console.error(textStatus);
      console.error(errorThrown);
      return new Error(errorThrown);
    });
}

//#endregion
