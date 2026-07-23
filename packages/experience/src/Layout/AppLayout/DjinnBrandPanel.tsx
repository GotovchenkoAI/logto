import styles from './DjinnBrandPanel.module.scss';

const DjinnBrandPanel = () => (
  <aside className={styles.panel} aria-label="Djinn">
    <div className={styles.wordmark}>
      <span className={styles.mark} aria-hidden="true">
        <span className={styles.stroke} />
        <span className={styles.stroke} />
      </span>
      <span>Djinn</span>
    </div>

    <div className={styles.promise}>
      <span className={styles.eyebrow}>Ваше личное пространство</span>
      <h1>
        Всё сложное
        <br />
        <em>соберётся здесь.</em>
      </h1>
      <p>Загрузите материалы, объясните задачу — и заберите готовый результат.</p>
    </div>

    <div className={styles.trust}>
      <span className={styles.trustDot} aria-hidden="true" />
      Защищённый вход без пароля
    </div>
  </aside>
);

export default DjinnBrandPanel;
