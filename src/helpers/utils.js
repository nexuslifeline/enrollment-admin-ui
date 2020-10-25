export const getFilePath = (filename) => {
  return `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${filename}`
}

export const getPropValue = (item, key) => {
  const v = item || {};
  return v[key || 'name'];
}