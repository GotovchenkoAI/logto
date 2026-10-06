import { SignInIdentifier, SignInMode } from '@logto/schemas';
import { Route, Routes } from 'react-router-dom';

import renderWithPageContext from '@/__mocks__/RenderWithPageContext';
import SettingsProvider from '@/__mocks__/RenderWithPageContext/SettingsProvider';
import {
  mockSignInExperienceSettings,
  mockSignInMethodSettingsTestCases,
  mockSsoConnectors,
} from '@/__mocks__/logto';
import SignIn from '@/pages/SignIn';

jest.mock('i18next', () => ({
  ...jest.requireActual('i18next'),
  language: 'en',
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('<SignIn />', () => {
  const renderSignIn = (settings?: Partial<typeof mockSignInExperienceSettings>) =>
    renderWithPageContext(
      <SettingsProvider settings={{ ...mockSignInExperienceSettings, ...settings }}>
        <SignIn />
      </SettingsProvider>
    );

  describe('renders with password only SignIn method settings', () => {
    test.each([
      [SignInIdentifier.Username],
      [SignInIdentifier.Email],
      [SignInIdentifier.Phone],
      [SignInIdentifier.Username, SignInIdentifier.Email],
      [SignInIdentifier.Username, SignInIdentifier.Phone],
      [SignInIdentifier.Email, SignInIdentifier.Phone],
      [SignInIdentifier.Username, SignInIdentifier.Email, SignInIdentifier.Phone],
    ])('renders with %p password only mode', async (...methods) => {
      const { queryByText, queryAllByText, container } = renderSignIn({
        signIn: {
          methods: methods.map((method) => ({
            identifier: method,
            password: true,
            verificationCode: false,
            isPasswordPrimary: true,
          })),
        },
      });

      expect(container.querySelector('input[name="identifier"]')).not.toBeNull();
      expect(queryAllByText('description.terms_of_use')).not.toBeNull();
      expect(queryAllByText('description.privacy_policy')).not.toBeNull();

      expect(queryByText('action.sign_in')).not.toBeNull();

      // Social
      expect(queryAllByText('action.sign_in_with')).toHaveLength(
        mockSignInExperienceSettings.socialConnectors.length
      );
    });
  });

  describe('renders with identifier code only SignIn method settings', () => {
    test.each(mockSignInMethodSettingsTestCases)(
      'renders with [%p %p %p] SignIn Methods only mode',
      async (...methods) => {
        const { container, queryAllByAltText } = renderSignIn({
          signIn: {
            methods,
          },
        });

        expect(container.querySelector('input[name="identifier"]')).not.toBeNull();
        expect(container.querySelector('input[name="password"]')).toBeNull();
        expect(queryAllByAltText('description.terms_of_use')).not.toBeNull();
        expect(queryAllByAltText('description.privacy_policy')).not.toBeNull();
      }
    );
  });

  test('renders with social as primary', async () => {
    const { container, queryByText } = renderWithPageContext(
      <SettingsProvider settings={{ ...mockSignInExperienceSettings, signIn: { methods: [] } }}>
        <SignIn />
      </SettingsProvider>
    );

    expect(container.querySelectorAll('button')).toHaveLength(
      mockSignInExperienceSettings.socialConnectors.length
    );

    expect(queryByText('Условия')).not.toBeNull();
    expect(queryByText('Конфиденциальность')).not.toBeNull();
  });

  /*
   * Ссылки нижней строки берутся из настроек sign-in experience: у каждого стенда свой адрес
   * кабинета. Открываются в новой вкладке — уход со страницы сбросил бы начатый вход.
   */
  test('ссылки на условия и политику ведут по адресам из настроек', () => {
    const { getByRole } = renderSignIn({
      termsOfUseUrl: 'https://cabinet.example/terms',
      privacyPolicyUrl: 'https://cabinet.example/privacy',
    });

    for (const [name, href] of [
      ['Условия', 'https://cabinet.example/terms'],
      ['Конфиденциальность', 'https://cabinet.example/privacy'],
    ] as const) {
      const link = getByRole('link', { name });
      expect(link.getAttribute('href')).toBe(href);
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  test('без адресов в настройках ссылок нет', () => {
    const { queryByRole } = renderSignIn({ termsOfUseUrl: null, privacyPolicyUrl: null });

    expect(queryByRole('link', { name: 'Условия' })).toBeNull();
    expect(queryByRole('link', { name: 'Конфиденциальность' })).toBeNull();
  });

  test('does not expose a separate create-account entry in the unified email flow', () => {
    const { queryByText } = renderSignIn();

    expect(queryByText('action.create_account')).toBeNull();
  });

  test('render with register only mode should redirect to the Register page', () => {
    const { queryByText } = renderWithPageContext(
      <SettingsProvider
        settings={{ ...mockSignInExperienceSettings, signInMode: SignInMode.Register }}
      >
        <Routes>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="register" element={<div>Register</div>} />
        </Routes>
      </SettingsProvider>,
      {
        initialEntries: ['/sign-in'],
      }
    );

    expect(queryByText('Register')).not.toBeNull();
  });

  test('render single sign on link', () => {
    const { queryByText } = renderSignIn({
      ssoConnectors: mockSsoConnectors,
      singleSignOnEnabled: true,
    });

    expect(queryByText('action.single_sign_on')).not.toBeNull();
  });

  test('should  render single sign on link with single sign on enabled but empty list', () => {
    const { queryByText } = renderSignIn({
      ssoConnectors: [],
      singleSignOnEnabled: true,
    });

    expect(queryByText('action.single_sign_on')).not.toBeNull();
  });

  test('should not render single sign on link with single sign on disabled', () => {
    const { queryByText } = renderSignIn({
      ssoConnectors: mockSsoConnectors,
      singleSignOnEnabled: false,
    });

    expect(queryByText('action.single_sign_on')).toBeNull();
  });
});
