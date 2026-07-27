import styles from './DjinnBrandPanel.module.scss';

/**
 * Правая панель экрана входа: обещание продукта на градиенте.
 *
 * Показывается только в полноэкранном редиректе. В попапе и на узком экране
 * панели нет — там ценность несёт сама форма, а не декорация.
 *
 * Композер здесь неинтерактивен: это иллюстрация того, что человек получит
 * после входа, а не работающее поле. Поэтому `aria-hidden` — экранному диктору
 * читать нечего, а таб-порядок должен вести к почте, а не сюда.
 */
const DjinnBrandPanel = () => (
  <aside className={styles.panel} aria-label="Готовченко">
    <div className={styles.gradient}>
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
    </div>
  </aside>
);

export default DjinnBrandPanel;
