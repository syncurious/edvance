import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatusBadge } from '@/components/shared/status-badge';
import { TextField } from '@/components/shared/text-field';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

describe('design-system accessibility contracts', () => {
  it('associates a text field with its label, description, and error', () => {
    render(
      <TextField
        label="Administrator email"
        description="Use a work email."
        error="Enter a complete email address."
      />,
    );

    const input = screen.getByLabelText('Administrator email');
    const error = screen.getByRole('alert');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      'Use a work email. Enter a complete email address.',
    );
    expect(error).toHaveTextContent('Enter a complete email address.');
  });

  it('communicates status with visible text', () => {
    render(<StatusBadge status="success">Paid</StatusBadge>);

    expect(screen.getByText('Paid')).toBeVisible();
  });

  it('prevents interaction when an action is unavailable', () => {
    render(<Button disabled>Save changes</Button>);

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  it('selects the requested default tab', () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Student summary</TabsContent>
        <TabsContent value="fees">Fee summary</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Student summary')).toBeVisible();
  });
});
