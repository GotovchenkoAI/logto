import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import usePlatform from '@/hooks/use-platform';
import { layoutClassNames } from '@/utils/consts';

import CustomContent from './CustomContent';
import DjinnBrandPanel from './DjinnBrandPanel';
import styles from './index.module.scss';

/**
 * Форма слева, градиентная панель справа — порядок по кадру «Экран · Вход».
 * В попапе и на мобильном панель не рендерится: её прячет ширина, а не флаг.
 */
const AppLayout = () => {
  const { isMobile } = usePlatform();

  return (
    <div className={styles.viewBox}>
      <div className={classNames(styles.container, layoutClassNames.pageContainer)}>
        <main className={classNames(styles.main, layoutClassNames.mainContent)}>
          <Outlet />
          {!isMobile && <CustomContent className={layoutClassNames.customContent} />}
        </main>
        <div className={styles.brandColumn}>
          <DjinnBrandPanel />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
