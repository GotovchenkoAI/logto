import { SignInIdentifier, type VerificationCodeIdentifier } from '@logto/schemas';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { validate } from 'superstruct';

import DjinnSignInLayout from '@/Layout/DjinnSignInLayout';
import UserInteractionContext from '@/Providers/UserInteractionContextProvider/UserInteractionContext';
import VerificationCodeContainer from '@/containers/VerificationCode';
import { useSieMethods } from '@/hooks/use-sie';
import ErrorPage from '@/pages/ErrorPage';
import DjinnIdentifierChip from '@/pages/VerificationCode/DjinnIdentifierChip';
import { type IdentifierInputValue } from '@/shared/components/InputFields/SmartInputField';
import { UserFlow } from '@/types';
import { userFlowGuard } from '@/types/guard';
import { formatPhoneNumberWithCountryCallingCode } from '@/utils/country-code';
import { codeVerificationTypeMap } from '@/utils/sign-in-experience';

type Parameters = {
  flow: string;
};

const isValidVerificationCodeIdentifier = (
  identifierInputValue: IdentifierInputValue | undefined
): identifierInputValue is VerificationCodeIdentifier =>
  Boolean(
    identifierInputValue?.type &&
      identifierInputValue.type !== SignInIdentifier.Username &&
      identifierInputValue.value
  );

const VerificationCode = () => {
  const { flow } = useParams<Parameters>();
  const { signInMethods } = useSieMethods();

  const { identifierInputValue, forgotPasswordIdentifierInputValue, verificationIdsMap } =
    useContext(UserInteractionContext);

  const [, userFlow] = validate(flow, userFlowGuard);

  if (!userFlow) {
    return <ErrorPage />;
  }

  const cachedIdentifierInputValue =
    flow === UserFlow.ForgotPassword ? forgotPasswordIdentifierInputValue : identifierInputValue;

  if (!isValidVerificationCodeIdentifier(cachedIdentifierInputValue)) {
    return <ErrorPage title="error.invalid_session" />;
  }

  const { type, value } = cachedIdentifierInputValue;

  const methodSettings = signInMethods.find((method) => method.identifier === type);
  const hasPasswordButton = userFlow === UserFlow.SignIn && methodSettings?.password;

  // VerificationId not found
  const verificationId = verificationIdsMap[codeVerificationTypeMap[type]];
  if (!verificationId) {
    return <ErrorPage title="error.invalid_session" rawMessage="Verification ID not found" />;
  }

  return (
    <DjinnSignInLayout
      heading="Введите код"
      pageTitle={`description.verify_${type}`}
      subheading={
        type === SignInIdentifier.Email
          ? 'Отправили 6-значный код на почту. Он действует 10 минут.'
          : 'Отправили 6-значный код в SMS. Он действует 10 минут.'
      }
    >
      <DjinnIdentifierChip
        value={
          type === SignInIdentifier.Phone ? formatPhoneNumberWithCountryCallingCode(value) : value
        }
      />
      <VerificationCodeContainer
        flow={userFlow}
        identifier={cachedIdentifierInputValue}
        verificationId={verificationId}
        hasPasswordButton={hasPasswordButton}
      />
    </DjinnSignInLayout>
  );
};

export default VerificationCode;
