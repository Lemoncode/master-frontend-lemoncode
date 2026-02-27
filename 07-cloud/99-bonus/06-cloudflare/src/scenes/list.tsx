import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '#layouts';
import { ListContainer } from '#pods/list';

export const Route = createFileRoute('/list')({
  component: () => {
    return (
      <AppLayout>
        {({ className }) => <ListContainer className={className} />}
      </AppLayout>
    );
  },
});
