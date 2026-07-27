import { useLocation } from 'react-router-dom';

import styles from './DjinnBrandPanel.module.scss';

/**
 * Правая панель экрана входа: обещание продукта на градиенте.
 *
 * Показывается только в полноэкранном редиректе. В попапе и на узком экране
 * панели нет — там ценность несёт сама форма, а не декорация.
 *
 * Панель знает шаг. На вводе почты она продаёт результат, на вводе кода —
 * подтверждает, что письмо ушло: в этот момент человек ждёт письма, и любое
 * другое сообщение рядом с полем кода отвлекает от единственного вопроса
 * «дошло ли».
 */
const DjinnBrandPanel = () => {
  const { pathname } = useLocation();
  const isAwaitingCode = pathname.includes('verification-code');

  return (
    <aside className={styles.panel} aria-label="Готовченко">
      <div className={styles.gradient}>
        {isAwaitingCode ? (
          <>
            <p className={styles.headline}>Ещё пара секунд — и вы внутри</p>

            <div className={styles.sent}>
              <span aria-hidden="true" className={styles.sentIcon}>
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 11.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="m2 7 8.97 5.7a1.94 1.94 0 0 0 2.06 0L22 7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="m16 18 2 2 4-4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <span className={styles.sentText}>
                <b>Письмо отправлено</b>
                Код уже в вашем почтовом ящике
              </span>
            </div>
          </>
        ) : (
          <>
            <p className={styles.headline}>Готовый документ — из пары фраз</p>

            <div className={styles.composer} aria-hidden="true">
              <span className={styles.placeholder}>Составь претензию застройщику по 214-ФЗ…</span>
              <span className={styles.send} />
            </div>

            <div className={styles.proof}>
              <span className={styles.avatars} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              12 400+ уже собрали документ
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default DjinnBrandPanel;
