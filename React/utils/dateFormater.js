
const formatDateInput = utcDate => {
  if (utcDate) {
    let date = new Date(Date.parse(utcDate));
    const YYYY = date.getUTCFullYear();
    const MM = date.getUTCMonth() + 1 < 10 ? `0${date.getUTCMonth() + 1}` : date.getUTCMonth() + 1
    const DD = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();
    
    return `${YYYY}-${MM}-${DD}`
  } else {
    return "Invalid Date";
  }
};

export {formatDateInput};
