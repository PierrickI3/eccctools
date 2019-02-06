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
