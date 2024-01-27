import {
  render,
  screen,
  act,
  RenderResult,
  Queries,
  waitFor,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '..';
import { WrapperQueryClient as wrapper } from '../../../utils/test/common';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

describe('Sign Up form', () => {
  let component: RenderResult<Queries, HTMLElement, HTMLElement> | undefined = undefined;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it('Test to match snapshot of component', async () => {
    await act(() => {
      component = render(<SignUp />, { wrapper });
    });
    const { asFragment } = component || { asFragment: () => DocumentFragment };
    expect(asFragment()).toMatchSnapshot();
  });

  test('TextField email address receives value that user is typing into', async () => {
    await act(async () => render(<SignUp />, { wrapper }));
    const input = await screen.findByTestId('email-input');
    await waitFor(() => {
      userEvent.type(input, 'Jay');
      expect(input).toHaveValue('Jay');
    });
  });

  test('TextField password receives value that user is typing into', async () => {
    await act(async () => render(<SignUp />, { wrapper }));
    const input = await screen.findByTestId('password-input');
    await waitFor(() => {
      userEvent.type(input, 'secret007');
      expect(input).toHaveValue('secret007');
    });
  });

  test('TextField usename receives value that user is typing into', async () => {
    await act(async () => render(<SignUp />, { wrapper }));
    const input = await screen.findByTestId('username-input');
    await waitFor(() => {
      userEvent.type(input, 'tom cruise');
      expect(input).toHaveValue('tom cruise');
    });
  });

  test('Button Sign Up has name as Sign Up', async () => {
    await act(async () => render(<SignUp />, { wrapper }));
    const buttonSubmit = await screen.findByRole('button', { name: 'Sign Up' });

    await waitFor(() => {
      expect(buttonSubmit).toBeInTheDocument();
    });
  });
});
