import classNames from 'classnames';

import styles from './index.module.scss';

type Props = {
  readonly children: string;
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly className?: string;
  /**
   * `button` для форм без onSubmit: экран кода отправляет обработчиком, и тип
   * `submit` там перезагрузил бы страницу вместо проверки кода.
   */
  readonly htmlType?: 'submit' | 'button';
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * Основная кнопка экрана входа — главная кнопка кабинета: градиент 118°, без стрелки.
 *
 * Не использует `shared/components/Button`: тот принимает только ключ фразы, а
 * фразы приходят с сервера (`/api/.well-known/phrases`) из собранного образа
 * Logto. Наш текст не должен ждать пересборки образа, поэтому строки живут в
 * коде рядом с разметкой.
 */
const DjinnSubmitButton = ({
  children,
  isLoading,
  isDisabled,
  className,
  htmlType = 'submit',
  onClick,
}: Props) => (
  <button
    // Тот же якорь, что у апстримной `Button`: по `button[name=submit]` форму
    // находят интеграционные тесты Logto и наш браузерный контракт входа.
    name="submit"
    className={classNames(styles.button, className)}
    disabled={isDisabled ?? isLoading}
    type={htmlType}
    onClick={onClick}
  >
    <span className={styles.label}>{children}</span>
    {isLoading && <span aria-hidden="true" className={styles.spinner} />}
  </button>
);

export default DjinnSubmitButton;
