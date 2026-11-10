import { Search } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { errorMessage } from '../api';
import { useAuth } from '../auth/AuthProvider';
import { StoreLockup, StoreMark } from '../components/Brand';
import { ElumLauncher } from '../components/ElumLauncher';
import * as Icons from '../components/icons/ElumIcons';
import type { IconProps } from '../components/icons/ElumIcons';
import { Menu } from '../components/Menu';
import { NotificationBell } from '../components/NotificationBell';
import { useToast } from '../components/Toast';
import { UserMenu } from '../components/UserMenu';
import { accountsSignIn, BROWSE_URL, openElsewhere, signInThroughAccount } from '../lib/elum';
import { ThemeToggle } from '../theme/ThemeToggle';
import { templateAppName, templateUrl, type StoreApp, type StoreTemplate, type Symbol } from './catalog';
import { useMyApps, useRunning } from './state';

export const SYMBOLS: Record<Symbol, ComponentType<IconProps>> = {
  compose: Icons.ComposeIcon,
  download: Icons.DownloadIcon,
  duplicate: Icons.DuplicateIcon,
  saved: Icons.SavedIcon,
  verified: Icons.VerifiedIcon,
  spam: Icons.SpamIcon,
  archive: Icons.ArchiveIcon,
  private: Icons.PrivateIcon,
  present: Icons.PresentIcon,
  visible: Icons.VisibleIcon,
  open: Icons.OpenIcon,
  star: Icons.StarIcon,
  invite: Icons.InviteIcon,
  warning: Icons.WarningIcon,
  share: Icons.ShareIcon,
  link: Icons.LinkIcon,
};

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

/** The colours an app's page and cards are drawn in. */
export const appStyle = (app: Pick<StoreApp, 'color' | 'mist'>) => ({ '--app': app.color, '--mist': app.mist }) as CSSProperties;

/**
 * Where each mark's drawing really sits inside its 8–112 box (x0, y0, x1, y1). The marks are drawn
 * off centre on purpose, so inside a circle they are moved to its middle and made small enough for
 * every corner to stay inside it.
 */
const MARK_BOX: Record<string, [number, number, number, number]> = {
  write: [11, 29, 109, 83],
  type: [12, 21, 109, 90],
  make: [13, 13, 107, 107],
  browse: [17, 17, 98, 98],
  inquire: [15.8, 15, 104.2, 98.5],
  tune: [17, 21, 103, 105],
  code: [9, 32, 111, 99.5],
  capture: [19, 19, 98, 99],
  account: [29, 17, 91, 103],
};

/** The move and size that centre a mark in a circle as wide as it is. */
export function fitInCircle(id: string): string | undefined {
  const box = MARK_BOX[id];
  if (!box) return undefined;
  const [x0, y0, x1, y1] = box;
  const halfDiagonal = Math.hypot(x1 - x0, y1 - y0) / 2;
  const scale = Math.min(1.2, 46 / halfDiagonal);
  const dx = ((60 - (x0 + x1) / 2) * scale * 100) / 104;
  const dy = ((60 - (y0 + y1) / 2) * scale * 100) / 104;
  return `translate(${dx.toFixed(2)}%, ${dy.toFixed(2)}%) scale(${scale.toFixed(3)})`;
}

/** An ELUM app's mark, in light or dark. `fit` centres it for a circle (see fitInCircle). */
export function AppMark({ id, size, light, fit }: { id: string; size: number; light?: boolean; fit?: boolean }) {
  const style = fit ? { transform: fitInCircle(id) } : undefined;
  // On a light circle or card the mark stays light, whatever the theme.
  if (light) {
    return (
      <span className="app-mark" style={{ width: size, height: size }} aria-hidden="true">
        <img src={`/brand/apps/${id}.svg`} width={size} height={size} alt="" style={style} />
      </span>
    );
  }
  return (
    <span className="app-mark" style={{ width: size, height: size }} aria-hidden="true">
      <img className="theme-light-only" src={`/brand/apps/${id}.svg`} width={size} height={size} alt="" style={style} />
      <img className="theme-dark-only" src={`/brand/apps/${id}-reversed.svg`} width={size} height={size} alt="" style={style} />
    </span>
  );
}

