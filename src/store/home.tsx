import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router';
import { StoreMark } from '../components/Brand';
import { safeColor, safeImage, safeLink, useStoreContent } from '../content/content';
import type { AppId, LatestCard, PickCard } from '../content/defaults';
import { APPS, findApp } from './catalog';
import { AppMark, SYMBOLS } from './parts';

const COLOUR: Record<string, { color: string; mist: string }> = Object.fromEntries(APPS.map((a) => [a.id, { color: a.color, mist: a.mist }]));
const nameOf = (id: string) => findApp(id)?.name ?? id;

/**
 * The Store bloom: eight circles, one in each app's colour and each with its own pattern, around
 * the Store mark. Drawn here, so it is sharp at any size and needs no picture.
 */
function StoreBloom() {
  const ids: AppId[] = ['write', 'type', 'make', 'browse', 'inquire', 'tune', 'code', 'capture'];
  const r = 84;
  return (
    <svg className="store-bloom" viewBox="-150 -150 300 300" role="img" aria-label="ELUM Store, with every ELUM app around it">
      <defs>
        {ids.map((id, i) => {
          const c = COLOUR[id]?.color ?? '#7093f8';
          const kind = i % 4;
          return (
            <pattern key={id} id={`bloom-${id}`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform={`rotate(${i * 22})`}>
              <rect width="12" height="12" fill={c} />
              {kind === 0 && <rect width="5" height="12" fill="#ffffff" opacity="0.28" />}
              {kind === 1 && <circle cx="6" cy="6" r="2.6" fill="#ffffff" opacity="0.4" />}
              {kind === 2 && <path d="M0 12 12 0" stroke="#ffffff" strokeWidth="3" opacity="0.32" />}
              {kind === 3 && <circle cx="6" cy="6" r="4.5" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.4" />}
            </pattern>
          );
        })}
        <radialGradient id="bloom-glow">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="140" fill="url(#bloom-glow)" />
      {ids.map((id, i) => {
        const a = (i / ids.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={id}
            className="store-bloom__petal"
            style={{ '--i': i } as CSSProperties}
            cx={Math.cos(a) * r}
            cy={Math.sin(a) * r}
            r={i % 2 ? 40 : 46}
            fill={`url(#bloom-${id})`}
          />
        );
      })}
      <circle r="58" fill="var(--surface)" />
      <circle r="58" fill="none" stroke="var(--store)" strokeWidth="3" />
    </svg>
  );
}

/** The top of Store: the name, the bloom in the middle, and a headline with links. */
export function StoreHeading() {
  const c = useStoreContent('store.hero');
  return (
    <section className="sh-head" aria-labelledby="store-title">
      <h1 id="store-title" className="sh-head__title">
        {c.title}
      </h1>
      <div className="sh-head__art">
        <StoreBloom />
        <span className="sh-head__mark">
          <StoreMark size={64} />
        </span>
      </div>
      <div className="sh-head__side">
        <p className="sh-head__headline">{c.headline}</p>
        <ul className="sh-head__links">
          {c.links.map((l, i) => {
            const href = safeLink(l.url);
            return href && l.label ? (
              <li key={i}>
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">
                  {l.label} <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                </a>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </section>
  );
}

/** One app as a circle with its name under it. */
function AppCircle({ id }: { id: AppId }) {
  const app = findApp(id);
  if (!app) return null;
  return (
    <li className="sh-circle" style={{ '--app': app.color, '--app-mist': app.mist } as CSSProperties}>
      <Link to={`/apps/${id}`} className="sh-circle__link">
        <span className="sh-circle__disc">
          <AppMark id={id} size={56} light />
        </span>
        <span className="sh-circle__name">{app.name}</span>
      </Link>
    </li>
  );
}

/** Every app as a circle, the same number on each side of Store. */
export function AppCircles() {
  const c = useStoreContent('store.row');
  const known = (list: string[]) => list.filter((id): id is AppId => !!findApp(id) && id !== 'account');
  let left = known(c.left);
  let right = known(c.right);
  // Even on both sides, so Store always sits in the middle.
  const n = Math.min(left.length, right.length);
  left = left.slice(0, n);
  right = right.slice(0, n);
  return (
    <nav className="sh-row" aria-label="ELUM apps">
      <ul className="sh-row__list">
        {left.map((id) => (
          <AppCircle key={id} id={id} />
        ))}
        <li className="sh-circle sh-circle--store">
          <a href="#store-all" className="sh-circle__link" aria-label={`${c.centre}: every app in ELUM Store`}>
            <span className="sh-circle__disc">
              <StoreMark size={60} />
            </span>
            <span className="sh-circle__name">{c.centre}</span>
          </a>
        </li>
        {right.map((id) => (
          <AppCircle key={id} id={id} />
        ))}
      </ul>
    </nav>
  );
}

/** A row of cards that scrolls sideways, with back and forward buttons. */
function Shelf({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const el = list.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);
  const move = (dir: 1 | -1) => {
    const el = list.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <section className="sh-shelf" aria-labelledby={id}>
      <h2 id={id} className="sh-shelf__title">
        <strong>{title}</strong> <span>{subtitle}</span>
      </h2>
      <ul className="sh-shelf__list" ref={list} onScroll={update}>
        {children}
      </ul>
      <div className="sh-shelf__nav">
        <button type="button" className="sh-shelf__btn" aria-label={`Back: ${title}`} disabled={edges.start} onClick={() => move(-1)}>
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <button type="button" className="sh-shelf__btn" aria-label={`More: ${title}`} disabled={edges.end} onClick={() => move(1)}>
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}

/** The drawn picture on a latest card: the app's mark large, with circles drifting around it. */
function CardArt({ app }: { app: AppId }) {
  return (
    <span className="sh-art" aria-hidden="true">
      <span className="sh-art__ring sh-art__ring--a" />
      <span className="sh-art__ring sh-art__ring--b" />
      <span className="sh-art__dot sh-art__dot--a" />
      <span className="sh-art__dot sh-art__dot--b" />
      <span className="sh-art__dot sh-art__dot--c" />
      <span className="sh-art__disc">
        <AppMark id={app} size={128} light />
      </span>
    </span>
  );
}

function LatestItem({ card }: { card: LatestCard }) {
  const app = findApp(card.app);
  if (!app) return null;
  const image = safeImage(card.image);
  const style = {
    '--card': safeColor(card.color, app.mist),
    '--band': safeColor(card.band, app.color),
  } as CSSProperties;
  return (
    <li className="sh-latest" style={style}>
      <Link to={`/apps/${app.id}`} className="sh-latest__link">
        <span className="sh-latest__text">
          {card.eyebrow && <span className="sh-latest__eyebrow">{card.eyebrow}</span>}
          <span className="sh-latest__title">{card.title || `ELUM ${app.name}`}</span>
          {card.text && <span className="sh-latest__body">{card.text}</span>}
          {card.note && <span className="sh-latest__note">{card.note}</span>}
        </span>
        <span className="sh-latest__picture">
          {image ? <img src={image} alt="" loading="lazy" /> : <CardArt app={app.id as AppId} />}
        </span>
        <span className="sh-go" aria-hidden="true">
          <ChevronRight size={18} strokeWidth={2.25} />
        </span>
      </Link>
    </li>
  );
}

/** "The latest.": a large colourful card for each app. */
export function LatestShelf() {
  const c = useStoreContent('store.latest');
  return (
    <Shelf id="store-latest" title={c.title} subtitle={c.subtitle}>
      {c.cards.map((card) => (
        <LatestItem key={card.id} card={card} />
      ))}
    </Shelf>
  );
}

const PROMO_SYMBOLS = ['compose', 'star', 'share', 'present', 'saved', 'invite', 'visible', 'link', 'download'] as const;

function PickItem({ card }: { card: PickCard }) {
  const app = findApp(card.app);
  if (!app) return null;
  const to = card.app === 'make' ? '/templates' : `/apps/${app.id}`;
  return (
    <li className="sh-pick" style={{ '--app': app.color, '--app-mist': app.mist } as CSSProperties}>
      <Link to={to} className="sh-pick__link">
        <span className="sh-pick__art" aria-hidden="true">
          <span className="sh-pick__halo" />
          <AppMark id={app.id} size={88} light />
        </span>
        {card.eyebrow && <span className="sh-pick__eyebrow">{card.eyebrow}</span>}
        <span className="sh-pick__title">{card.title}</span>
        {card.text && <span className="sh-pick__body">{card.text}</span>}
        <span className="sh-pick__foot">
          <span className="sh-pick__note">{card.note || `Opens in ELUM ${nameOf(app.id)}`}</span>
          <span className="sh-go" aria-hidden="true">
            <ChevronRight size={18} strokeWidth={2.25} />
          </span>
        </span>
      </Link>
    </li>
  );
}

/** "Make it yours.": a bold card of ELUM symbols in circles, then a card for each kind of template. */
export function PicksShelf() {
  const c = useStoreContent('store.picks');
  return (
    <Shelf id="store-picks" title={c.title} subtitle={c.subtitle}>
      <li className="sh-promo" style={{ '--promo': safeColor(c.promo.color, '#f06a5f') } as CSSProperties}>
        <Link to="/templates" className="sh-promo__link">
          <span className="sh-promo__eyebrow">{c.promo.eyebrow}</span>
          <span className="sh-promo__title">{c.promo.title}</span>
          {c.promo.text && <span className="sh-promo__body">{c.promo.text}</span>}
          <span className="sh-promo__grid" aria-hidden="true">
            {PROMO_SYMBOLS.map((s) => {
              const Icon = SYMBOLS[s];
              return (
                <span key={s} className="sh-promo__disc">
                  <Icon size={30} strokeWidth={1.6} />
                </span>
              );
            })}
          </span>
          <span className="sh-go sh-go--light" aria-hidden="true">
            <ArrowUpRight size={18} strokeWidth={2.25} />
          </span>
        </Link>
      </li>
      {c.cards.map((card) => (
        <PickItem key={card.id} card={card} />
      ))}
    </Shelf>
  );
}
