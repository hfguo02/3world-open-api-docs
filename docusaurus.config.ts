import {themes as prismThemes} from 'prism-react-renderer';
import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';

import {copyPageButtonPluginOptions} from './src/config/copyPage';

const config: Config = {
  title: '3World 开发者文档',
  tagline: '3World Open API 开发者文档',
  favicon: 'img/favicon.ico',

  url: 'https://hfguo02.github.io',
  baseUrl: '/3world-open-api-docs/',
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          docItemComponent: '@theme/ApiItem',
          editUrl: undefined,
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
        id: 'api-current-generator',
        docsPluginId: 'default',
        config: {
          whitelabel: {
            specPath: 'openapi/whitelabel/releases/whitelabel-api-v1.1.0.json',
            outputDir: 'docs/api',
            infoTemplate: 'templates/api-info.mdx.mustache',
            version: '1.1.0',
            hideSendButton: true,
            maskCredentials: true,
          },
        },
      },
    ],
    [
      'docusaurus-plugin-copy-page-button',
      copyPageButtonPluginOptions,
    ],
    [
      'docusaurus-plugin-llms',
      {
        versions: 'auto',
        generateLLMsTxt: true,
        generateLLMsFullTxt: false,
        generateMarkdownFiles: true,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: ['**/*.info.mdx'],
        logLevel: 'quiet',
      },
    ],
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/',
        docsDir: ['docs'],
        searchBarShortcut: false,
        searchBarShortcutKeymap: 'mod+k',
        searchBarShortcutHint: false,
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      logo: {
        alt: '3World',
        src: 'img/logo.svg',
      },
      items: [],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
