import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

afterEach(cleanup);

function Example({ disabled = false }: { disabled?: boolean }) {
  return (
    <Tooltip disabled={disabled}>
      <TooltipTrigger>Help</TooltipTrigger>
      <TooltipContent>Helpful description</TooltipContent>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('uses a body portal and viewport positioning outside a scrolling section', async () => {
    const { container } = render(<main style={{ overflow: 'auto', transform: 'translateX(80px)' }}><Example /></main>);
    fireEvent.focus(screen.getByRole('button', { name: 'Help' }));

    const popup = await screen.findByText('Helpful description');
    const positioner = popup.closest('[data-slot="tooltip-positioner"]');
    expect(container).not.toContainElement(popup);
    expect(positioner?.parentElement?.parentElement).toBe(document.body);
    expect(positioner).toHaveStyle({ position: 'fixed' });
    expect(positioner).toHaveClass('data-anchor-hidden:invisible');

    fireEvent.keyDown(screen.getByRole('button', { name: 'Help' }), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByText('Helpful description')).not.toBeInTheDocument());
  });

  it('clears an open tooltip when disabled and does not resurrect it on re-enable', async () => {
    const { rerender } = render(<Example />);
    fireEvent.focus(screen.getByRole('button', { name: 'Help' }));
    await screen.findByText('Helpful description');
    rerender(<Example disabled />);
    await waitFor(() => expect(screen.queryByText('Helpful description')).not.toBeInTheDocument());
    rerender(<Example />);
    expect(screen.queryByText('Helpful description')).not.toBeInTheDocument();
  });

  it('escapes a sheet portal and removes the tooltip when the sheet closes', async () => {
    render(
      <Sheet>
        <SheetTrigger>Open drawer</SheetTrigger>
        <SheetContent><SheetTitle>Details</SheetTitle><Example /></SheetContent>
      </Sheet>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }));
    fireEvent.focus(await screen.findByRole('button', { name: 'Help' }));
    const popup = await screen.findByText('Helpful description');
    expect(popup.closest('[data-slot="tooltip-positioner"]')?.parentElement?.parentElement).toBe(document.body);
    expect(popup.closest('[data-slot="sheet-portal"]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
    await waitFor(() => expect(screen.queryByText('Helpful description')).not.toBeInTheDocument());
    fireEvent.scroll(window);
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
  });
});
