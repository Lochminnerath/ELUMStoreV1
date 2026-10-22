import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { api } from '../api';
import { AuthProvider } from '../auth/AuthProvider';
import { ToastProvider } from '../components/Toast';
import { ThemeProvider } from '../theme/ThemeProvider';
import { APPS, isSoon, LIVE_APPS, searchCatalog, SOON_APPS, templateUrl, TEMPLATES } from './catalog';
import { AppPage, SearchPage } from './pages';
import { resetStoreState } from './state';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('the catalogue', () => {
  it('lists every ELUM app once, each with something to say', () => {
    expect(APPS.map((a) => a.id).sort()).toEqual(['account', 'browse', 'make', 'tune', 'type', 'write']);
    for (const a of APPS) {
      expect(a.highlights.length, a.id).toBeGreaterThanOrEqual(3);
      expect(a.host).toBe(`${a.id}.elum.services`);
      expect(a.url).toMatch(/^https:\/\//);
    }
    expect(APPS.filter((a) => a.included).map((a) => a.id)).toEqual(['account']);
  });

  it('keeps coming-soon apps apart from the ones you can get today', () => {
    expect(SOON_APPS.map((a) => a.id)).toEqual(['tune']);
    expect(LIVE_APPS.map((a) => a.id).sort()).toEqual(['account', 'browse', 'make', 'type', 'write']);
    expect(LIVE_APPS.some(isSoon)).toBe(false);
    expect(LIVE_APPS.length + SOON_APPS.length).toBe(APPS.length);
    for (const a of SOON_APPS) expect(a.included || a.featured, a.id).toBeFalsy();
  });

  it('finds Tune, which is coming soon', () => {
    expect(searchCatalog('tune').apps.map((a) => a.id)).toEqual(['tune']);
    expect(searchCatalog('music').apps.map((a) => a.id)).toEqual(['tune']);
    expect(searchCatalog('coming soon').apps.map((a) => a.id)).toEqual(['tune']);
  });

  it('opens templates in Make by the ids Make knows', () => {
    expect(TEMPLATES.map((t) => t.id)).toEqual(['pitch', 'lesson', 'event-poster', 'quote-post']);
    expect(templateUrl('event-poster')).toBe('https://elummake.netlify.app/?template=event-poster');
    expect(templateUrl('pitch', 'c1')).toBe('https://elummake.netlify.app/?template=pitch&from=c1');
  });

  it('finds apps and templates by any of their words', () => {
    expect(searchCatalog('slides').apps.map((a) => a.id)).toEqual(['make']);
    expect(searchCatalog('mail').apps.map((a) => a.id)).toEqual(['type']);
    expect(searchCatalog('poster').templates.map((t) => t.id)).toEqual(['event-poster']);
    expect(searchCatalog('nothing like this')).toEqual({ apps: [], templates: [] });
    expect(searchCatalog('  ').apps).toHaveLength(APPS.length);
  });
});

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  resetStoreState();
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const flush = async (times = 3) => {
  for (let i = 0; i < times; i++) await act(async () => void (await new Promise((r) => setTimeout(r, 0))));
};

function Where() {
  const location = useLocation();
  return <p data-testid="where">{location.pathname + location.search}</p>;
}

async function show(path: string) {
  act(() =>
    root.render(
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route path="/apps/:id" element={<AppPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/signin" element={<Where />} />
              </Routes>
              <Where />
            </MemoryRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>,
    ),
  );
  await flush();
}

const heroButton = () => host.querySelector<HTMLButtonElement>('.app-hero__actions .elum-btn');
const where = () => host.querySelector('[data-testid="where"]')?.textContent;

describe('getting an app', () => {
  it('asks someone signed out to sign in, and to come back to get it', async () => {
    await show('/apps/make');
    expect(host.textContent).toContain('ELUM Make');
    expect(heroButton()?.textContent).toBe('Get');
    await act(async () => heroButton()!.click());
    expect(where()).toBe(`/signin?next=${encodeURIComponent('/apps/make?get=1')}`);
  });

  it('gets it with one click once signed in, then offers Open', async () => {
    await api.signUp({ name: 'Ada', email: 'ada.get@example.org', password: 'long-password-1' });
    await show('/apps/write');
    expect(heroButton()?.textContent).toBe('Get');
    await act(async () => heroButton()!.click());
    await flush();
    expect(heroButton()?.textContent).toBe('Open');
    expect((await api.myApps()).find((a) => a.id === 'write')?.joined).toBe(true);
  });

  it('finishes getting it after signing in (?get=1)', async () => {
    await api.signUp({ name: 'Bo', email: 'bo.get@example.org', password: 'long-password-1' });
    await show('/apps/browse?get=1');
    await flush();
    expect((await api.myApps()).find((a) => a.id === 'browse')?.joined).toBe(true);
    expect(heroButton()?.textContent).toBe('Open');
    expect(where()).toBe('/apps/browse');
  });

  it('opens ELUM Account without getting it: every account has it', async () => {
    await show('/apps/account');
    expect(heroButton()?.textContent).toBe('Open');
    expect(host.textContent).toContain('Included');
  });
});

describe('search', () => {
  it('shows matching apps and templates', async () => {
    await show('/search?q=slides');
    expect(host.textContent).toContain('Results for “slides”');
    expect([...host.querySelectorAll('.app-card__name')].map((n) => n.firstChild?.textContent?.trim())).toEqual(['Make']);
  });

  it('says so when nothing matches', async () => {
    await show('/search?q=zzzz');
    expect(host.textContent).toContain('Nothing in Store matches that');
  });
});

describe('an app that is coming soon', () => {
  it('offers Notify me instead of Get or Open, and says Coming soon', async () => {
    localStorage.removeItem('elum.store.notify.tune');
    await show('/apps/tune');
    expect(host.textContent).toContain('ELUM Tune');
    expect(host.textContent).toContain('Coming soon');
    expect(host.textContent).not.toContain('Working');
    expect(heroButton()?.textContent).toBe('Notify me');
    expect(host.querySelector('.app-hero__actions')?.textContent).not.toContain('Open');
    await act(async () => heroButton()!.click());
    await flush();
    expect(host.querySelector('.app-hero__actions')?.textContent).toContain('We’ll let you know');
    expect(localStorage.getItem('elum.store.notify.tune')).toBe('1');
  });

  it('is never one of your apps, even if the platform says so', async () => {
    await api.signUp({ name: 'Cy', email: 'cy.soon@example.org', password: 'long-password-1' });
    await show('/apps/tune?get=1');
    await flush();
    expect((await api.myApps()).find((a) => a.id === 'tune')?.joined ?? false).toBe(false);
    expect(heroButton()?.textContent).not.toBe('Open');
  });
});
