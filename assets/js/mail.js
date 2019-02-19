
function sendEmail(emailAddress, subject, message) {
  console.log("Sending email...");
  return new Promise((resolve, reject) => {
    try {
      let options = {
        "async": true,
        "crossDomain": true,
        "url": "https://ecccsendmail.herokuapp.com/mail",
        "method": "POST",
        "data": {
          "emailAddress": emailAddress,
          "subject": subject,
          "message": message
        }
      }

      $.ajax(options).done((response) => {
        console.log(response);
        resolve(response);
      }).fail((jqXHR, textStatus, errorThrown) => {
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