/** The sign-in link, through ELUM Account where it is set up. */
function useSignIn() {
  const navigate = useNavigate();
  return (next: string) => {
    if (accountsSignIn && signInThroughAccount(next)) return;
    navigate(`/signin?next=${encodeURIComponent(next)}`);
  };
}

/** The bar on every Store page: the catalogue search, and the account once signed in. */
export function StoreHeader() {
  const { status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [params] = useSearchParams();
  const [q, setQ] = useState(location.pathname === '/search' ? (params.get('q') ?? '') : '');
  const box = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.pathname !== '/search') setQ('');
  }, [location.pathname]);

  // "/" jumps to the search box, as in Browse.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== '/' || e.metaKey || e.ctrlKey || t.closest('input, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      box.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/');
  };

  return (
    <header className="store-bar">
      <Link to="/" className="brand-link store-bar__brand" aria-label="ELUM Store home">
        <span className="store-bar__lockup">
          <StoreLockup height={30} />
        </span>
        <span className="store-bar__mark">
          <StoreMark size={34} />
        </span>
      </Link>
      <form className="store-search" role="search" onSubmit={submit}>
        <Search size={18} className="store-search__icon" aria-hidden="true" />
        <input
          ref={box}
          className="store-search__input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search apps and templates"
          aria-label="Search apps and templates"
          enterKeyHint="search"
        />
      </form>
      <nav className="store-bar__end" aria-label="Store">
        <Link to="/templates" className="store-bar__link">
          Templates
        </Link>
        {status === 'signed-in' && (
          <Link to="/library" className="store-bar__link">
            Your apps
          </Link>
        )}
        <ThemeToggle />
        <ElumLauncher />
        {status === 'signed-in' ? (
          <>
            <NotificationBell />
            <UserMenu />
          </>
        ) : status === 'signed-out' ? (
          <button type="button" className="elum-btn elum-btn--secondary elum-btn--sm" onClick={() => signIn(location.pathname + location.search)}>
            Sign in
          </button>
        ) : null}
      </nav>
    </header>
  );
}

export function StoreFooter() {
  const running = useRunning();
  const words = running.overall === 'up' ? 'Every ELUM app is working' : running.overall === 'slow' ? 'Some ELUM apps are slow' : running.overall === 'down' ? 'Some ELUM apps are down' : null;
  return (
    <footer className="store-foot">
      <span>Made by you. Runs without AI.</span>
      {words && (
        <a
          className={`store-foot__status health health--${running.overall}`}
          href={`${BROWSE_URL}/status`}
          onClick={(e) => {
            e.preventDefault();
            void openElsewhere(`${BROWSE_URL}/status`, true);
          }}
        >
          <span className="health__dot" aria-hidden="true" />
          {words}
        </a>
      )}
      <span className="muted">
        <a
          href={`${BROWSE_URL}/docs`}
          onClick={(e) => {
            e.preventDefault();
            void openElsewhere(`${BROWSE_URL}/docs`, true);
          }}
        >
          ELUM Docs
        </a>
      </span>
    </footer>
  );
}

export function StorePage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="store">
      <StoreHeader />
      <main className={`store-main${className ? ` ${className}` : ''}`}>{children}</main>
      <StoreFooter />
    </div>
  );
}

/** How an app is running right now, from the status check. */
export function HealthPill({ id }: { id: string }) {
  const running = useRunning();
  const h = running.health(id);
  if (!h) return null;
  const words = h.health === 'up' ? 'Working' : h.health === 'slow' ? 'Slow right now' : 'Not answering';
  return (
    <span className={`health health--${h.health}`} title={h.note}>
      <span className="health__dot" aria-hidden="true" />
      {words}
    </span>
  );
}

