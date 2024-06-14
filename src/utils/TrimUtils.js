export const trimObjectValues = (obj) => {
  const trimmedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      trimmedObj[key] = obj[key].replace(/\s+/g, " ").trim();
    }
  }
  return trimmedObj;
};
