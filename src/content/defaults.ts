/**
 * What ELUM Store says and shows on its home page, as built in. The ELUM Console's Site section
 * can change any of it without a release (see content.ts): it saves changes under these same
 * keys, prefixed "store.", and Store lays them over these defaults when it opens.
 *
 * Plain words, no contractions, and nothing an app does not do today.
 */

export type AppId = 'write' | 'type' | 'make' | 'browse' | 'inquire' | 'tune' | 'code' | 'capture';

export interface StoreLink {
  label: string;
  url: string;
}

export interface LatestCard {
  /** Which card this is; keeps a change attached to the right card. */
  id: string;
  /** The ELUM app the card is about. Its mark is drawn on the card. */
  app: AppId;
  eyebrow: string;
  title: string;
  text: string;
  /** Small words under the text, such as "Free with your ELUM account". */
  note: string;
  /** The card's ground, and the deeper band its picture sits on. */
  color: string;
  band: string;
  /** A picture to show instead of the drawn one: one of Store's files, or an https link. */
  image: string;
}

export const DEFAULTS = {
  'store.hero': {
    title: 'Store',
    headline: 'Find the app for what you want to do.',
    links: [
      { label: 'Message ELUM Support', url: 'https://typebyelum.netlify.app/support' },
      { label: 'Read what is new', url: 'https://elum.space/whats-new' },
    ] as StoreLink[],
  },
  'store.row': {
    /** The app circles: as many on each side of Store, in this order. */
    left: ['write', 'type', 'make', 'browse'] as AppId[],
    right: ['inquire', 'tune', 'code', 'capture'] as AppId[],
    centre: 'Every app',
  },
  'store.latest': {
    title: 'The latest.',
    subtitle: 'New in ELUM, and free with your account.',
    cards: [
      {
        id: 'capture',
        app: 'capture',
        eyebrow: 'New',
        title: 'ELUM Capture',
        text: 'Your photos and videos, kept by the day they were taken, edited without losing the original, and shared by album or link.',
        note: 'Free with your ELUM account',
        color: '#d9f2dc',
        band: '#5ec46f',
        image: '',
      },
      {
        id: 'tune',
        app: 'tune',
        eyebrow: 'New',
        title: 'ELUM Tune',
        text: 'Music you own and music people share, with lyrics, playlists and smooth crossfades. No feed choosing for you.',
        note: 'Free with your ELUM account',
        color: '#d6eef7',
        band: '#48bfe3',
        image: '',
      },
      {
        id: 'code',
        app: 'code',
        eyebrow: 'New',
        title: 'ELUM Code',
        text: 'Write and run code in the browser, in the languages you know, and keep every version of your project.',
        note: 'Free with your ELUM account',
        color: '#f2dcf6',
        band: '#d27fe0',
        image: '',
      },
      {
        id: 'inquire',
        app: 'inquire',
        eyebrow: 'New',
        title: 'ELUM Inquire',
        text: 'Forms and surveys that ask clearly, collect answers safely and show you the results as they arrive.',
        note: 'Free with your ELUM account',
        color: '#fbdcd9',
        band: '#f06a5f',
        image: '',
      },
      {
        id: 'type',
        app: 'type',
        eyebrow: 'Updated',
        title: 'ELUM Type',
        text: 'Messages and email in one calm inbox, with ELUM Support a message away and sign-in codes ready to copy.',
        note: 'Comes with every ELUM address',
        color: '#d4f1e8',
        band: '#3fc4a0',
        image: '',
      },
      {
        id: 'write',
        app: 'write',
        eyebrow: 'Updated',
        title: 'ELUM Write',
        text: 'Documents you write yourself, with comments, sharing and every version kept. Nothing written for you.',
        note: 'Free with your ELUM account',
        color: '#fde4cf',
        band: '#f59a52',
        image: '',
      },
      {
        id: 'make',
        app: 'make',
        eyebrow: 'Updated',
        title: 'ELUM Make',
        text: 'Slides, posters and posts on a free canvas, with templates to start from and present straight from the browser.',
        note: 'Free with your ELUM account',
        color: '#fadbe7',
        band: '#ec7fa9',
        image: '',
      },
      {
        id: 'browse',
        app: 'browse',
        eyebrow: 'Updated',
        title: 'ELUM Browse',
        text: 'Search the web and open pages in tabs, grouped the way you work. Results ranked by plain rules, not by AI.',
        note: 'Free with your ELUM account',
        color: '#e6e0fb',
        band: '#9b84ee',
        image: '',
      },
    ] as LatestCard[],
  },
  'store.picks': {
    title: 'Make it yours.',
    subtitle: 'Every template in Make, ready for your words.',
    promo: {
      eyebrow: 'Free templates',
      title: 'Your idea, with a head start.',
      text: 'Pick a template in Make, change every word and colour, and it is yours.',
      color: '#f06a5f',
    },
  },
};

export type Content = typeof DEFAULTS;
export type SectionKey = keyof Content;

/** What the Console's Site section lists for Store, in this order. */
export const SECTIONS: { key: SectionKey; label: string; note: string; path: string }[] = [
  { key: 'store.hero', label: 'Store: heading', note: 'The big Store title, the headline beside it and its links.', path: '/' },
  { key: 'store.row', label: 'Store: app circles', note: 'Which apps sit to the left and right of Store, in order. Keep the same number on each side.', path: '/' },
  { key: 'store.latest', label: 'Store: the latest', note: 'The large colourful cards: words, colours and pictures for each app.', path: '/' },
  { key: 'store.picks', label: 'Store: make it yours', note: 'The red card before the templates. The templates themselves come from Make.', path: '/' },
];