export function StageTag({ app }: { app: StoreApp }) {
  const mine = useMyApps();
  const stage = mine.stage(app.id);
  if (app.included) return <span className="stage-tag">Included</span>;
  // Only Tune is still marked as being tried out; every other app is ready to use.
  if (stage === 'beta' && app.id === 'tune') return <span className="stage-tag stage-tag--beta">Beta</span>;
  if (stage === 'planned') return <span className="stage-tag stage-tag--soon">Coming soon</span>;
  return <span className="stage-tag">Free</span>;
}

/** Opens an app signed in: in this window, or in an ELUM Browse tab. */
export function openApp(app: StoreApp, where: 'here' | 'browse' | 'window') {
  if (where === 'browse' && app.id !== 'browse') void openElsewhere(`${BROWSE_URL}/app/${app.id}`);
  else void openElsewhere(app.url, where === 'window');
}

/**
 * Get, or Open once they have it. Signed out, Get asks them to sign in and then finishes on the
 * app's page. Apps that are not open yet say so.
 */
export function GetButton({ app, size = 'md' }: { app: StoreApp; size?: 'sm' | 'md' }) {
  const { status } = useAuth();
  const mine = useMyApps();
  const toast = useToast();
  const signIn = useSignIn();
  const [busy, setBusy] = useState(false);
  const sm = size === 'sm' ? ' elum-btn--sm' : '';
  const stage = mine.stage(app.id);

  if (stage === 'planned' || stage === 'retired') {
    return (
      <button type="button" className={`elum-btn elum-btn--secondary${sm}`} disabled>
        Coming soon
      </button>
    );
  }

  if (app.included || mine.has(app.id)) {
    return (
      <span className="get-open">
        <button type="button" className={`elum-btn elum-btn--primary get-btn${sm}`} onClick={() => openApp(app, 'here')}>
          Open
        </button>
        <Menu
          label={`More ways to open ${app.name}`}
          placement="bottom-end"
          trigger={(props) => (
            <button {...props} type="button" className={`elum-btn elum-btn--secondary get-open__more${sm}`} aria-label={`More ways to open ${app.name}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          items={[
            { label: 'Open', onSelect: () => openApp(app, 'here') },
            ...(app.id === 'browse' ? [] : [{ label: 'Open in Browse', hint: app.host, onSelect: () => openApp(app, 'browse') }]),
            { label: 'Open in new window', onSelect: () => openApp(app, 'window') },
          ]}
        />
      </span>
    );
  }

  const get = async () => {
    if (status !== 'signed-in') {
      signIn(`/apps/${app.id}?get=1`);
      return;
    }
    setBusy(true);
    try {
      await mine.get(app.id);
      toast(`${app.name} is in your ELUM account`, { tone: 'success', action: { label: 'Open', onClick: () => openApp(app, 'here') } });
    } catch (e) {
      toast(errorMessage(e), { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" className={`elum-btn elum-btn--primary get-btn${sm}`} onClick={() => void get()} disabled={busy || (status === 'signed-in' && mine.status === 'loading')}>
      {busy ? 'Getting…' : 'Get'}
    </button>
  );
}

/** An app in a grid. */
export function AppCard({ app, index = 0 }: { app: StoreApp; index?: number }) {
  return (
    <li className="app-card" style={{ ...appStyle(app), '--i': index } as CSSProperties}>
      <Link to={`/apps/${app.id}`} className="app-card__link">
        <AppMark id={app.id} size={60} fit />
        <span className="app-card__text">
          <span className="app-card__name">
            {app.name} <StageTag app={app} />
          </span>
          <span className="app-card__kind">{app.kind}</span>
          <span className="app-card__tagline">{app.tagline}</span>
        </span>
      </Link>
      <span className="app-card__action">
        <GetButton app={app} size="sm" />
      </span>
    </li>
  );
}

/** A template's cover, drawn from its look: the shapes of its first page. */
export function TemplateCover({ template }: { template: StoreTemplate }) {
  const { ground, ink, accent, layout, words, sub, font } = template.look;
  const cls = `tpl-cover tpl-cover--${layout}${font ? ` tpl-cover--${font}` : ''}`;
  return (
    <span className={cls} style={{ background: ground, color: ink, '--ratio': template.ratio, '--accent': accent } as CSSProperties} aria-hidden="true">
      {layout === 'title' && (
        <>
          <span className="tpl-cover__accent" />
          <span className="tpl-cover__title">{words}</span>
          {sub && <span className="tpl-cover__sub">{sub}</span>}
        </>
      )}
      {layout === 'lesson' && (
        <>
          <span className="tpl-cover__title">{words}</span>
          {sub && <span className="tpl-cover__sub">{sub}</span>}
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line tpl-cover__line--short" />
          <span className="tpl-cover__disc" />
        </>
      )}
      {layout === 'poster' && (
        <>
          <span className="tpl-cover__title">{words}</span>
          <span className="tpl-cover__accent" />
          {sub && <span className="tpl-cover__sub">{sub}</span>}
        </>
      )}
      {layout === 'quote' && (
        <>
          <span className="tpl-cover__mark">“</span>
          <span className="tpl-cover__title">{words}</span>
          <span className="tpl-cover__line tpl-cover__line--short" />
        </>
      )}
      {layout === 'document' && (
        <>
          <span className="tpl-cover__band">
            <span className="tpl-cover__title">{words}</span>
          </span>
          {[0, 1, 2].map((i) => (
            <span key={i} className="tpl-cover__part">
              <span className="tpl-cover__head" />
              <span className="tpl-cover__line" />
              <span className="tpl-cover__line tpl-cover__line--short" />
            </span>
          ))}
        </>
      )}
      {layout === 'page' && (
        <>
          <span className="tpl-cover__title">{words}</span>
          <span className="tpl-cover__accent" />
          {sub && <span className="tpl-cover__sub">{sub}</span>}
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line tpl-cover__line--short" />
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line tpl-cover__line--short" />
        </>
      )}
      {layout === 'mark' && (
        <>
          <span className="tpl-cover__burst" />
          <span className="tpl-cover__title">{words}</span>
          {sub && <span className="tpl-cover__sub">{sub}</span>}
        </>
      )}
      {layout === 'screen' && (
        <>
          <span className="tpl-cover__chrome" />
          {sub && <span className="tpl-cover__sub">{sub}</span>}
          <span className="tpl-cover__title">{words}</span>
          <span className="tpl-cover__cards">
            <span />
            <span />
            <span />
          </span>
          <span className="tpl-cover__button" />
        </>
      )}
      {layout === 'banner' && (
        <>
          <span className="tpl-cover__bar" />
          <span className="tpl-cover__title">{words}</span>
          {sub && <span className="tpl-cover__sub">{sub}</span>}
        </>
      )}
    </span>
  );
}

export function TemplateCard({ template, index = 0 }: { template: StoreTemplate; index?: number }) {
  const href = templateUrl(template);
  return (
    <li className="tpl-card" data-app={template.app} style={{ '--i': index } as CSSProperties}>
      <a
        href={href}
        className="tpl-card__link"
        onClick={(e) => {
          e.preventDefault();
          void openElsewhere(templateUrl(template, crypto.randomUUID().slice(0, 8)));
        }}
      >
        <span className="tpl-card__frame">
          <TemplateCover template={template} />
        </span>
        <span className="tpl-card__name">{template.name}</span>
        <span className="tpl-card__text muted">{template.description}</span>
        <span className="tpl-card__go">Use in {templateAppName(template)}</span>
      </a>
    </li>
  );
}
