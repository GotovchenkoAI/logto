import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DjinnBrandPanel from './DjinnBrandPanel';

const renderAt = (pathname: string) =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <DjinnBrandPanel />
    </MemoryRouter>
  );

describe('DjinnBrandPanel', () => {
  it('знает шаг: почта на входе, код — на экране кода', () => {
    const email = renderAt('/sign-in').container.querySelector('aside');
    const code = renderAt('/sign-in/verification-code').container.querySelector('aside');

    expect(email?.dataset.step).toBe('email');
    expect(code?.dataset.step).toBe('code');
    expect(email?.textContent).not.toBe(code?.textContent);
  });

  it('декорация вне порядка табуляции и скрыта от скринридера', () => {
    const { container } = renderAt('/sign-in');

    // Таб от почты обязан вести к кнопке входа, а не в картинку кабинета.
    expect(container.querySelectorAll('input, textarea, button, a')).toHaveLength(0);
    expect(container.querySelector('aside')?.getAttribute('aria-hidden')).toBe('true');
  });
});
