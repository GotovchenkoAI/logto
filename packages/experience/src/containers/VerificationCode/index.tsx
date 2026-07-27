import { type VerificationCodeIdentifier } from '@logto/schemas';
import classNames from 'classnames';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import DjinnSubmitButton from '@/components/DjinnSubmitButton';
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

  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <DjinnSubmitButton
        className={styles.continueButton}
        htmlType="button"
        isLoading={isSubmitting}
        onClick={() => {
          if (!isCodeInputReady) {
            setInputErrorMessage(t('error.invalid_passcode'));
            return;
          }

          void handleSubmit(codeInput);
        }}
      >
        Подтвердить и войти
      </DjinnSubmitButton>
      {/*
        Строка повтора стоит ПОД кнопкой, как в кадре: пока код не введён,
        главное действие — ввести его, а не переотправить. Отсчёт показываем как
        м:сс — «через 43 секунд» не согласовано по падежу, а склонять число в
        трёх формах ради подписи к таймеру незачем.
      */}
      <div className={styles.message}>
        <span className={styles.messageLead}>Не пришёл код?</span>{' '}
        {isRunning ? (
          <span className={styles.messageTimer}>
            Отправить снова через {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
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
      </div>
      <button
        className={styles.backToSignIn}
        type="button"
        onClick={() => {
          navigate(-1);
        }}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="15"
          viewBox="0 0 15 15"
          width="15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 7.5H3M7 3.5l-4 4 4 4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        Вернуться к входу
      </button>
    </form>
  );
};

export default VerificationCode;
