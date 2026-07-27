import { useState, useMemo } from 'react';

import type { ErrorHandlers } from '@/hooks/use-error-handler';

/**
 * @param errorCallback Стирает введённый код и возвращает курсор в первую клетку.
 *
 * Не подсказка, а необходимость: какая цифра не та — человеку неизвестно, а чаще
 * всего не одна. Код берут из письма целиком, и неверный обычно означает письмо
 * не то: из прошлой попытки или с другого адреса. Оставленные цифры пришлось бы
 * выделять и стирать вручную перед каждой второй попыткой.
 *
 * Сообщение об ошибке при этом остаётся на экране — оно объясняет, почему поле
 * опустело.
 */
const useGeneralVerificationCodeErrorHandler = (errorCallback?: () => void) => {
  const [errorMessage, setErrorMessage] = useState<string>();

  // Have to wrap up in a useMemo hook otherwise the handler updates on every cycle
  const generalVerificationCodeErrorHandlers: ErrorHandlers = useMemo(
    () => ({
      'verification_code.expired': (error) => {
        setErrorMessage(error.message);
        errorCallback?.();
      },
      'verification_code.code_mismatch': (error) => {
        setErrorMessage(error.message);
        errorCallback?.();
      },
    }),
    [errorCallback]
  );

  return {
    errorMessage,
    generalVerificationCodeErrorHandlers,
    clearErrorMessage: () => {
      setErrorMessage('');
    },
  };
};

export default useGeneralVerificationCodeErrorHandler;
