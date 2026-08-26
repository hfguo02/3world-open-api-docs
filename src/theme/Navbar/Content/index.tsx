import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
import {
  ErrorCauseBoundary,
  ThemeClassNames,
  useThemeConfig,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';

import styles from './styles.module.css';

const VERSIONED_DOC_ROUTES = new Set(['/introduction', '/api', '/webhooks']);

type LinkNavbarItem = NavbarItemConfig & {
  activeBasePath?: string;
  to?: string;
};

function versionedNavbarItem(
  item: NavbarItemConfig,
  isLegacyVersion: boolean,
): NavbarItemConfig {
  const linkItem = item as LinkNavbarItem;
  if (!isLegacyVersion || !linkItem.to || !VERSIONED_DOC_ROUTES.has(linkItem.to)) {
    return item;
  }

  return {
    ...item,
    to: `/v1${linkItem.to}`,
    activeBasePath: `/v1${linkItem.activeBasePath ?? linkItem.to}`,
  } as NavbarItemConfig;
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return items.map((item, index) => (
    <ErrorCauseBoundary
      key={index}
      onError={(error) => new Error('Navbar item 渲染失败', {cause: error})}>
      <NavbarItem {...item} />
    </ErrorCauseBoundary>
  ));
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const {pathname} = useLocation();
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  const [leftItems, rightItems] = splitNavbarItems(items);
  const versionedLeftItems = leftItems.map((item) =>
    versionedNavbarItem(item, pathname === '/v1' || pathname.startsWith('/v1/')),
  );

  return (
    <div className="navbar__inner">
      <div className={clsx(ThemeClassNames.layout.navbar.containerLeft, 'navbar__items')}>
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <NavbarLogo />
        <NavbarItems items={versionedLeftItems} />
      </div>
      <div className={clsx(ThemeClassNames.layout.navbar.containerRight, 'navbar__items navbar__items--right')}>
        <NavbarItems items={rightItems} />
        <NavbarColorModeToggle className={styles.colorModeToggle} />
      </div>
    </div>
  );
}
