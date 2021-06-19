/* eslint-disable import/prefer-default-export, consistent-return, no-param-reassign */

const SLASH_REGEX = /^\/|\/$/g;

export function resolvePageName(id, url) {
  const formattedUrl = url && url.split('.html')[0].replace(SLASH_REGEX, '');
  const pageName = formattedUrl && `${id}|${formattedUrl}`;
  return pageName;
}

export function formatDate(datePublished) {
  if (datePublished) {
    const dateObj = new Date(datePublished);
    const month = dateObj.getMonth() + 1;
    const formattedMonth = month < 9 ? `0${month}` : month;
    const date = dateObj.getDate();
    const formattedDate = date < 9 ? `0${date}` : date;
    return `${formattedMonth}/${formattedDate}/${dateObj.getFullYear()}`;
  }
  return 'NA';
}
