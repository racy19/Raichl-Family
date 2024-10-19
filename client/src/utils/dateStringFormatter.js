// Format date with numeric or string expression
// @param {string} dateString input date in string format
// @param {bool} isNumericFormat if true - return month in word, if false - return month numerically
 
export const dateStringFormatter = (dateString, isNumericFormat = true) => {
    const date = new Date(dateString);
    const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  
    if (isNumericFormat) {
      return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(". ");
    }

    return date.toLocaleDateString("cs-CZ", dateOptions);
  };
  
export const getDateYear = (date) => { 
  return date.slice(0,4) 
}
export const getDateFull = (date) => { 
  return date.slice(0,10) 
}