export const ACCESS_TOKEN_SECRET = (() => {
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error('ACCESS_TOKEN_SECRET missing');
  return process.env.ACCESS_TOKEN_SECRET;
})();

export const REFRESH_TOKEN_SECRET = (() => {
  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error('REFRESH_TOKEN_SECRET missing');
  return process.env.REFRESH_TOKEN_SECRET;
})();
