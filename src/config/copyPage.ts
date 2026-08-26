import type {CopyPageButtonPluginOptions} from 'docusaurus-plugin-copy-page-button';
import type {CopyPageButtonProps} from 'docusaurus-plugin-copy-page-button/react';

const sharedOptions = {
  generateMarkdownRoutes: true,
  markdownUrl: true,
  enabledActions: ['copy', 'view', 'chatgpt', 'claude'],
  labels: {
    button: {label: 'Copy Page'},
    copy: {
      title: 'Copy Page',
      description: 'Copy this page as Markdown for LLMs',
    },
    view: {
      title: 'View as Markdown',
      description: 'View this page as plain text',
    },
    chatgpt: {
      title: 'Open in ChatGPT',
      description: 'Ask questions about this page',
    },
    claude: {
      title: 'Open in Claude',
      description: 'Ask questions about this page',
    },
  },
} as const satisfies CopyPageButtonProps;

export const copyPageButtonProps: CopyPageButtonProps = sharedOptions;

export const copyPageButtonPluginOptions: CopyPageButtonPluginOptions = {
  ...sharedOptions,
  injectButton: false,
};
