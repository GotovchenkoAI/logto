import { AgreeToTermsPolicy, type SignIn, SignInIdentifier } from '@logto/schemas';
import classNames from 'classnames';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import UserInteractionContext from '@/Providers/UserInteractionContextProvider/UserInteractionContext';
import WebAuthnContext from '@/Providers/WebAuthnContextProvider/WebAuthnContext';
import LockIcon from '@/assets/icons/lock.svg?react';
import DjinnSubmitButton from '@/components/DjinnSubmitButton';
import { SmartInputField } from '@/components/InputFields';
import CaptchaBox from '@/containers/CaptchaBox';
import TermsAndPrivacyCheckbox from '@/containers/TermsAndPrivacyCheckbox';
import usePrefilledIdentifier from '@/hooks/use-prefilled-identifier';
import useSingleSignOnWatch from '@/hooks/use-single-sign-on-watch';
import useTerms from '@/hooks/use-terms';
import Button from '@/shared/components/Button';
import ErrorMessage from '@/shared/components/ErrorMessage';
import type { IdentifierInputValue } from '@/shared/components/InputFields/SmartInputField';
import { getGeneralIdentifierErrorMessage, validateIdentifierField } from '@/utils/form';

import styles from './index.module.scss';
import useOnSubmit from './use-on-submit';

type Props = {
  readonly className?: string;
  // eslint-disable-next-line react/boolean-prop-naming
  readonly autoFocus?: boolean;
  readonly signInMethods: SignIn['methods'];
};

type FormState = {
  identifier: IdentifierInputValue;
};

const IdentifierSignInForm = ({ className, autoFocus, signInMethods }: Props) => {
  const { t } = useTranslation();
  const { errorMessage, clearErrorMessage, onSubmit } = useOnSubmit(signInMethods);
  const { termsValidation, agreeToTermsPolicy } = useTerms();
  const { setIdentifierInputValue } = useContext(UserInteractionContext);
  const { isPasskeyFlowProcessing } = useContext(WebAuthnContext);

  const enabledSignInMethods = useMemo(
    () => signInMethods.map(({ identifier }) => identifier),
    [signInMethods]
  );
  const isUnifiedEmailCodeFlow =
    signInMethods.length === 1 &&
    signInMethods[0]?.identifier === SignInIdentifier.Email &&
    signInMethods[0].verificationCode &&
    !signInMethods[0].password;

  const prefilledIdentifier = usePrefilledIdentifier({
    enabledIdentifiers: enabledSignInMethods,
  });

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormState>({
    reValidateMode: 'onBlur',
    defaultValues: {
      identifier: prefilledIdentifier,
    },
  });

  // Watch identifier field and check single sign on method availability
  const { showSingleSignOnForm, navigateToSingleSignOn } = useSingleSignOnWatch(
    watch('identifier')
  );

  useEffect(() => {
    if (!isValid) {
      clearErrorMessage();
    }
  }, [clearErrorMessage, isValid]);

  const onSubmitHandler = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      if (isPasskeyFlowProcessing) {
        return;
      }

      clearErrorMessage();

      void handleSubmit(async ({ identifier: { type, value } }) => {
        if (!type) {
          return;
        }

        setIdentifierInputValue({ type, value });

        if (showSingleSignOnForm) {
          await navigateToSingleSignOn();
          return;
        }

        // Check if the user has agreed to the terms and privacy policy before signing in when the policy is set to `Manual`
        if (agreeToTermsPolicy === AgreeToTermsPolicy.Manual && !(await termsValidation())) {
          return;
        }

        await onSubmit(type, value);
      })(event);
    },
    [
      agreeToTermsPolicy,
      clearErrorMessage,
      handleSubmit,
      navigateToSingleSignOn,
      onSubmit,
      setIdentifierInputValue,
      showSingleSignOnForm,
      termsValidation,
      isPasskeyFlowProcessing,
    ]
  );

  return (
    <form className={classNames(styles.form, className)} onSubmit={onSubmitHandler}>
      {isUnifiedEmailCodeFlow && <div className={styles.djinnLabel}>Email</div>}

      <Controller
        control={control}
        name="identifier"
        rules={{
          validate: ({ type, value }) => {
            if (!type || !value) {
              return getGeneralIdentifierErrorMessage(enabledSignInMethods, 'required');
            }

            const errorMessage = validateIdentifierField(type, value);

            return errorMessage
              ? getGeneralIdentifierErrorMessage(enabledSignInMethods, 'invalid')
              : true;
          },
        }}
        render={({ field, formState: { defaultValues } }) =>
          /*
           * При потоке «только email» ставим обычное поле вместо SmartInputField.
           * Тот рисует notched border с плавающим label — другая система, чем в
           * кадре, и снаружи она не переопределяется. Умное определение типа
           * здесь всё равно не работает: тип ровно один.
           */
          isUnifiedEmailCodeFlow ? (
            <input
              autoComplete="email"
              autoFocus={autoFocus}
              className={styles.djinnInput}
              name={field.name}
              placeholder="you@example.com"
              type="email"
              value={field.value.value}
              onBlur={field.onBlur}
              onChange={({ target: { value } }) => {
                field.onChange({ type: SignInIdentifier.Email, value });
              }}
            />
          ) : (
            <SmartInputField
              autoFocus={autoFocus}
              className={styles.inputField}
              {...field}
              isDanger={!!errors.identifier || !!errorMessage}
              errorMessage={errors.identifier?.message}
              enabledTypes={enabledSignInMethods}
              defaultValue={defaultValues?.identifier?.value}
            />
          )
        }
      />

      {isUnifiedEmailCodeFlow && !errorMessage && (
        <div className={styles.djinnHint}>
          Введите email — пришлём код. Если вы здесь впервые, аккаунт создастся автоматически.
        </div>
      )}

      {errorMessage && <ErrorMessage className={styles.formErrors}>{errorMessage}</ErrorMessage>}

      {showSingleSignOnForm && (
        <div className={styles.message}>{t('description.single_sign_on_enabled')}</div>
      )}

      {/**
       * Have to use css to hide the terms element.
       * Remove element from dom will trigger a form re-render.
       * Form rerender will trigger autofill.
       * If the autofill value is SSO enabled, it will always show SSO form.
       */}
      <TermsAndPrivacyCheckbox
        className={classNames(
          styles.terms,
          // For sign in, only show the terms checkbox if the terms policy is manual
          agreeToTermsPolicy !== AgreeToTermsPolicy.Manual && styles.hidden
        )}
      />

      <CaptchaBox />
      {isUnifiedEmailCodeFlow && !showSingleSignOnForm ? (
        <DjinnSubmitButton isLoading={isSubmitting || isPasskeyFlowProcessing}>
          Получить код
        </DjinnSubmitButton>
      ) : (
        <Button
          name="submit"
          title={showSingleSignOnForm ? 'action.single_sign_on' : 'action.sign_in'}
          icon={showSingleSignOnForm ? <LockIcon /> : undefined}
          htmlType="submit"
          isLoading={isSubmitting || isPasskeyFlowProcessing}
        />
      )}

      <input hidden type="submit" />
    </form>
  );
};

export default IdentifierSignInForm;
