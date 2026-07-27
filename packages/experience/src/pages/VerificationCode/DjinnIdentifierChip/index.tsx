import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

type Props = {
  readonly value: string;
};

/**
 * Плашка с адресом и ссылкой «Изменить» по кадру «Экран · Код (OTP)».
 *
 * Опечатка в адресе — самая частая причина, по которой код «не приходит».
 * Показать адрес рядом с полем ввода дешевле, чем разбираться потом.
 */
const DjinnIdentifierChip = ({ value }: Props) => {
  const navigate = useNavigate();

  return (
    /* Внешний ряд держит ширину колонки, внутренняя плашка обжимает содержимое. */
    <div className={styles.row}>
      <div className={styles.chip}>
        <svg
          aria-hidden="true"
          className={styles.icon}
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="16" rx="2" stroke="currentColor" strokeWidth="2" width="20" x="2" y="4" />
          <path
            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        <span className={styles.value}>{value}</span>
        <span aria-hidden="true" className={styles.dot}>
          ·
        </span>
        <button
          className={styles.change}
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Изменить
        </button>
      </div>
    </div>
  );
};

export default DjinnIdentifierChip;
