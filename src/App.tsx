import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'jotai';
import theme from './theme/theme';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <Provider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </Provider>
  );
}
