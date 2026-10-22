import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { api } from '../api';
import { useAuth } from '../auth/AuthProvider';
import { StoreMark } from '../components/Brand';
import { APP_NAME, newerSeen, RELEASES, tourSteps, whatsNewFor, type Step } from './releases';
import { Scene } from './scenes';
import './WhatsNew.css';

const SEEN_KEY = 'elum.store.whats-new';
/** The same, kept on the ELUM account so it follows the person to every browser and device. */
const ACCOUNT_KEY = 'whatsnew_store';
const OPEN_EVENT = 'elum:whats-new';
const ACCENT = '#e9b949';

function lastSeen(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

/** Remembers a release as seen, in this browser and on the account. */
function markSeen(id: string | undefined = RELEASES[0]?.id, account = true) {
  if (!id) return;
  try {
    localStorage.setItem(SEEN_KEY, id);
  } catch {
    // The account copy still holds it.
  }
  if (account && api.setUserData) void api.setUserData({ [ACCOUNT_KEY]: id }).catch(() => undefined);
}

async function accountSeen(): Promise<string | null> {
  if (!api.userData) return null;
  try {
    const value = (await api.userData())[ACCOUNT_KEY];
    return typeof value === 'string' ? value : null;
  } catch {
    return null;
  }
}

/** Opens the tour of every release, from a menu. */
export function openWhatsNew() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Shows an animated tour of what changed once after each update, and on request. */
export function WhatsNew() {
  const { status } = useAuth();
  const [steps, setSteps] = useState<Step[] | null>(null);

  useEffect(() => {
    if (status !== 'signed-in') return;
    let live = true;
    void accountSeen().then((onAccount) => {
      if (!live) return;
      const local = lastSeen();
      const seen = newerSeen(RELEASES, onAccount, local);
      const { show, record } = whatsNewFor(RELEASES, seen);
      if (record) markSeen(record);
      else if (seen && (seen !== onAccount || seen !== local)) markSeen(seen, seen !== onAccount);
      if (show.length) setSteps(tourSteps(show));
    });
    return () => {
      live = false;
    };
  }, [status]);

  useEffect(() => {
    const open = () => setSteps(tourSteps(RELEASES));
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (!steps) return null;
  return (
    <Tour
      steps={steps}
      onClose={() => {
        markSeen();
        setSteps(null);
      }}
    />
  );
}

function Tour({ steps, onClose }: { steps: Step[]; onClose(): void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'next' | 'back'>('next');
  const [leaving, setLeaving] = useState(false);
  const swipe = useRef<number | null>(null);
  const last = index === steps.length - 1;
  const step = steps[index];

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    next.current?.focus();
  }, []);

  const close = () => {
    if (leaving) return;
    setLeaving(true);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(onClose, reduced ? 0 : 260);
  };
  const go = (to: number) => {
    if (to < 0 || to >= steps.length || to === index) return;
    setDir(to > index ? 'next' : 'back');
    setIndex(to);
  };

  return (
    <dialog
      ref={ref}
      className="wn"
      data-leaving={leaving || undefined}
      aria-labelledby="wn-title"
      aria-describedby="wn-text"
      style={{ '--wn-accent': ACCENT } as CSSProperties}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === ref.current && close()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        else if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      <div
        className="wn__card"
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="wn__hero">
          <div className="wn__aurora" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="wn__scene" key={step.key}>
            <Scene art={step.art} mark={<StoreMark size={150} />} />
          </div>
          <button type="button" className="wn__close" aria-label={`Close What's new in ${APP_NAME}`} onClick={close}>
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="wn__body">
          <div className="wn__copy" key={step.key} data-dir={dir}>
            <p className="wn__eyebrow">{step.eyebrow}</p>
            <h2 className="wn__title" id="wn-title">
              {step.title}
            </h2>
            <p className="wn__text" id="wn-text">
              {step.text}
            </p>
          </div>

          <div className="wn__footer">
            <div className="wn__dots" role="tablist" aria-label="Steps">
              {steps.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  className="wn__dot"
                  aria-selected={i === index}
                  aria-label={`Step ${i + 1} of ${steps.length}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <div className="wn__actions">
              {index > 0 && (
                <button type="button" className="elum-btn elum-btn--secondary wn__back" onClick={() => go(index - 1)}>
                  <ArrowLeft size={16} strokeWidth={1.9} /> Back
                </button>
              )}
              <button ref={next} type="button" className="elum-btn elum-btn--primary wn__next" onClick={() => (last ? close() : go(index + 1))}>
                {last ? `Start using ${APP_NAME}` : 'Next'}
                {!last && <ArrowRight size={16} strokeWidth={1.9} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
