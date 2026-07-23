import { render } from '@testing-library/react';

import DjinnBrandPanel from './DjinnBrandPanel';

describe('Djinn Experience brand boundary', () => {
  it('renders product value without owning authentication protocol', () => {
    const { getByText, queryByText } = render(<DjinnBrandPanel />);

    expect(getByText('Djinn')).not.toBeNull();
    expect(getByText(/Всё сложное/)).not.toBeNull();
    expect(getByText('Защищённый вход без пароля')).not.toBeNull();
    expect(queryByText(/OAuth|OIDC|OTP|Logto/)).toBeNull();
  });
});
