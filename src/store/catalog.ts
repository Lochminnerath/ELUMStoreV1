import { ACCOUNT_HOME, BROWSE_URL, MAKE_URL, TYPE_URL, WRITE_URL } from '../lib/elum';

/**
 * What ELUM Store offers: the ELUM apps, and templates for Make. Words and links only; whether
 * someone has an app comes from the platform (api.myApps), and whether it is running from the
 * elum-status function. Keep every line to something the app does today.
 */

export type AppId = 'write' | 'type' | 'make' | 'browse' | 'account';

/** Which ELUM symbol a highlight shows (see components/icons/ElumIcons.tsx). */
export type Symbol = 'compose' | 'download' | 'duplicate' | 'saved' | 'verified' | 'spam' | 'archive' | 'private' | 'present' | 'visible' | 'open' | 'star' | 'invite' | 'warning' | 'share' | 'link';

export interface Highlight {
  symbol: Symbol;
  title: string;
  text: string;
}

export interface StoreApp {
  id: AppId;
  name: string;
  /** The app's brand colour, and its pale wash. */
  color: string;
  mist: string;
  /** What it is, in a few words. */
  kind: string;
  /** One line for its card. */
  tagline: string;
  /** A short paragraph for its page. */
  about: string;
  /** Where it lives. */
  url: string;
  /** Its address on elum.services. */
  host: string;
  /**
   * Comes with every ELUM account, so there is nothing to get (ELUM Account). Everything else
   * is added to the account with Get.
   */
  included?: boolean;
  /** Shown first on Store's home page. */
  featured?: boolean;
  highlights: Highlight[];
  /** What is new in it, newest first. */
  news: { date: string; text: string }[];
}

export const APPS: StoreApp[] = [
  {
    id: 'make',
    name: 'Make',
    color: '#ec7fa9',
    mist: '#fceaf1',
    kind: 'Slides and posts',
    tagline: 'Slides, posters and posts on a real canvas.',
    about: 'Design presentations, posters, flyers and social posts on a canvas that snaps things into line. Present full screen, share with anyone who has an ELUM account, or download PNG and PDF.',
    url: MAKE_URL,
    host: 'make.elum.services',
    featured: true,
    highlights: [
      { symbol: 'present', title: 'Present', text: 'Fills the screen until you press Esc. Arrows, space or a click move through your pages.' },
      { symbol: 'duplicate', title: 'Pages and layers', text: 'Duplicate, reorder and delete pages, with speaker notes, and keep elements in order with layers.' },
      { symbol: 'compose', title: 'Your words, your colours', text: 'Double-click any text to edit it, and pick any colour from the wheel or by its code.' },
      { symbol: 'download', title: 'Download', text: 'Save a page as PNG or the whole design as PDF.' },
    ],
    news: [
      { date: '20 October 2026', text: 'Edit text in place and keep your own colours.' },
      { date: '20 October 2026', text: 'Deleting a design now removes its pictures too.' },
    ],
  },
  {
    id: 'browse',
    name: 'Browse',
    color: '#9b84ee',
    mist: '#f2eefd',
    kind: 'Search and the web',
    tagline: 'The web, with Google results and no AI answers.',
    about: 'Search the web with results from Google, without AI Overviews or Gemini. Pages open in Browse tabs, with tab groups you can name, colour and mark with a symbol, and every ELUM app a word away.',
    url: BROWSE_URL,
    host: 'browse.elum.services',
    featured: true,
    highlights: [
      { symbol: 'visible', title: 'Just the web', text: 'Results from Google, without AI Overviews or Gemini.' },
      { symbol: 'open', title: 'Pages stay in Browse', text: 'Results and typed addresses open in a Browse tab, or as a clean reading view when a site refuses.' },
      { symbol: 'star', title: 'Tabs and groups', text: 'Group tabs, then give the group a name, a colour and a symbol.' },
      { symbol: 'private', title: 'Your searches, your device', text: 'Recent searches stay on this device only. Forget them at any time.' },
    ],
    news: [
      { date: '20 October 2026', text: 'Web pages now open inside Browse tabs.' },
      { date: '20 October 2026', text: 'Tab groups with colours and symbols.' },
    ],
  },
  {
    id: 'write',
    name: 'Write',
    color: '#f59a52',
    mist: '#fdf0e4',
    kind: 'Documents',
    tagline: 'Documents that save as you type.',
    about: 'Write documents that save as you type and look the same on every device. Shape them with styles, lists, pictures and citations, then share them and talk it over in comments.',
    url: WRITE_URL,
    host: 'write.elum.services',
    highlights: [
      { symbol: 'compose', title: 'Styles and citations', text: 'Headings, quotes, lists and checklists, and citations Write keeps in step.' },
      { symbol: 'share', title: 'Share and comment', text: 'Share with anyone who has an ELUM account and reply to comments in threads.' },
      { symbol: 'download', title: 'Download and print', text: 'Save a copy as PDF, plain text or a web page, or print it as it looks on screen.' },
      { symbol: 'saved', title: 'Saved everywhere', text: 'Every change is saved to your account. Pick it up on your phone.' },
    ],
    news: [{ date: '20 October 2026', text: 'Open Browse from the apps window.' }],
  },
  {
    id: 'type',
    name: 'Type',
    color: '#3fc4a0',
    mist: '#e4f7f1',
    kind: 'Messages and email',
    tagline: 'Messages and email in one calm inbox.',
    about: 'Messages and email together, with your own ELUM Type address. Read whole conversations in one place, keep spam out, and approve new sign-ins from a device you trust.',
    url: TYPE_URL,
    host: 'type.elum.services',
    highlights: [
      { symbol: 'verified', title: 'From ELUM', text: 'Messages from other ELUM accounts carry the verified symbol.' },
      { symbol: 'spam', title: 'Spam stays out', text: 'Report spam and it leaves your inbox. Not spam brings it back.' },
      { symbol: 'archive', title: 'Views for everything', text: 'Inbox, Unread, Archived, Spam and Trash, a click apart.' },
      { symbol: 'private', title: 'Approve new sign-ins', text: 'Pick the matching number before a new device gets in.' },
    ],
    news: [{ date: '20 October 2026', text: 'Open Browse from the apps window.' }],
  },
  {
    id: 'account',
    name: 'Account',
    color: '#94c858',
    mist: '#eef7e4',
    kind: 'You, everywhere',
    tagline: 'One account for every ELUM app.',
    about: 'Your name and picture, the people you know, and how you sign in, in one place for every ELUM app. Every ELUM account comes with it.',
    url: ACCOUNT_HOME,
    host: 'account.elum.services',
    included: true,
    highlights: [
      { symbol: 'private', title: 'Security', text: 'Approve new sign-ins and sign out devices you no longer use.' },
      { symbol: 'invite', title: 'People and circles', text: 'Sort the people you know into circles such as Family, Friends and Work.' },
      { symbol: 'star', title: 'Preferences', text: 'Your time format, first day of the week, the app you start in, and how much motion you like.' },
      { symbol: 'warning', title: 'You stay in charge', text: 'Choose who can see your picture and find you, and delete your account whenever you choose.' },
    ],
    news: [{ date: '20 October 2026', text: 'Choose Browse as the app you start in.' }],
  },
];

