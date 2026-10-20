import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './auth/AuthProvider';
import { RedirectIfSignedIn, RequireAuth } from './auth/guards';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { TooltipLayer } from './components/TooltipLayer';
import { AuthPage } from './pages/AuthPage';
import { HandoffPage } from './pages/HandoffPage';
import { SecurityLayer } from './security/SecurityLayer';
import { AppPage, HomePage, LibraryPage, NotFound, SearchPage, TemplatesPage } from './store/pages';
import { ThemeProvider } from './theme/ThemeProvider';
import { WhatsNew } from './whatsnew/WhatsNew';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/apps/:id" element={<AppPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/library"
                  element={
                    <RequireAuth>
                      <LibraryPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/signin"
                  element={
                    <RedirectIfSignedIn>
                      <AuthPage mode="signin" />
                    </RedirectIfSignedIn>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <RedirectIfSignedIn>
                      <AuthPage mode="signup" />
                    </RedirectIfSignedIn>
                  }
                />
                <Route path="/auth/handoff" element={<HandoffPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
          <TooltipLayer />
          <WhatsNew />
          <SecurityLayer />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
