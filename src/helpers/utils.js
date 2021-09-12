import format from "date-fns/esm/format";

const BIG_DESKTOP = 1800;
const DESKTOP = 1200;
const TABLET_LANDSCAPE = 900;
const TABLET_PORTRAIT = 600;
const PHONE = 599;
const MEDIUM_PHONE = 380;
// const SMALL_PHONE = 320;

export const getFilePath = (filename) => {
  return `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${filename}`
}

export const getPropValue = (item, key) => {
  const v = item || {};
  return v[key || 'name'];
}

export const createLimiter = (values) => {
  const w = window.innerWidth;
  if (w >= BIG_DESKTOP) return values[0];
  if (w >= DESKTOP + 200) return values[1];
  if (w >= DESKTOP) return values[2];
  if (w >= TABLET_LANDSCAPE + 150) return values[3];
  if (w >= TABLET_PORTRAIT + 150) return values[4];
  if (w >= PHONE) return values[5];
  if (w >= MEDIUM_PHONE) return values[6];
  return values[7];
}

export const formatAddress = (address) => {

  if(!address) return '' //return null

  const currentAddress = [
    address?.currentHouseNoStreet,
    address?.currentDistrict,
    (`${address?.currentCityTown} ${address?.currentPostalCode}`)?.trim(),
    address?.currentProvince,
    address?.currentRegion,
  ].filter(v => !!v).join(', ') || address?.currentCompleteAddress;

  const permaAddress = [
    address?.permanentHouseNoStreet,
    address?.permanentDistrict,
    (`${address?.permanentCityTown} ${address?.permanentPostalCode}`)?.trim(),
    address?.permanentProvince,
    address?.permanentRegion,
  ].filter(v => !!v).join(', ') || address?.permanentCompleteAddress;

  return currentAddress || permaAddress;
}

export const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const convertToMonth = (idx) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[parseInt(idx) - 1];
}

export const download = (blobData, contentType, name = 'File') => {
  const fileUrl = window.URL.createObjectURL(
    new Blob([blobData], {
      type: contentType,
    })
  );
  //const reader = new FileReader();
  //reader.onload = (e) => (this.file.src = e.target.result);
  const fileLink = document.createElement('a');

  fileLink.href = fileUrl;
  fileLink.setAttribute('download', name);
  document.body.appendChild(fileLink);

  fileLink.click();
  fileLink.remove();
}

export const preview = (blobData, contentType, completion) => {
  const fileUrl = window.URL.createObjectURL(
    new Blob([blobData], {
      type: contentType,
    })
  );
  completion?.(fileUrl);
  // const reader = new FileReader();
  // reader.onload = (e) => completion?.(e.target.result);
  // reader.readAsDataURL(file);
}


export const toReadableDate = (d) => format(new Date(d), 'MMM dd, yyyy');