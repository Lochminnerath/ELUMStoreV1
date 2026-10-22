import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { errorMessage } from '../api';
import { useAuth } from '../auth/AuthProvider';
import { StoreMark } from '../components/Brand';
import { useToast } from '../components/Toast';
import { formatWhenInline } from '../lib/time';
import { APPS, findApp, isSoon, LIVE_APPS, searchCatalog, SOON_APPS, TEMPLATE_KINDS, TEMPLATES, type TemplateKind } from './catalog';
import { AppCard, AppMark, appStyle, GetButton, HealthPill, openApp, StageTag, StorePage, SYMBOLS, TemplateCard, useTitle } from './parts';
import { useMyApps } from './state';
import './store.css';

/** /: what Store has, with the person's own apps first once they are signed in. */
export function HomePage() {
  useTitle('ELUM Store');
  const { status } = useAuth();
  const mine = useMyApps();
  const featured = LIVE_APPS.filter((a) => a.featured);
  const yours = LIVE_APPS.filter((a) => a.included || mine.has(a.id));

  return (
    <StorePage>
      <section className="store-hero">
        <div className="store-hero__text">
          <p className="store-eyebrow">ELUM Store</p>
          <h1>Every ELUM app, in one place.</h1>
          <p className="store-lede">They’re all free with your ELUM account. Made by you. Runs without AI.</p>
        </div>
        <div className="store-hero__art" aria-hidden="true">
          <span className="store-orbit">
            {LIVE_APPS.map((a, i) => (
              <span key={a.id} className="store-orbit__disc" style={{ '--i': i, '--n': LIVE_APPS.length } as CSSProperties}>
                <AppMark id={a.id} size={48} />
              </span>
            ))}
            <span className="store-orbit__centre">
              <StoreMark size={88} />
            </span>
          </span>
        </div>
      </section>

      <section aria-labelledby="store-featured" className="store-section">
        <h2 id="store-featured" className="store-h2">
          New in ELUM
        </h2>
        <ul className="feature-row">
          {featured.map((a, i) => (
            <li key={a.id} className="feature-card" style={{ ...appStyle(a), '--i': i } as CSSProperties}>
              <Link to={`/apps/${a.id}`} className="feature-card__link">
                <AppMark id={a.id} size={72} />
                <span className="feature-card__kind">{a.kind}</span>
                <span className="feature-card__name">ELUM {a.name}</span>
                <span className="feature-card__about">{a.tagline}</span>
              </Link>
              <span className="feature-card__action">
                <GetButton app={a} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {status === 'signed-in' && yours.length > 0 && (
        <section aria-labelledby="store-yours" className="store-section">
          <div className="store-h2-row">
            <h2 id="store-yours" className="store-h2">
              Your apps
            </h2>
            <Link to="/library" className="store-more">
              See all
            </Link>
          </div>
          <ul className="your-row">
            {yours.map((a) => (
              <li key={a.id} style={appStyle(a)}>
                <button type="button" className="your-app" onClick={() => openApp(a, 'here')}>
                  <AppMark id={a.id} size={48} />
                  <span>{a.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {SOON_APPS.length > 0 && (
        <section aria-labelledby="store-soon" className="store-section">
          <h2 id="store-soon" className="store-h2">
            Coming soon
          </h2>
          <ul className="soon-row">
            {SOON_APPS.map((a, i) => (
              <li key={a.id} className="soon-card" style={{ ...appStyle(a), '--i': i } as CSSProperties}>
                <Link to={`/apps/${a.id}`} className="soon-card__link">
                  <SoonTeaser id={a.id} size={84} />
                  <span className="soon-card__text">
                    <span className="feature-card__kind">{a.kind}</span>
                    <span className="feature-card__name">ELUM {a.name}</span>
                    <span className="feature-card__about">{a.teaser ?? a.tagline}</span>
                  </span>
                </Link>
                <span className="soon-card__action">
                  <GetButton app={a} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="store-all" className="store-section">
        <h2 id="store-all" className="store-h2">
          Every ELUM app
        </h2>
        <ul className="app-grid">
          {LIVE_APPS.map((a, i) => (
            <AppCard key={a.id} app={a} index={i} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="store-templates" className="store-section">
        <div className="store-h2-row">
          <h2 id="store-templates" className="store-h2">
            Templates for Make
          </h2>
          <Link to="/templates" className="store-more">
            See all
          </Link>
        </div>
        <ul className="tpl-grid">
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={t.id} template={t} index={i} />
          ))}
        </ul>
      </section>
    </StorePage>
  );
}

/** /apps/:id: one app, and getting it. /apps/:id?get=1 gets it straight away (after signing in). */
export function AppPage() {
  const { id } = useParams();
  const app = findApp(id);
  useTitle(app ? `ELUM ${app.name} · ELUM Store` : 'ELUM Store');
  const { status } = useAuth();
  const mine = useMyApps();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const wantsGet = params.get('get') === '1';
  const tried = useRef(false);

  // Back from signing in to get it: get it now, once.
  useEffect(() => {
    if (!app || !wantsGet || status !== 'signed-in' || mine.status !== 'ready' || tried.current) return;
    tried.current = true;
    setParams({}, { replace: true });
    if (isSoon(app) || app.included || mine.has(app.id) || mine.stage(app.id) === 'planned') return;
    mine.get(app.id).then(
      () => toast(`${app.name} is in your ELUM account`, { tone: 'success', action: { label: 'Open', onClick: () => openApp(app, 'here') } }),
      (e) => toast(errorMessage(e), { tone: 'error' }),
    );
  }, [app, wantsGet, status, mine, setParams, toast]);

  if (!app) return <Navigate to="/" replace />;
  const others = APPS.filter((a) => a.id !== app.id);
  const soon = isSoon(app);

  return (
    <StorePage className="app-page">
      <div style={appStyle(app)}>
        <section className="app-hero">
          <span className="app-hero__art" aria-hidden="true">
            {soon ? (
              <SoonTeaser id={app.id} size={120} />
            ) : (
              <>
                <span className="app-hero__ring" />
                <AppMark id={app.id} size={120} />
              </>
            )}
          </span>
          <div className="app-hero__text">
            <p className="store-eyebrow app-hero__kind">{app.kind}</p>
            <h1>
              ELUM {app.name} <StageTag app={app} />
            </h1>
            <p className="store-lede">{app.tagline}</p>
            {soon && <p className="app-hero__soon">We’re still making it. Tap Notify me and we’ll tell you the day it opens.</p>}
            <div className="app-hero__actions">
              <GetButton app={app} />
              <HealthPill id={app.id} />
            </div>
          </div>
        </section>

        <div className="app-body">
          <div className="app-body__main">
            <section aria-labelledby="app-about" className="store-section">
              <h2 id="app-about" className="store-h2">
                About {app.name}
              </h2>
              <p className="app-about">{app.about}</p>
            </section>

            <section aria-labelledby="app-highlights" className="store-section">
              <h2 id="app-highlights" className="store-h2">
                {soon ? 'What it will do' : 'What it does'}
              </h2>
              <ul className="highlights">
                {app.highlights.map((h) => {
                  const Icon = SYMBOLS[h.symbol];
                  return (
                    <li key={h.title} className="highlight">
                      <span className="highlight__icon">
                        <Icon size={26} />
                      </span>
                      <h3>{h.title}</h3>
                      <p>{h.text}</p>
                    </li>
                  );
                })}
              </ul>
            </section>

            {app.id === 'make' && (
              <section aria-labelledby="app-templates" className="store-section">
                <h2 id="app-templates" className="store-h2">
                  Start from a template
                </h2>
                <ul className="tpl-grid">
                  {TEMPLATES.map((t, i) => (
                    <TemplateCard key={t.id} template={t} index={i} />
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="app-facts" aria-label={`About ELUM ${app.name}`}>
            <dl>
              <div>
                <dt>Price</dt>
                <dd>Free with your ELUM account</dd>
              </div>
              {soon ? (
                <div>
                  <dt>When</dt>
                  <dd>Coming soon. We’ll let you know</dd>
                </div>
              ) : (
                <div>
                  <dt>Address</dt>
                  <dd>{app.host}</dd>
                </div>
              )}
              <div>
                <dt>Works on</dt>
                <dd>Any up-to-date browser, on your computer or your phone</dd>
              </div>
              <div>
                <dt>AI</dt>
                <dd>None. Made by you. Runs without AI.</dd>
              </div>
              <div>
                <dt>Your data</dt>
                <dd>Kept in your ELUM account, never sold</dd>
              </div>
            </dl>
            <h2 className="app-facts__h">What’s new</h2>
            <ul className="app-news">
              {app.news.map((n) => (
                <li key={n.text}>
                  <span className="muted">{n.date}</span>
                  {n.text}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <section aria-labelledby="app-more" className="store-section">
        <h2 id="app-more" className="store-h2">
          More ELUM apps
        </h2>
        <ul className="app-grid">
          {others.map((a, i) => (
            <AppCard key={a.id} app={a} index={i} />
          ))}
        </ul>
      </section>
    </StorePage>
  );
}

/** /templates: every template, by kind. */
export function TemplatesPage() {
  useTitle('Templates · ELUM Store');
  const [kind, setKind] = useState<TemplateKind | 'all'>('all');
  const shown = kind === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.kind === kind);
  return (
    <StorePage>
      <section className="store-intro">
        <p className="store-eyebrow">Templates</p>
        <h1>Start something in Make</h1>
        <p className="store-lede">Pick a template and Make opens it for you, ready for your own words and colours.</p>
      </section>
      <div className="segmented store-filter" role="group" aria-label="Kind of template">
        {[{ id: 'all' as const, name: 'All' }, ...TEMPLATE_KINDS].map((k) => (
          <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
            {k.name}
          </button>
        ))}
      </div>
      <ul className="tpl-grid tpl-grid--wide">
        {shown.map((t, i) => (
          <TemplateCard key={t.id} template={t} index={i} />
        ))}
      </ul>
    </StorePage>
  );
}

/** /library: the apps they have, and when they last used each. */
export function LibraryPage() {
  useTitle('Your apps · ELUM Store');
  const mine = useMyApps();
  const navigate = useNavigate();
  const yours = LIVE_APPS.filter((a) => a.included || mine.has(a.id));
  const rest = LIVE_APPS.filter((a) => !a.included && !mine.has(a.id));

  return (
    <StorePage>
      <section className="store-intro">
        <p className="store-eyebrow">Your account</p>
        <h1>Your apps</h1>
        <p className="store-lede">These are the apps in your ELUM account. Open any of them here or in Browse, already signed in.</p>
      </section>
      {mine.status === 'loading' && yours.length <= 1 ? (
        <ul className="library" aria-busy="true" aria-label="Finding your apps">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="library__row library__row--skeleton" style={{ '--i': i } as CSSProperties}>
              <span className="skeleton skeleton--mark" />
              <span className="library__skeleton-text">
                <span className="skeleton skeleton--line" />
                <span className="skeleton skeleton--line skeleton--short" />
              </span>
              <span className="skeleton skeleton--button" />
            </li>
          ))}
        </ul>
      ) : mine.status === 'error' ? (
        <div className="empty-state">
          <h2>We couldn’t load your apps</h2>
          <p>Check your connection and try again.</p>
          <button type="button" className="elum-btn elum-btn--primary" onClick={() => mine.refresh()}>
            Try again
          </button>
        </div>
      ) : (
        <ul className="library">
          {yours.map((a) => {
            const seen = mine.lastSeen(a.id);
            return (
              <li key={a.id} className="library__row" style={appStyle(a)}>
                <button type="button" className="library__app" onClick={() => navigate(`/apps/${a.id}`)}>
                  <AppMark id={a.id} size={44} />
                  <span>
                    <span className="library__name">ELUM {a.name}</span>
                    <span className="library__seen muted">{a.included ? 'Comes with every account' : seen ? `Last used ${formatWhenInline(seen)}` : 'Not opened yet'}</span>
                  </span>
                </button>
                <HealthPill id={a.id} />
                <GetButton app={a} size="sm" />
              </li>
            );
          })}
        </ul>
      )}
      {rest.length > 0 && mine.status === 'ready' && (
        <section aria-labelledby="library-more" className="store-section">
          <h2 id="library-more" className="store-h2">
            You might like
          </h2>
          <ul className="app-grid">
            {rest.map((a, i) => (
              <AppCard key={a.id} app={a} index={i} />
            ))}
          </ul>
        </section>
      )}
    </StorePage>
  );
}

/** /search?q=: apps and templates that match. */
export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  useTitle(q ? `${q} · ELUM Store` : 'ELUM Store');
  const found = searchCatalog(q);
  const none = !found.apps.length && !found.templates.length;
  return (
    <StorePage>
      <section className="store-intro">
        <p className="store-eyebrow">Search</p>
        <h1>{q ? `Results for “${q}”` : 'Everything in Store'}</h1>
      </section>
      {none ? (
        <div className="empty-state">
          <StoreMark size={64} />
          <h2>Nothing in Store matches that</h2>
          <p>Try another word, like slides, mail or search.</p>
          <Link to="/" className="elum-btn elum-btn--primary">
            See every app
          </Link>
        </div>
      ) : (
        <>
          {found.apps.length > 0 && (
            <section aria-labelledby="found-apps" className="store-section">
              <h2 id="found-apps" className="store-h2">
                Apps
              </h2>
              <ul className="app-grid">
                {found.apps.map((a, i) => (
                  <AppCard key={a.id} app={a} index={i} />
                ))}
              </ul>
            </section>
          )}
          {found.templates.length > 0 && (
            <section aria-labelledby="found-templates" className="store-section">
              <h2 id="found-templates" className="store-h2">
                Templates for Make
              </h2>
              <ul className="tpl-grid">
                {found.templates.map((t, i) => (
                  <TemplateCard key={t.id} template={t} index={i} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </StorePage>
  );
}

/**
 * A coming-soon app's mark, gently pulsing with sound-wave rings around it. Still for anyone who
 * prefers less motion.
 */
function SoonTeaser({ id, size }: { id: string; size: number }) {
  return (
    <span className="soon-teaser" style={{ '--size': `${size}px` } as CSSProperties} aria-hidden="true">
      <span className="soon-teaser__wave" />
      <span className="soon-teaser__wave" />
      <span className="soon-teaser__wave" />
      <span className="soon-teaser__mark">
        <AppMark id={id} size={size} />
      </span>
    </span>
  );
}

export function NotFound() {
  useTitle('ELUM Store');
  return (
    <StorePage>
      <div className="empty-state store-center">
        <StoreMark size={72} />
        <h2>We could not find that page</h2>
        <p>The link may be wrong, or the page may have moved.</p>
        <Link to="/" className="elum-btn elum-btn--primary">
          Go to Store
        </Link>
      </div>
    </StorePage>
  );
}
