import type { Art } from './scenes';

/**
 * What changed in Store, newest first. Add a release at the top whenever an update ships: people
 * get a short animated tour of it the next time they open Store, and can replay every release
 * from the account menu (What's new). Give each release a new id; the date is shown as written.
 *
 * Each feature is one step of the tour. `art` picks its animated picture (see scenes.tsx):
 * mark, share, devices, layers, check or spark.
 */

export interface Feature {
  title: string;
  text: string;
  art: Art;
}

export interface Release {
  /** Unique and never reused, such as 2026-10-18. */
  id: string;
  date: string;
  title: string;
  /** One or two sentences under the title on the opening step. */
  intro: string;
  features: Feature[];
}

export const APP_NAME = 'Store';

export const RELEASES: Release[] = [
  {
    id: '2026-10-22',
    date: '22 October 2026',
    title: 'Tune is coming',
    intro: 'Music is on its way to ELUM. Tune is the music app we’re making for you, without AI.',
    features: [
      { title: 'Meet Tune', text: 'Play what you love and keep it in playlists you put together yourself. Find it under Coming soon on Store’s home page.', art: 'mark' },
      { title: 'Hear first', text: 'Tap Notify me on Tune’s page and we’ll let you know the day it opens.', art: 'check' },
      { title: 'Smoother Store', text: 'Pages ease in, cards lift when you point at them, and your apps show a gentle placeholder while they load.', art: 'spark' },
    ],
  },
  {
    id: '2026-10-20',
    date: '20 October 2026',
    title: 'ELUM Store is here',
    intro: 'Every ELUM app in one place, ready for your ELUM account. Made by you. Runs without AI.',
    features: [
      { title: 'Every ELUM app', text: 'Write, Type, Make, Browse and your Account, each with what it does, what is new and how it is running today.', art: 'mark' },
      { title: 'Get it in one click', text: 'Get adds an app to your ELUM account. Open takes you there already signed in, in this window or in Browse.', art: 'check' },
      { title: 'Templates for Make', text: 'Start a pitch deck, a lesson, a poster or a post straight from Store. Make opens with it ready to edit.', art: 'layers' },
      { title: 'Your apps', text: 'See the apps you have and when you last used them, on your phone or your computer.', art: 'devices' },
    ],
  },
];

/** The newer of two release ids, by their place in the list (newest first). Unknown ids lose. */
export function newerSeen(releases: Release[], a: string | null, b: string | null): string | null {
  const at = (id: string | null) => (id ? releases.findIndex((r) => r.id === id) : -1);
  const ia = at(a);
  const ib = at(b);
  if (ia === -1) return ib === -1 ? (a ?? b) : b;
  if (ib === -1) return a;
  return ia <= ib ? a : b;
}

/**
 * What to show, given the last release someone saw, and what to remember as seen without showing.
 * Someone with nothing recorded (new, or never had this kept) is shown nothing: we quietly record
 * the latest, so the tour only ever brings news. An id we no longer know shows the latest release.
 */
export function whatsNewFor(releases: Release[], lastSeen: string | null): { show: Release[]; record: string | null } {
  const latest = releases[0]?.id ?? null;
  if (!latest) return { show: [], record: null };
  if (!lastSeen) return { show: [], record: latest };
  const at = releases.findIndex((r) => r.id === lastSeen);
  if (at === 0) return { show: [], record: null };
  return { show: at === -1 ? releases.slice(0, 1) : releases.slice(0, at), record: null };
}

export interface Step {
  key: string;
  eyebrow: string;
  title: string;
  text: string;
  art: Art;
}

/** The tour for some releases: each opens with its title, then one step per feature. */
export function tourSteps(releases: Release[]): Step[] {
  return releases.flatMap((r) => [
    { key: `${r.id}:intro`, eyebrow: `New in ${APP_NAME} · ${r.date}`, title: r.title, text: r.intro, art: 'mark' as const },
    ...r.features.map((f, i) => ({ key: `${r.id}:${i}`, eyebrow: r.title, title: f.title, text: f.text, art: f.art })),
  ]);
}
