import { expect, test, describe } from 'vitest';
import { render } from '@testing-library/vue';

import ChatAvatar from './ChatAvatar.vue';
import type { ChatUsers } from '~/types';

describe('ChatAvatar', () => {
  const renderComponent = ({ sender }: { sender: 'user' | 'ai' }) => {
    const component = render(ChatAvatar, {
      props: { sender },
    });

    return component;
  };

  test.each([
    [{ sender: 'user' as ChatUsers }, 'User icon'],
    [{ sender: 'ai' as ChatUsers }, 'Ollama logo'],
  ])(
    'ChatAvatar renders the correct icon when the sender %s',
    ({ sender }, expectedLabel) => {
      const component = renderComponent({ sender });

      expect(component.findByLabelText(expectedLabel)).toBeTruthy();
    }
  );
});
