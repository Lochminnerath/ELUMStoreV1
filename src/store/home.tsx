import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../auth/AuthProvider';
import { StoreMark } from '../components/Brand';
import { safeColor, safeImage, safeLink, useStoreContent } from '../content/content';
import type { AppId, LatestCard } from '../content/defaults';
import { openElsewhere } from '../lib/elum';
import { findApp, TEMPLATE_KINDS, templateAppName, templateKey, TEMPLATES, templateUrl, type StoreTemplate } from './catalog';
import { AppMark, TemplateCover } from './parts';
import { useMyApps } from './state';

/** Whether an app is already in the signed-in person's ELUM account. */
function useHas() {
  const { status } = useAuth();
  const mine = useMyApps();
  return (id: string) => status === 'signed-in' && mine.status === 'ready' && mine.has(id);
}

/** The top of Store: the name, the Store logo in the middle, and a headline with links. */
export function StoreHeading() {
  const c = useStoreContent('store.hero');
  const { status, user } = useAuth();
  const first = user?.name?.trim().split(/\s+/)[0];
  // Signed in, Store greets them by name; the Console can change the words around it.
  const headline = status === 'signed-in' && first && c.welcome ? c.welcome.replace('{name}', first) : c.headline;
  return (
    <section className="sh-head" aria-labelledby="store-title">
      <h1 id="store-title" className="sh-head__title">
        {c.title}
      </h1>
      <div className="sh-head__art">
        <StoreMark size={200} />
      </div>
      <div className="sh-head__side">
        <p className="sh-head__headline">{headline}</p>
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
function AppCircle({ id, from }: { id: AppId; from: number }) {
  const app = findApp(id);
  const has = useHas();
  if (!app) return null;
  const yours = has(id);
  // `from` is how many places it slides out from Store: positive on the left, negative on the right.
  const style = { '--app': app.color, '--app-mist': app.mist, '--from': from, '--step': Math.abs(from) } as CSSProperties;
  return (
    <li className="sh-circle" style={style}>
      <Link to={`/apps/${id}`} className="sh-circle__link" aria-label={yours ? `${app.name}, in your apps` : app.name}>
        <span className="sh-circle__disc">
          <AppMark id={id} size={72} light fit />
          {yours && (
            <span className="sh-circle__yours" aria-hidden="true">
              <Check size={14} strokeWidth={3} />
            </span>
          )}
        </span>
        <span className="sh-circle__name">{app.name}</span>
      </Link>
    </li>
  );
}

/** Every app as a circle, the same number on each side of Store, sliding out from it along one line. */
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
      <ul className="sh-row__list" style={{ '--count': n * 2 + 1 } as CSSProperties}>
        {left.map((id, i) => (
          <AppCircle key={id} id={id} from={n - i} />
        ))}
        <li className="sh-circle sh-circle--store">
          <a href="#store-all" className="sh-circle__link" aria-label={`${c.centre}: every app in ELUM Store`}>
            <span className="sh-circle__disc">
              <StoreMark size={60} />
            </span>
            <span className="sh-circle__name">{c.centre}</span>
          </a>
        </li>
        {right.map((id, i) => (
          <AppCircle key={id} id={id} from={-(i + 1)} />
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
        <AppMark id={app} size={160} light fit />
      </span>
    </span>
  );
}

function LatestItem({ card }: { card: LatestCard }) {
  const app = findApp(card.app);
  const has = useHas();
  const { status } = useAuth();
  if (!app) return null;
  // Signed out, the card says it is free for ELUM Account users; signed in, it says whether it is theirs.
  const note = status !== 'signed-in' ? card.note : has(app.id) || app.included ? 'In your apps. Open it any time.' : 'Free to add to your account.';
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
          {note && <span className="sh-latest__note">{note}</span>}
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

const KIND_NAME = Object.fromEntries(TEMPLATE_KINDS.map((k) => [k.id, k.name])) as Record<string, string>;

/** One template from Make or Write, at its own shape. It opens the app with the template ready to edit. */
function TemplateItem({ template }: { template: StoreTemplate }) {
  return (
    <li className="sh-tpl">
      <a
        href={templateUrl(template)}
        className="sh-tpl__link"
        onClick={(e) => {
          e.preventDefault();
          void openElsewhere(templateUrl(template, crypto.randomUUID().slice(0, 8)));
        }}
      >
        <span className="sh-tpl__frame" data-app={template.app}>
          <TemplateCover template={template} />
        </span>
        <span className="sh-tpl__kind" data-app={template.app}>
          {KIND_NAME[template.kind]} · ELUM {templateAppName(template)}
        </span>
        <span className="sh-tpl__name">{template.name}</span>
        <span className="sh-tpl__body">{template.description}</span>
        <span className="sh-tpl__foot">
          <span className="sh-tpl__note">Use in ELUM {templateAppName(template)}</span>
          <span className="sh-go" aria-hidden="true">
            <ChevronRight size={18} strokeWidth={2.25} />
          </span>
        </span>
      </a>
    </li>
  );
}

const pick = (app: 'make' | 'write', id: string) => TEMPLATES.find((t) => t.app === app && t.id === id);
/** The three templates fanned out on the red card. */
const FAN = [pick('make', 'event-poster'), pick('make', 'pitch'), pick('write', 'letter')].filter((t): t is StoreTemplate => !!t);
/** The five templates on the home page, from both apps; See more opens the rest. */
const FIVE = [pick('make', 'pitch'), pick('write', 'notes'), pick('make', 'logo'), pick('write', 'resume'), pick('make', 'sale-post')].filter((t): t is StoreTemplate => !!t);

/** "Make it yours.": a bold card with templates fanned out, five templates, then See more. */
export function PicksShelf() {
  const c = useStoreContent('store.picks');
  return (
    <Shelf id="store-picks" title={c.title} subtitle={c.subtitle}>
      <li className="sh-promo" style={{ '--promo': safeColor(c.promo.color, '#f06a5f') } as CSSProperties}>
        <Link to="/templates" className="sh-promo__link">
          <span className="sh-promo__eyebrow">{c.promo.eyebrow}</span>
          <span className="sh-promo__title">{c.promo.title}</span>
          {c.promo.text && <span className="sh-promo__body">{c.promo.text}</span>}
          <span className="sh-promo__fan" aria-hidden="true">
            {FAN.map((t, i) => (
              <span key={templateKey(t)} className={`sh-promo__sheet sh-promo__sheet--${i}`}>
                <TemplateCover template={t} />
              </span>
            ))}
          </span>
          <span className="sh-go sh-go--light" aria-hidden="true">
            <ArrowUpRight size={18} strokeWidth={2.25} />
          </span>
        </Link>
      </li>
      {FIVE.map((t) => (
        <TemplateItem key={templateKey(t)} template={t} />
      ))}
      <li className="sh-more">
        <Link to="/templates" className="sh-more__link">
          <span className="sh-more__stack" aria-hidden="true">
            {TEMPLATES.filter((t) => !FIVE.includes(t))
              .slice(0, 3)
              .map((t, i) => (
                <span key={templateKey(t)} className={`sh-more__sheet sh-more__sheet--${i}`}>
                  <TemplateCover template={t} />
                </span>
              ))}
          </span>
          <span className="sh-more__count">{TEMPLATES.length - FIVE.length} more</span>
          <span className="sh-more__label">
            {c.more} <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
          </span>
        </Link>
      </li>
    </Shelf>
  );
}
