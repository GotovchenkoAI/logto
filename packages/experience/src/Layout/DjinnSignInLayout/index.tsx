import type { TFuncKey } from 'i18next';
import type { ReactNode } from 'react';

import FirstScreenLayout from '@/Layout/FirstScreenLayout';

import styles from './index.module.scss';

type Props = {
  readonly children: ReactNode;
  /** Ключ фразы для <title> вкладки. На экране заголовок свой, не из фраз Logto. */
  readonly pageTitle: TFuncKey;
  readonly heading: string;
  readonly subheading: string;
  /**
   * Правовая сноска под формой. Своя, а не `TermsAndPrivacyLinks`: тот молчит,
   * пока условия не заведены в консоли Logto, а обязательство перед человеком
   * от настроек админки зависеть не может.
   */
  readonly legal?: string;
};

/**
 * Шапка первого экрана по кадрам «Экран · Вход» и «Экран · Код (OTP)».
 *
 * Не переиспользует `LandingPageLayout`: тот рисует логотип из настроек
 * sign-in experience и заголовок из фраз Logto, а нам нужна своя марка и свой
 * текст. Логотип намеренно не берётся из админки — марка продукта не должна
 * зависеть от того, загрузил ли кто-то картинку в консоль.
 */
const DjinnSignInLayout = ({ children, pageTitle, heading, subheading, legal }: Props) => (
  <FirstScreenLayout pageMeta={{ titleKey: pageTitle }}>
    <header className={styles.header}>
      <div className={styles.logo}>
        <svg
          aria-hidden="true"
          className={styles.mark}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient gradientTransform="rotate(118)" id="djinn-mark">
              <stop offset="0%" stopColor="#7B61FF" />
              <stop offset="100%" stopColor="#FF6B5B" />
            </linearGradient>
          </defs>
          <path
            d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8Z"
            fill="none"
            stroke="url(#djinn-mark)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span className={styles.wordmark}>ИИ Готовченко</span>
      </div>

      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.subheading}>{subheading}</p>
    </header>
    {children}
    {legal && <p className={styles.legal}>{legal}</p>}
  </FirstScreenLayout>
);

export default DjinnSignInLayout;
