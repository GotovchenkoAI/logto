import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import usePlatform from '@/hooks/use-platform';
import { layoutClassNames } from '@/utils/consts';

import CustomContent from './CustomContent';
import DjinnBrandPanel from './DjinnBrandPanel';
import styles from './index.module.scss';

const AppLayout = () => {
  const { isMobile } = usePlatform();

  return (
    <div className={styles.viewBox}>
      <div className={classNames(styles.container, layoutClassNames.pageContainer)}>
        <div className={styles.brandColumn}>
          <DjinnBrandPanel />
          {!isMobile && <CustomContent className={layoutClassNames.customContent} />}
        </div>
        <main className={classNames(styles.main, layoutClassNames.mainContent)}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
