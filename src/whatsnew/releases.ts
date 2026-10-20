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

/** The releases someone has not seen yet, given the last one they saw. New visitors see the latest. */
export function unseenReleases(releases: Release[], lastSeen: string | null): Release[] {
  if (!releases.length) return [];
  const at = lastSeen ? releases.findIndex((r) => r.id === lastSeen) : -1;
  return at === -1 ? releases.slice(0, 1) : releases.slice(0, at);
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
