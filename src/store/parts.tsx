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
import { templateUrl, type StoreApp, type StoreTemplate, type Symbol } from './catalog';
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

/** An ELUM app's mark, in light or dark. */
export function AppMark({ id, size }: { id: string; size: number }) {
  return (
    <span className="app-mark" style={{ width: size, height: size }} aria-hidden="true">
      <img className="theme-light-only" src={`/brand/apps/${id}.svg`} width={size} height={size} alt="" />
      <img className="theme-dark-only" src={`/brand/apps/${id}-reversed.svg`} width={size} height={size} alt="" />
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
  if (stage === 'beta') return <span className="stage-tag stage-tag--beta">Beta</span>;
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
        <AppMark id={app.id} size={56} />
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
  const { ground, ink, accent, layout } = template.look;
  return (
    <span className={`tpl-cover tpl-cover--${layout}`} style={{ background: ground, color: ink, '--ratio': template.ratio, '--accent': accent } as CSSProperties} aria-hidden="true">
      {layout === 'title' && (
        <>
          <span className="tpl-cover__accent" />
          <span className="tpl-cover__title">{template.name}</span>
          <span className="tpl-cover__line" />
        </>
      )}
      {layout === 'lesson' && (
        <>
          <span className="tpl-cover__title">Lesson one</span>
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line tpl-cover__line--short" />
          <span className="tpl-cover__disc" />
        </>
      )}
      {layout === 'poster' && (
        <>
          <span className="tpl-cover__title">Big night</span>
          <span className="tpl-cover__accent" />
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line tpl-cover__line--short" />
        </>
      )}
      {layout === 'quote' && (
        <>
          <span className="tpl-cover__mark">“</span>
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line" />
          <span className="tpl-cover__line tpl-cover__line--short" />
        </>
      )}
    </span>
  );
}

export function TemplateCard({ template, index = 0 }: { template: StoreTemplate; index?: number }) {
  const href = templateUrl(template.id);
  return (
    <li className="tpl-card" style={{ '--i': index } as CSSProperties}>
      <a
        href={href}
        className="tpl-card__link"
        onClick={(e) => {
          e.preventDefault();
          void openElsewhere(templateUrl(template.id, crypto.randomUUID().slice(0, 8)));
        }}
      >
        <span className="tpl-card__frame">
          <TemplateCover template={template} />
        </span>
        <span className="tpl-card__name">{template.name}</span>
        <span className="tpl-card__text muted">{template.description}</span>
        <span className="tpl-card__go">Use in Make</span>
      </a>
    </li>
  );
}
