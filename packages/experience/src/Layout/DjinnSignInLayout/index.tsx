import type { TFuncKey } from 'i18next';
import type { ReactNode } from 'react';

import FirstScreenLayout from '@/Layout/FirstScreenLayout';
import useTerms from '@/hooks/use-terms';

import styles from './index.module.scss';

type Props = {
  readonly children: ReactNode;
  /** Ключ фразы для <title> вкладки. На экране заголовок свой, не из фраз Logto. */
  readonly pageTitle: TFuncKey;
  readonly heading: string;
  /** Строки под заголовком. Узел, а не строка: на шаге кода в нём адрес и «Изменить». */
  readonly subheading: ReactNode;
};

/**
 * Левая колонка экрана входа: знак кабинета вверху, заголовок и форма, одна тихая строка внизу.
 *
 * Не переиспользует `LandingPageLayout`: тот рисует логотип из настроек sign-in experience и
 * заголовок из фраз Logto, а нам нужна марка продукта и свой текст. Марка намеренно не берётся
 * из админки — она не должна зависеть от того, загрузил ли кто-то картинку в консоль.
 *
 * Внизу, под формой, а не в ней: согласие с документами и место хранения данных — тихий
 * подвал, который не спорит с формой. Адреса документов — из штатных полей sign-in experience
 * (`termsOfUseUrl`, `privacyPolicyUrl`): у каждого стенда свой адрес кабинета. Без адресов
 * фразы о согласии нет — ссылаться не на что.
 *
 * Ссылки подчёркнуты: без этого «условия» в тихой строке не читаются как ссылка. Внутри ссылки
 * строка не рвётся, а строки фразы выравниваются по длине — на телефоне «политику
 * конфиденциальности» переносится целиком. Открываются в новой вкладке: уход со страницы
 * сбросил бы начатый вход.
 */
const DjinnSignInLayout = ({ children, pageTitle, heading, subheading }: Props) => {
  const { termsOfUseUrl, privacyPolicyUrl } = useTerms();

  return (
    <FirstScreenLayout pageMeta={{ titleKey: pageTitle }}>
      <div className={styles.brand} aria-label="Готовченко">
        <svg aria-hidden="true" className={styles.mark} viewBox="0 0 465 265">
          <path d="M281.2 1V68.3L122.5 217V68.4L194.8 1H281.2Z" fill="#DF6984" />
          <path d="M122.5 217V1H0V264.9H71.5L122.5 217Z" fill="#FF6B5C" />
          <path d="M465 263.9V66.7L329.4 193.3V263.9H465Z" fill="#7C62FF" />
          <path d="M465 66.7V0H378.2L306.3 67V215.3L465 66.7Z" fill="#9D64D5" />
          <path d="M306.3 215.3V67.4L171.1 193.6V264.2H254.2L306.3 215.3Z" fill="#BE67AC" />
        </svg>
        <span className={styles.wordmark}>Готовченко</span>
      </div>
      <header className={styles.header}>
        <h1 className={styles.heading}>{heading}</h1>
        <div className={styles.subheading}>{subheading}</div>
      </header>
      {children}
      <div className={styles.foot}>
        {termsOfUseUrl && privacyPolicyUrl && (
          <p className={styles.consent}>
            Продолжая, вы&nbsp;принимаете{' '}
            <a href={termsOfUseUrl} target="_blank" rel="noopener noreferrer">
              условия использования
            </a>{' '}
            и&nbsp;
            <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
              политику конфиденциальности
            </a>
            .
          </p>
        )}
        <p className={styles.residence}>Данные хранятся в России.</p>
      </div>
    </FirstScreenLayout>
  );
};

export default DjinnSignInLayout;
