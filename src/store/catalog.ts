import { ACCOUNT_HOME, BROWSE_URL, INQUIRE_URL, MAKE_URL, TYPE_URL, WRITE_URL } from '../lib/elum';

/**
 * What ELUM Store offers: the ELUM apps, and templates for Make. Words and links only; whether
 * someone has an app comes from the platform (api.myApps), and whether it is running from the
 * elum-status function. Keep every line to something the app does today.
 */

export type AppId = 'write' | 'type' | 'make' | 'browse' | 'inquire' | 'account' | 'tune';

/**
 * Where an app is: 'live' can be got and opened; 'soon' is announced but not open yet, so it has
 * Notify me instead of Get or Open, and never counts as one of someone's apps.
 */
export type AppStatus = 'live' | 'soon';

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
  /** 'live' when left out. */
  status?: AppStatus;
  /** For apps coming soon: a sentence on what it will be, shown under Coming soon on Home. */
  teaser?: string;
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
    tagline: 'Design slides, posters and social posts.',
    about: 'Make is for presentations, posters, flyers and social posts. Design on a canvas that helps you line everything up, then present full screen, share with anyone on ELUM, or download a PNG or PDF.',
    url: MAKE_URL,
    host: 'make.elum.services',
    featured: true,
    highlights: [
      { symbol: 'present', title: 'Present', text: 'Your slides fill the screen until you press Esc. Use the arrow keys, the space bar or a click to move on.' },
      { symbol: 'duplicate', title: 'Pages and layers', text: 'Duplicate, reorder and delete pages, add speaker notes, and keep everything in order with layers.' },
      { symbol: 'compose', title: 'Your words, your colours', text: 'Double-click any text to edit it, and choose any colour from the wheel or by typing its code.' },
      { symbol: 'download', title: 'Download', text: 'Save a page as a PNG or the whole design as a PDF.' },
    ],
    news: [
      { date: '20 October 2026', text: 'You can now edit text right on the page and save your own colours.' },
      { date: '20 October 2026', text: 'Deleting a design now deletes its pictures too.' },
    ],
  },
  {
    id: 'browse',
    name: 'Browse',
    color: '#9b84ee',
    mist: '#f2eefd',
    kind: 'Search and the web',
    tagline: 'Search the web without the AI.',
    about: 'Browse searches the web with results from Google, without AI Overviews or Gemini. Pages open in tabs you can sort into named, colour-coded groups, and you can open any ELUM app just by typing its name.',
    url: BROWSE_URL,
    host: 'browse.elum.services',
    featured: true,
    highlights: [
      { symbol: 'visible', title: 'Just the web', text: 'You get Google’s results without AI Overviews or Gemini.' },
      { symbol: 'open', title: 'Pages stay in Browse', text: 'Results and addresses you type open in a Browse tab. If a site won’t allow that, you get a clean reading view instead.' },
      { symbol: 'star', title: 'Tabs and groups', text: 'Put tabs into groups and give each group a name, a colour and a symbol.' },
      { symbol: 'private', title: 'Your searches stay with you', text: 'Recent searches are kept on this device only, and you can clear them whenever you like.' },
    ],
    news: [
      { date: '20 October 2026', text: 'Web pages now open right inside Browse tabs.' },
      { date: '20 October 2026', text: 'New tab groups, with colours and symbols.' },
    ],
  },
  {
    id: 'write',
    name: 'Write',
    color: '#f59a52',
    mist: '#fdf0e4',
    kind: 'Documents',
    tagline: 'Documents that save as you type.',
    about: 'Write is for documents that save as you type and look the same on every device. Shape them with styles, lists, pictures and citations, then share them and talk things through in comments.',
    url: WRITE_URL,
    host: 'write.elum.services',
    highlights: [
      { symbol: 'compose', title: 'Styles and citations', text: 'Headings, quotes, lists and checklists, plus citations that Write keeps consistent for you.' },
      { symbol: 'share', title: 'Share and comment', text: 'Share with anyone who has an ELUM account, and reply to each other’s comments.' },
      { symbol: 'download', title: 'Download and print', text: 'Save a copy as a PDF, plain text or a web page, or print it exactly as it looks.' },
      { symbol: 'saved', title: 'Saved everywhere', text: 'Every change is saved to your account, so you can pick up on your phone.' },
    ],
    news: [{ date: '20 October 2026', text: 'You can now open Browse from the apps window.' }],
  },
  {
    id: 'type',
    name: 'Type',
    color: '#3fc4a0',
    mist: '#e4f7f1',
    kind: 'Messages and email',
    tagline: 'Messages and email in one calm inbox.',
    about: 'Type brings your messages and email together, with an ELUM Type address that’s all yours. Read whole conversations in one place, keep spam out, and approve new sign-ins from a device you trust.',
    url: TYPE_URL,
    host: 'type.elum.services',
    highlights: [
      { symbol: 'verified', title: 'Know who it’s from', text: 'Messages from other ELUM accounts show the verified symbol.' },
      { symbol: 'spam', title: 'Spam stays out', text: 'Report spam and it leaves your inbox. Change your mind and Not spam brings it back.' },
      { symbol: 'archive', title: 'Everything in its place', text: 'Inbox, Unread, Archived, Spam and Trash are one click apart.' },
      { symbol: 'private', title: 'Approve new sign-ins', text: 'A new device can’t get in until you pick its number on a device you trust.' },
    ],
    news: [{ date: '20 October 2026', text: 'You can now open Browse from the apps window.' }],
  },
  {
    id: 'inquire',
    name: 'Inquire',
    color: '#f06a5f',
    mist: '#fff0ee',
    kind: 'Forms',
    tagline: 'Design forms and share them with a link.',
    about: 'Design forms and share them with a link. Made by you. Runs without AI. Add the questions you want, choose how each one is answered, and send the link to anyone. Answers come back to you in one place.',
    url: INQUIRE_URL,
    host: 'inquire.elum.services',
    highlights: [
      { symbol: 'compose', title: 'Ask what you need', text: 'Short answers, long answers, choices, dates and more. Put the questions in the order you like.' },
      { symbol: 'link', title: 'Share with a link', text: 'Send the link to anyone. They can fill your form without needing an account.' },
      { symbol: 'saved', title: 'Answers in one place', text: 'Every answer comes back to you, and you can read them whenever you like.' },
      { symbol: 'visible', title: 'Runs without AI', text: 'Nothing reads or rewrites your questions or answers. It is just your form.' },
    ],
    news: [{ date: '22 October 2026', text: 'Inquire is here. Design a form and share it with a link.' }],
  },
  {
    id: 'account',
    name: 'Account',
    color: '#94c858',
    mist: '#eef7e4',
    kind: 'You, everywhere',
    tagline: 'One account for every ELUM app.',
    about: 'Your ELUM Account keeps your name and picture, the people you know, and how you sign in in one place, for every ELUM app. It comes with every account.',
    url: ACCOUNT_HOME,
    host: 'account.elum.services',
    included: true,
    highlights: [
      { symbol: 'private', title: 'Security', text: 'Approve new sign-ins and sign out devices you no longer use.' },
      { symbol: 'invite', title: 'People and circles', text: 'Sort the people you know into circles like Family, Friends and Work.' },
      { symbol: 'star', title: 'Preferences', text: 'Choose your time format, the first day of your week, the app you start in, and how much motion you like.' },
      { symbol: 'warning', title: 'You’re in charge', text: 'Decide who can see your picture and find you, and delete your account whenever you want.' },
    ],
    news: [{ date: '20 October 2026', text: 'Your picture now has a ring showing the ELUM apps in your account.' }, { date: '20 October 2026', text: 'You can now choose Browse as the app you start in.' }],
  },
  {
    id: 'tune',
    name: 'Tune',
    color: '#48bfe3',
    mist: '#e3f5fb',
    kind: 'Music',
    tagline: 'Music, made for ELUM. Coming soon.',
    about: 'Tune is the music app we’re making for ELUM. Play what you love, keep it in playlists you put together yourself, and pick up on any device. No AI picking songs for you, and nothing about what you listen to is sold.',
    teaser: 'Music for your ELUM account. Your playlists, your picks, no AI.',
    url: 'https://tune.elum.services',
    host: 'tune.elum.services',
    status: 'soon',
    highlights: [
      { symbol: 'star', title: 'Your playlists', text: 'Put songs together in playlists you name and order yourself.' },
      { symbol: 'saved', title: 'On every device', text: 'Start on your computer and keep listening on your phone.' },
      { symbol: 'visible', title: 'Chosen by you', text: 'No AI deciding what plays next. What you hear is up to you.' },
      { symbol: 'private', title: 'Your listening stays yours', text: 'What you play is kept in your ELUM account and never sold.' },
    ],
    news: [{ date: '22 October 2026', text: 'Tune is coming to ELUM. Tap Notify me and we’ll let you know when it’s ready.' }],
  },
];

/** The app is announced but not open yet. */
export const isSoon = (app: Pick<StoreApp, 'status'>) => app.status === 'soon';

/** Apps people can get and open today: the ones that count in Your apps and the app ring. */
export const LIVE_APPS: StoreApp[] = APPS.filter((a) => !isSoon(a));

/** Apps on their way. */
export const SOON_APPS: StoreApp[] = APPS.filter(isSoon);

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
    apps: APPS.filter((a) => matches([a.name, a.kind, a.tagline, a.about, a.teaser ?? '', isSoon(a) ? 'coming soon' : '', ...a.highlights.map((h) => h.title)].join(' '))),
    templates: TEMPLATES.filter((t) => matches([t.name, t.description, t.kind, 'template make'].join(' '))),
  };
}
