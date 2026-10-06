import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import cabinetDark from '@/shared/assets/djinn-cabinet-dark.png';
import cabinetLight from '@/shared/assets/djinn-cabinet-light.png';

import styles from './DjinnBrandPanel.module.scss';

/**
 * Правая половина экрана входа: кабинет за стеклом (docs/specs/2026-10-06-login-screen-design.md
 * в репозитории продукта).
 *
 * Под стеклом — снимок настоящего кабинета первого входа: ровно то, что человек увидит после
 * регистрации. Не скелет (читается как бесконечная загрузка), не чужие дела, без профиля. Ни
 * одного утверждения о продукте, которое нельзя проверить: ни выдуманных чисел, ни имитации
 * работы. Движение — только блик по стеклу.
 *
 * Панель знает шаг: на вводе почты — что даёт продукт; на вводе кода стекло проясняется, и
 * кабинет читается — «осталось ввести код».
 *
 * Показывается только на полном экране; в попапе и на узком экране её прячет ширина
 * (index.module.scss).
 */
const DjinnBrandPanel = () => {
  const { pathname } = useLocation();
  const step = pathname.includes('verification-code') ? 'code' : 'email';

  return (
    <aside
      aria-hidden="true"
      className={classNames(styles.panel, step === 'code' && styles.code)}
      data-step={step}
    >
      <div className={styles.stage}>
        {step === 'code' ? (
          <p className={styles.caption}>
            Осталось ввести код&nbsp;— и вы в кабинете
            <small>Письмо уже в пути. Код придёт за несколько секунд.</small>
          </p>
        ) : (
          <p className={styles.caption}>
            Готовый документ из ваших материалов
            <small>Загрузите файлы, опишите задачу&nbsp;— дальше мы.</small>
          </p>
        )}
        <div className={styles.cabinet}>
          <img alt="" className={styles.light} src={cabinetLight} />
          <img alt="" className={styles.dark} src={cabinetDark} />
        </div>
      </div>
      <div className={styles.glass} />
      <span className={styles.sheen} />
    </aside>
  );
};

export default DjinnBrandPanel;
