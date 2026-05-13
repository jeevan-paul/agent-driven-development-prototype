import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'jotai';
import BuildPage from './BuildPage';

// Stub import.meta.env before the module is loaded
vi.stubEnv('VITE_GITHUB_TOKEN', 'test-token');
vi.stubEnv('VITE_GITHUB_REPO', 'test-owner/test-repo');

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function renderBuildPage() {
  return render(
    <Provider>
      <BuildPage />
    </Provider>,
  );
}

describe('BuildPage', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page heading and form fields', () => {
    renderBuildPage();
    expect(screen.getByText('Propose a Change')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit request/i })).toBeInTheDocument();
  });

  it('submit button is disabled when fields are empty', () => {
    renderBuildPage();
    const button = screen.getByRole('button', { name: /submit request/i });
    expect(button).toBeDisabled();
  });

  it('submit button is disabled when only title is filled', async () => {
    const user = userEvent.setup();
    renderBuildPage();
    await user.type(screen.getByLabelText(/title/i), 'My title');
    expect(screen.getByRole('button', { name: /submit request/i })).toBeDisabled();
  });

  it('submit button is disabled when only description is filled', async () => {
    const user = userEvent.setup();
    renderBuildPage();
    await user.type(screen.getByLabelText(/description/i), 'Some description');
    expect(screen.getByRole('button', { name: /submit request/i })).toBeDisabled();
  });

  it('submit button is enabled when both fields are filled', async () => {
    const user = userEvent.setup();
    renderBuildPage();
    await user.type(screen.getByLabelText(/title/i), 'My title');
    await user.type(screen.getByLabelText(/description/i), 'Some description');
    expect(screen.getByRole('button', { name: /submit request/i })).toBeEnabled();
  });

  it('shows a success alert with issue link after successful submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ html_url: 'https://github.com/test-owner/test-repo/issues/42', number: 42 }),
    });

    const user = userEvent.setup();
    renderBuildPage();

    await user.type(screen.getByLabelText(/title/i), 'Add dark mode');
    await user.type(screen.getByLabelText(/description/i), 'We need dark mode for better UX.');
    await user.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => {
      expect(screen.getByText(/change request submitted/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /#42/i })).toHaveAttribute(
      'href',
      'https://github.com/test-owner/test-repo/issues/42',
    );
  });

  it('calls GitHub API with the correct payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ html_url: 'https://github.com/test-owner/test-repo/issues/1', number: 1 }),
    });

    const user = userEvent.setup();
    renderBuildPage();

    await user.type(screen.getByLabelText(/title/i), 'Fix typo');
    await user.type(screen.getByLabelText(/description/i), 'Typo on homepage.');
    await user.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.github.com/repos/test-owner/test-repo/issues');
    const body = JSON.parse(options.body as string);
    expect(body.title).toBe('Fix typo');
    expect(body.body).toBe('Typo on homepage.');
  });

  it('shows an error alert when the API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      text: async () => 'Forbidden',
    });

    const user = userEvent.setup();
    renderBuildPage();

    await user.type(screen.getByLabelText(/title/i), 'Fix typo');
    await user.type(screen.getByLabelText(/description/i), 'Typo on homepage.');
    await user.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/403/)).toBeInTheDocument();
  });

  it('clears form and shows submit-another button after success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ html_url: 'https://github.com/test-owner/test-repo/issues/7', number: 7 }),
    });

    const user = userEvent.setup();
    renderBuildPage();

    await user.type(screen.getByLabelText(/title/i), 'Idea');
    await user.type(screen.getByLabelText(/description/i), 'Great idea here.');
    await user.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /submit another/i })).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /submit another/i }));
    expect(screen.getByRole('button', { name: /submit request/i })).toBeInTheDocument();
  });

  it('disables button and shows loading indicator while submitting', async () => {
    let resolvePromise: (value: unknown) => void;
    mockFetch.mockReturnValueOnce(
      new Promise((res) => { resolvePromise = res; }),
    );

    const user = userEvent.setup();
    renderBuildPage();

    await user.type(screen.getByLabelText(/title/i), 'My title');
    await user.type(screen.getByLabelText(/description/i), 'My description');
    await user.click(screen.getByRole('button', { name: /submit request/i }));

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();

    resolvePromise!({
      ok: true,
      json: async () => ({ html_url: 'https://github.com/test/repo/issues/1', number: 1 }),
    });
  });
});
