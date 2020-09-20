const colors = [
  { bg: '#FFA33A', font: '#FFFFFF', light: '#fff3e6' },
  { bg: '#00cc45', font: '#FFFFFF', light: '#e0ffeb' },
  { bg: '#7908CF', font: '#FFFFFF', light: '#f6ebff' },
  { bg: '#DE193F', font: '#FFFFFF', light: '#ffe8ec' },
  { bg: '#0080FF', font: '#FFFFFF', light: '#e0f0ff' },
  { bg: '#aa4ced', font: '#FFFFFF', light: '#f2e0ff' },
  { bg: '#ed4cca', font: '#FFFFFF', light: '#fce8f8' },
  { bg: '#4cede2', font: '#FFFFFF', light: '#e6fffd' },
  { bg: '#ab0017', font: '#FFFFFF', light: '#ffe6e9' },
  { bg: '#8bcf04', font: '#FFFFFF', light: '#f7ffe8' },
  { bg: '#fc9e0f', font: '#FFFFFF', light: '#fff3e0' },
  { bg: '#b0029f', font: '#FFFFFF', light: '#fce3fa' },
  { bg: '#1402bd', font: '#FFFFFF', light: '#e3e0ff' },
  { bg: '#ecf000', font: '#FFFFFF', light: '#ffffe3' },
  { bg: '#02d467', font: '#FFFFFF', light: '#deffee' },
  { bg: '#00b9c9', font: '#FFFFFF', light: '#defcff' },
  { bg: '#bd23cf', font: '#FFFFFF', light: '#ead3ed' },
  { bg: '#db5704', font: '#FFFFFF', light: '#ffeee3' },
  { bg: '#f2e205', font: '#FFFFFF', light: '#fffeeb' },
  { bg: '#b5d904', font: '#FFFFFF', light: '#fbffe6' },
  { bg: '#a3020a', font: '#FFFFFF', light: '#ffe3e4' },
  { bg: '#99025f', font: '#FFFFFF', light: '#ffe0f3' },
  { bg: '#700391', font: '#FFFFFF', light: '#f7deff' },
  { bg: '#ff0526', font: '#FFFFFF', light: '#ffe0e4' },
  { bg: '#fa8202', font: '#FFFFFF', light: '#fff4e8' }
];

export const colorFactory = (idx) => colors[idx];
export const getColorFactoryLength = () => colors.length