export function findApp(id: string | undefined): StoreApp | null {
  return APPS.find((a) => a.id === id) ?? null;
}

// ------------------------------------------------------------------ templates

export type TemplateKind = 'presentation' | 'poster' | 'social';

/**
 * Templates for Make, by the ids Make knows (ELUMMakeV1 src/editor/templates.ts). "Use in Make"
 * opens Make with ?template=<id>&from=<click>, and Make starts a new design from it, once per click.
 */
export interface StoreTemplate {
  id: string;
  name: string;
  description: string;
  kind: TemplateKind;
  /** Width over height. */
  ratio: number;
  /** How its cover looks, for the card: the ground, the ink, and the accent. */
  look: { ground: string; ink: string; accent: string; layout: 'title' | 'lesson' | 'poster' | 'quote' };
}

export const TEMPLATE_KINDS: { id: TemplateKind; name: string }[] = [
  { id: 'presentation', name: 'Presentations' },
  { id: 'poster', name: 'Posters' },
  { id: 'social', name: 'Social posts' },
];

export const TEMPLATES: StoreTemplate[] = [
  {
    id: 'pitch',
    name: 'Pitch deck',
    description: 'A title, the problem, the idea and next steps.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: 'linear-gradient(135deg, #141a2e, #3b5bd6)', ink: '#ffffff', accent: '#ec7fa9', layout: 'title' },
  },
  {
    id: 'lesson',
    name: 'Lesson slides',
    description: 'Clean slides for teaching or a talk.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#ec7fa9', layout: 'lesson' },
  },
  {
    id: 'event-poster',
    name: 'Event poster',
    description: 'Bold heading, date and place.',
    kind: 'poster',
    ratio: 0.707,
    look: { ground: 'linear-gradient(160deg, #ec7fa9, #f59a52)', ink: '#ffffff', accent: '#141a2e', layout: 'poster' },
  },
  {
    id: 'quote-post',
    name: 'Quote post',
    description: 'A square post for a quote or announcement.',
    kind: 'social',
    ratio: 1,
    look: { ground: '#fdeef4', ink: '#141a2e', accent: '#ec7fa9', layout: 'quote' },
  },
];

/**
 * The address that opens Make with a template ready to edit. `click` names this one click, so Make
 * makes one design for it even if Back brings the address round again.
 */
export function templateUrl(id: string, click?: string): string {
  const query = new URLSearchParams({ template: id });
  if (click) query.set('from', click);
  return `${MAKE_URL}/?${query.toString()}`;
}

// --------------------------------------------------------------------- search

/** Apps and templates whose words match every word of the query, in catalogue order. */
export function searchCatalog(query: string): { apps: StoreApp[]; templates: StoreTemplate[] } {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return { apps: APPS, templates: TEMPLATES };
  const matches = (text: string) => words.every((w) => text.toLowerCase().includes(w));
  return {
    apps: APPS.filter((a) => matches([a.name, a.kind, a.tagline, a.about, ...a.highlights.map((h) => h.title)].join(' '))),
    templates: TEMPLATES.filter((t) => matches([t.name, t.description, t.kind, 'template make'].join(' '))),
  };
}
