import classNames from 'classnames';

import styles from './index.module.scss';

type Props = {
  readonly children: string;
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly className?: string;
};

/**
 * Основная кнопка по кадрам «Экран · Вход» и «Экран · Код (OTP)»:
 * градиент 118°, стрелка, тень 18/y6.
 *
 * Не использует `shared/components/Button`: тот принимает только ключ фразы, а
 * фразы приходят с сервера (`/api/.well-known/phrases`) из собранного образа
 * Logto. Наш текст не должен ждать пересборки образа, поэтому строки живут в
 * коде рядом с разметкой.
 */
const DjinnSubmitButton = ({ children, isLoading, isDisabled, className }: Props) => (
  <button
    className={classNames(styles.button, className)}
    disabled={isDisabled ?? isLoading}
    type="submit"
  >
    <span className={styles.label}>{children}</span>
    {isLoading ? (
      <span aria-hidden="true" className={styles.spinner} />
    ) : (
      <svg
        aria-hidden="true"
        className={styles.arrow}
        fill="none"
        viewBox="0 0 17 17"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 8.5h11M9.5 4l4.5 4.5-4.5 4.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    )}
  </button>
);

export default DjinnSubmitButton;
