export const validateNickname = (nickname: string) => {
  // Ник должен содержать минимум 3 символа

  // Ник должен содержать только английские буквы и цифры
  const nicknameRegex = /^[a-zA-Z0-9]+$/;
  if (!nicknameRegex.test(nickname)) {
    return true;
  }

  // Если все условия прошли успешно, возвращаем null (без ошибок)
  return false;
};
