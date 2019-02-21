/**
 * Used to show notifications
 */

'use strict';

function showMessage(message, error = false) {
  if (!error) {
    $.toast({
      heading: "Success",
      text: message,
      position: "top-right",
      icon: "success",
      hideAfter: 5000,
      stack: 6
    });
  } else {
    $.toast({
      heading: "Error",
      text: message,
      position: "top-right",
      icon: "error",
      hideAfter: 5000,
      stack: 6
    });
  }
}

function showAlert(title, message, buttonText, icon) {
  return new Promise((resolve, reject) => {
    swal({
      title: title,
      text: message,
      icon: icon || "warning",
      buttons: {
        cancel: true,
        confirm: {
          visible: true,
          text: buttonText,
          closeModal: true
        }
      },
      dangerMode: true
    }).then((answer) => {
      if (answer) {
        resolve();
      } else {
        reject();
      }
    });

  });
}