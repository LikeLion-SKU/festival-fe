export const getLangFontClass = (lang) => {
  if (lang === 'EN') return 'font-inter';
  if (lang === 'ZH') return 'font-noto-sc';
  return '';
};
