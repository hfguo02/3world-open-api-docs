import {themes as prismThemes} from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'Victoria Open API Docs',
  tagline: 'Victoria 开发者文档',
  favicon: 'img/favicon.ico',

  url: 'http://localhost:3000',
  baseUrl: '/',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'guide',
          editUrl: undefined,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'api',
        config: {
          passkey: {
            specPath: 'openapi/passkey/passkey-api-openapi.json',
            outputDir: 'api-docs/passkey',
            label: 'v1.2.0',
            version: '1.2.0',
            sidebarOptions: {
              groupPathsBy: 'tag',
            },
          },
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api-docs',
        routeBasePath: 'api',
        sidebarPath: './api-docs/passkey/sidebar.ts',
        docItemComponent: '@theme/ApiItem',
        editUrl: undefined,
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Victoria Open API Docs',
      logo: {
        alt: 'Victoria',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Guide', to: '/guide/overview'},
            {label: 'API Reference', to: '/api/passkey/overview'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Victoria. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;