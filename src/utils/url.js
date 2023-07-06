export const findUrl = (string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = string.match(urlRegex);
  return urls;
};
