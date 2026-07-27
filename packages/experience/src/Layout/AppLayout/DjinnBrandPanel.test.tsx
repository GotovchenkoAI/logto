import { render } from '@testing-library/react';

import DjinnBrandPanel from './DjinnBrandPanel';

describe('Djinn Experience brand boundary', () => {
  it('renders product value without owning authentication protocol', () => {
    const { getByText, queryByText } = render(<DjinnBrandPanel />);

    expect(getByText('Готовый документ — из пары фраз')).not.toBeNull();
    expect(getByText(/12 400\+ уже собрали документ/)).not.toBeNull();
    // Граница прежняя: протокол — дело рантайма, на экране ему места нет.
    expect(queryByText(/OAuth|OIDC|OTP|Logto/)).toBeNull();
  });

  it('keeps the illustrated composer out of the tab order', () => {
    const { container } = render(<DjinnBrandPanel />);

    // Композер — картинка обещания, а не поле. Живых полей в панели быть не должно:
    // таб от почты обязан вести к кнопке входа, а не в декорацию.
    expect(container.querySelectorAll('input, textarea, button')).toHaveLength(0);
  });
});
