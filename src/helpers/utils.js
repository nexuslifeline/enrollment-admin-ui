const BIG_DESKTOP = 1800;
const DESKTOP = 1200;
const TABLET_LANDSCAPE = 900;
const TABLET_PORTRAIT = 600;
const PHONE = 599;
const MEDIUM_PHONE = 380;
const SMALL_PHONE = 320;

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