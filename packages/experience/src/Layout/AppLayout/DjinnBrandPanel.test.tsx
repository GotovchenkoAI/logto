import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DjinnBrandPanel from './DjinnBrandPanel';

const renderAt = (pathname: string) =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <DjinnBrandPanel />
    </MemoryRouter>
  );

describe('Djinn Experience brand boundary', () => {
  it('renders product value without owning authentication protocol', () => {
    const { getByText, queryByText } = renderAt('/sign-in');

    expect(getByText('Готовый документ — из пары фраз')).not.toBeNull();
    expect(getByText(/12 400\+ уже собрали документ/)).not.toBeNull();
    // Граница прежняя: протокол — дело рантайма, на экране ему места нет.
    expect(queryByText(/OAuth|OIDC|OTP|Logto/)).toBeNull();
  });

  it('keeps the illustrated composer out of the tab order', () => {
    const { container } = renderAt('/sign-in');

    // Композер — картинка обещания, а не поле. Живых полей в панели быть не должно:
    // таб от почты обязан вести к кнопке входа, а не в декорацию.
    expect(container.querySelectorAll('input, textarea, button')).toHaveLength(0);
  });

  it('confirms the letter was sent while the code is awaited', () => {
    const { getByText, queryByText } = renderAt('/sign-in/verification-code');

    // Пока человек ждёт письмо, единственный его вопрос — «дошло ли».
    expect(getByText('Ещё пара секунд — и вы внутри')).not.toBeNull();
    expect(getByText('Письмо отправлено')).not.toBeNull();
    expect(queryByText('Готовый документ — из пары фраз')).toBeNull();
  });
});
