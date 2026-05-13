import { useAtom } from 'jotai';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { buildFormAtom, buildSubmitStatusAtom } from '../atoms/buildAtom';

const TITLE_MAX = 256;

async function createGitHubIssue(
  title: string,
  body: string,
): Promise<{ html_url: string; number: number }> {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
  const repo = import.meta.env.VITE_GITHUB_REPO as string | undefined;

  if (!token || !repo) {
    throw new Error(
      'GitHub integration is not configured. Set VITE_GITHUB_TOKEN and VITE_GITHUB_REPO in your environment.',
    );
  }

  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ title, body }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`GitHub API error ${response.status}: ${detail || response.statusText}`);
  }

  return response.json();
}

export default function BuildPage() {
  const [form, setForm] = useAtom(buildFormAtom);
  const [status, setStatus] = useAtom(buildSubmitStatusAtom);

  const titleError = form.title.trim().length === 0 ? 'Title is required' : form.title.length > TITLE_MAX ? `Title must be ${TITLE_MAX} characters or fewer` : '';
  const descriptionError = form.description.trim().length === 0 ? 'Description is required' : '';

  const isLoading = status.type === 'loading';
  const isSuccess = status.type === 'success';

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, title: e.target.value }));
    if (status.type !== 'idle') setStatus({ type: 'idle' });
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, description: e.target.value }));
    if (status.type !== 'idle') setStatus({ type: 'idle' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (titleError || descriptionError) return;

    setStatus({ type: 'loading' });
    try {
      const issue = await createGitHubIssue(form.title.trim(), form.description.trim());
      setStatus({ type: 'success', issueUrl: issue.html_url, issueNumber: issue.number });
      setForm({ title: '', description: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'An unexpected error occurred.' });
    }
  }

  function handleReset() {
    setForm({ title: '', description: '' });
    setStatus({ type: 'idle' });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 720 }}>
      {/* Page header */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <BuildOutlinedIcon sx={{ color: '#085ED7', fontSize: '1.75rem' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Propose a Change
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Have an idea or spotted something that needs fixing? Describe it below and it will be logged as a GitHub issue for the engineering team to review.
        </Typography>
      </Box>

      <Divider />

      {/* Success state */}
      {isSuccess && status.type === 'success' && (
        <Alert
          severity="success"
          icon={<CheckCircleOutlineIcon />}
          action={
            <Button color="inherit" size="small" onClick={handleReset}>
              Submit another
            </Button>
          }
        >
          <AlertTitle>Change request submitted!</AlertTitle>
          Issue{' '}
          <Link href={status.issueUrl} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 600 }}>
            #{status.issueNumber}
          </Link>{' '}
          has been created and is now visible to the engineering team.
        </Alert>
      )}

      {/* Error state */}
      {status.type === 'error' && (
        <Alert severity="error">
          <AlertTitle>Submission failed</AlertTitle>
          {status.message}
        </Alert>
      )}

      {/* Form — hidden after success */}
      {!isSuccess && (
        <Card sx={{ borderRadius: 2.5 }}>
          <CardContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Title"
                placeholder="e.g. Add dark mode toggle to the dashboard"
                value={form.title}
                onChange={handleTitleChange}
                error={status.type === 'error' && titleError !== ''}
                helperText={
                  form.title.length > 0
                    ? `${form.title.length}/${TITLE_MAX} characters${titleError ? ` — ${titleError}` : ''}`
                    : undefined
                }
                required
                fullWidth
                disabled={isLoading}
                slotProps={{ input: { inputProps: { maxLength: TITLE_MAX + 10 } } }}
              />

              <TextField
                label="Description"
                placeholder="Describe the change in as much detail as you like — what's the problem, what would the ideal solution look like, and who would benefit?"
                value={form.description}
                onChange={handleDescriptionChange}
                multiline
                minRows={6}
                required
                fullWidth
                disabled={isLoading}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || titleError !== '' || descriptionError !== ''}
                  startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
                  sx={{ minWidth: 160, background: '#085ED7', '&:hover': { background: '#064db5' } }}
                >
                  {isLoading ? 'Submitting…' : 'Submit Request'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
