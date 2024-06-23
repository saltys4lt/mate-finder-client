export const validatePassword = (password: string) => {
  const passwordRegex = /^[a-zA-Z0-9]+$/;
  if (!passwordRegex.test(password)) {
    return true;
  }

  return false;
};
