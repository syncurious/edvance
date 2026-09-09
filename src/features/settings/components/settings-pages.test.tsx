import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PlatformSettingsPage } from '@/features/settings/components/platform-settings';
import { SchoolSettingsPage } from '@/features/settings/components/school-settings';
import { MockSettingsService } from '@/features/settings/services/mock-settings-service';
import { makeStore } from '@/store';

afterEach(cleanup);

describe('settings pages', () => {
  it('validates and saves platform configuration changes', async () => {
    const service = new MockSettingsService(0);
    const save = vi.spyOn(service, 'savePlatformSettings');
    render(<PlatformSettingsPage service={service} />);

    const name = await screen.findByLabelText('Platform name');
    fireEvent.change(name, { target: { value: '' } });
    expect(screen.getByText('Unsaved changes')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Enter a platform name.')).toBeVisible();
    expect(save).not.toHaveBeenCalled();

    fireEvent.change(name, { target: { value: 'Edvance Cloud' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(screen.getByText('All changes saved')).toBeVisible(),
    );
  });

  it('validates and saves school-scoped configuration changes', async () => {
    const service = new MockSettingsService(0);
    const save = vi.spyOn(service, 'saveSchoolSettings');
    render(
      <Provider store={makeStore()}>
        <SchoolSettingsPage service={service} />
      </Provider>,
    );

    const name = await screen.findByLabelText('School name');
    expect(screen.getByText('Editing All campuses')).toBeVisible();
    fireEvent.change(name, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Enter the school name.')).toBeVisible();
    expect(save).not.toHaveBeenCalled();

    fireEvent.change(name, { target: { value: 'Crescent Academy North' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() =>
      expect(save).toHaveBeenCalledWith(
        'crescent-academy',
        expect.objectContaining({ schoolName: 'Crescent Academy North' }),
      ),
    );
  });
});
