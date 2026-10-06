import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

type Props = {
  readonly value: string;
};

/**
 * Строка адреса под «Введите код»: «Отправили на <адрес> · Изменить».
 *
 * Опечатка в адресе — самая частая причина, по которой код «не приходит». Показать адрес рядом
 * с полем ввода дешевле, чем разбираться потом; «Изменить» возвращает к вводу почты.
 */
const DjinnIdentifierChip = ({ value }: Props) => {
  const navigate = useNavigate();

  return (
    <span className={styles.line}>
      Отправили на <b className={styles.value}>{value}</b>
      <span aria-hidden="true" className={styles.dot}>
        {' · '}
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
    </span>
  );
};

export default DjinnIdentifierChip;
