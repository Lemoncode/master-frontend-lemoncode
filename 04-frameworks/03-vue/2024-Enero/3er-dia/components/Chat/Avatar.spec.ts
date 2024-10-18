import { render, screen } from '@testing-library/vue'

import Avatar from './Avatar.vue'

test('renders the Avatar component', () => {
  render(Avatar, {
    props: {
      sender: 'ai',
    },
  })

  expect(screen.getByLabelText('OpenAi logo')).toBeInTheDocument()
})
