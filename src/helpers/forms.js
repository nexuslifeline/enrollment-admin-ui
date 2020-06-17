export const validate = (form, errors) => {
  if (errors) {
    Object.keys(errors).forEach((key) => {
      form.states[key] = false;
      form.errors[key] = errors[key].length && errors[key][0];
    });
  }
}

export const reset = (form) => {
  Object.keys(form.states).forEach((key) => {
    form.states[key] = null;
    form.errors[key] = null;
  });
}

export const showNotification = (instance, variant, msg) => {
  instance.$bvToast.toast(msg, {
    title: "Notification",
    variant: variant,
    solid: true
  })
}

export const clearFields = (form) => {
  var keyField = form
  for(var key in keyField){
    if (typeof keyField[key] !== "object") {
      if(typeof keyField[key] == "number"){
        keyField[key] = 0
      }
      else{
        keyField[key] = null
      }
    } 
    else {
      var innerFields = keyField[key]
      for (var innerKey in innerFields) {
        innerFields[innerKey] = null
      }
    }
  }
}