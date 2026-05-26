import type { Preview } from '@storybook/react-vite';
import 'moment-timezone';
import '../stories/storybook.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        date: /Date$/i,
      },
    },
  },
};

export default preview;
