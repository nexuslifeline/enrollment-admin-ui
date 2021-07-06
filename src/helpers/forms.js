export const validate = (form, errors, parentIntance) => {
  if (errors) {
    Object.keys(errors).forEach((key) => {
      form.states[key] = false;
      form.errors[key] = errors[key].length && errors[key][0];
    });
    if (parentIntance && errors?.nonFieldError) {
      showNotification(parentIntance, 'danger', errors?.nonFieldError, 'Something went wrong!');
    }
  }
}

export const reset = (form) => {
  Object.keys(form.states).forEach((key) => {
    form.states[key] = null;
    form.errors[key] = null;
  });
}

export const showNotification = (instance, variant, msg, title = 'Notification', autoHideDelay = 5000) => {
  instance.$bvToast.toast(msg, {
    title,
    variant: variant,
    solid: true,
    autoHideDelay: autoHideDelay,
  })
}

export const clearFields = (form) => {
  let keyField = form
  for(let key in keyField){
    if (typeof keyField[key] !== "object") {
      if(typeof keyField[key] == "number"){
        keyField[key] = 0
      }
      else{
        keyField[key] = null
      }
    } 
    else {
      let innerFields = keyField[key]
      for (let innerKey in innerFields) {
        innerFields[innerKey] = null
      }
    }
  }
}

// format number with comma and decimal place
export const formatNumber = (value, decimal = 2) => {
  let val = (value / 1).toFixed(decimal)
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatAccountingNumber = (value, decimal = 2) => {
  if (Math.sign(value) < 0) {
    return `(${formatNumber(Math.abs(value), decimal)})`;
  }

  return formatNumber(value, decimal);
}