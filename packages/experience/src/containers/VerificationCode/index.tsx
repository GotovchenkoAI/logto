import { type VerificationCodeIdentifier } from '@logto/schemas';
import classNames from 'classnames';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import SwitchToVerificationMethodsLink from '@/components/SwitchToVerificationMethodsLink';
import VerificationCodeInput, { defaultLength } from '@/shared/components/VerificationCode';
import { UserFlow } from '@/types';

import styles from './index.module.scss';
import useResendVerificationCode from './use-resend-verification-code';
import { getCodeVerificationHookByFlow } from './utils';

type Props = {
  readonly flow: UserFlow;
  readonly identifier: VerificationCodeIdentifier;
  readonly verificationId: string;
  readonly hasPasswordButton?: boolean;
  readonly className?: string;
};

const VerificationCode = ({
  flow,
  identifier,
  verificationId,
  className,
  hasPasswordButton,
}: Props) => {
  const [codeInput, setCodeInput] = useState<string[]>([]);
  const [inputErrorMessage, setInputErrorMessage] = useState<string>();

  const isCodeInputReady = useMemo(
    () => codeInput.length === defaultLength && codeInput.every(Boolean),
    [codeInput]
  );

  const useVerificationCode = getCodeVerificationHookByFlow(flow);

  const errorCallback = useCallback(() => {
    setCodeInput([]);
    setInputErrorMessage(undefined);
  }, []);

  const {
    errorMessage: submitErrorMessage,
    clearErrorMessage,
    onSubmit,
  } = useVerificationCode(identifier, verificationId, errorCallback);

  const errorMessage = inputErrorMessage ?? submitErrorMessage;

  const { seconds, isRunning, onResendVerificationCode } = useResendVerificationCode(
    flow,
    identifier
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (code: string[]) => {
      if (isSubmitting) {
        return;
      }

      setInputErrorMessage(undefined);
      setIsSubmitting(true);

      try {
        await onSubmit(code.join(''));
      } finally {
        // Always reset, even if `onSubmit` throws, so the button does not spin forever.
        setIsSubmitting(false);
      }
    },
    [isSubmitting, onSubmit]
  );

  /**
   * Auto-submit once the code is fully entered. `handleSubmit` is intentionally accessed through
   * a ref so this effect does not depend on its identity: the submission callback chain is rebuilt
   * mid-flow (e.g. agreeing to the terms when a sign-in turns into a registration updates
   * `termsAgreement`), and depending on it would re-run this effect and resubmit the same — already
   * consumed — code, surfacing a spurious `verification_code.not_found` error.
   */
  const handleSubmitRef = useRef(handleSubmit);
  // eslint-disable-next-line @silverhand/fp/no-mutation
  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    if (isCodeInputReady) {
      void handleSubmitRef.current(codeInput);
    }
  }, [codeInput, isCodeInputReady]);

  return (
    <form className={classNames(styles.form, className)}>
      <VerificationCodeInput
        name="passcode"
        className={classNames(styles.inputField, errorMessage && styles.withError)}
        value={codeInput}
        error={errorMessage}
        onChange={setCodeInput}
      />
      {flow === UserFlow.SignIn && (
        <SwitchToVerificationMethodsLink
          hasPassword={hasPasswordButton}
          identifier={identifier.type}
          value={identifier.value}
          className={styles.switch}
        />
      )}
      {/*
        Кнопки отправки нет: код уходит сам, как только введена шестая цифра, а пока идёт
        проверка, строка повтора говорит об этом. Отсчёт показываем как м:сс — «через 43
        секунд» не согласовано по падежу, а склонять число ради подписи к таймеру незачем.
      */}
      <div className={styles.message}>
        {isSubmitting ? (
          <span className={styles.messageLead}>Проверяю код…</span>
        ) : (
          <>
            <span className={styles.messageLead}>Не пришёл код?</span>{' '}
            {isRunning ? (
              <span className={styles.messageTimer}>
                Отправить снова через {Math.floor(seconds / 60)}:
                {String(seconds % 60).padStart(2, '0')}
              </span>
            ) : (
              <button
                className={styles.resend}
                type="button"
                onClick={async () => {
                  clearErrorMessage();
                  await onResendVerificationCode();
                  setCodeInput([]);
                }}
              >
                Отправить снова
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
};

export default VerificationCode;
