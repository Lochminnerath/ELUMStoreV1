import { ACCOUNT_HOME, BROWSE_URL, MAKE_URL, TYPE_URL, WRITE_URL } from '../lib/elum';
import { ELUM_APPS } from '../lib/platform';

const urlOf = (id: string) => ELUM_APPS.find((a) => a.id === id)!.url;

/**
 * What ELUM Store offers: the ELUM apps, and templates for Make and Write. Words and links only; whether
 * someone has an app comes from the platform (api.myApps), and whether it is running from the
 * elum-status function. Keep every line to something the app does today.
 */

export type AppId = 'write' | 'type' | 'make' | 'browse' | 'account' | 'inquire' | 'tune' | 'code' | 'capture';

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
  /** Its address on elum.space. */
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
    id: 'capture',
    name: 'Capture',
    color: '#5ec46f',
    mist: '#e8f7ea',
    kind: 'Photos and videos',
    tagline: 'Your photos and videos, kept, edited and shared.',
    about: 'Keep your photos, videos and almost any other file in one library, sorted by the day they were taken. Edit without losing the original, gather albums, and share them with people or by link.',
    url: urlOf('capture'),
    host: 'capture.elum.space',
    featured: true,
    highlights: [
      { symbol: 'saved', title: 'Everything in one library', text: 'Photos from any camera (HEIC and raw too), videos and files, sorted by day.' },
      { symbol: 'compose', title: 'Edit, keep the original', text: 'Light, colour, crop and filters, and Revert brings the original back any time.' },
      { symbol: 'share', title: 'Albums to share', text: 'Share an album with people, let them add theirs, or send a link.' },
      { symbol: 'private', title: 'Private by default', text: 'Your files are yours. Links open only what you share, and stop when you say.' },
    ],
    news: [
      { date: '2 November 2026', text: 'Add almost any file, not only photos and videos.' },
      { date: '2 November 2026', text: 'Big videos upload in pieces, so they arrive whole.' },
    ],
  },
  {
    id: 'code',
    name: 'Code',
    color: '#d27fe0',
    mist: '#f8ecfa',
    kind: 'Coding',
    tagline: 'Write and run code in any language.',
    about: 'Projects in every popular language, with an editor that colours your code and runs it right in the browser. Share a project, look back through its versions, and keep it in step with GitHub.',
    url: urlOf('code'),
    host: 'code.elum.space',
    featured: true,
    highlights: [
      { symbol: 'compose', title: 'Every language', text: 'JavaScript, Python, C, Rust, Go, SQL and dozens more, with colours for each.' },
      { symbol: 'open', title: 'Run it now', text: 'Press Run and see the output, without installing anything.' },
      { symbol: 'duplicate', title: 'Versions', text: 'Every save is a version you can look at and bring back.' },
      { symbol: 'share', title: 'Share a project', text: 'Invite people to edit, or share a link to read it.' },
    ],
    news: [{ date: '2 November 2026', text: 'Code is open. Start a project in any language.' }],
  },
  {
    id: 'tune',
    name: 'Tune',
    color: '#48bfe3',
    mist: '#e6f6fb',
    kind: 'Music',
    tagline: 'Music, picked by people.',
    about: 'Albums and songs from artists across genres, put together by people rather than an algorithm. Save what you love, make playlists, and send an album to a friend.',
    url: urlOf('tune'),
    host: 'tune.elum.space',
    highlights: [
      { symbol: 'star', title: 'Picked by people', text: 'Genre pages and features chosen by curators, not by AI.' },
      { symbol: 'saved', title: 'Your library', text: 'Save albums and songs, and make playlists of your own.' },
      { symbol: 'share', title: 'Share music', text: 'Send an album or a playlist to someone with an ELUM account.' },
      { symbol: 'open', title: 'Plays smoothly', text: 'Crossfade between songs, and playback that carries on through a weak connection.' },
    ],
    news: [{ date: '30 October 2026', text: 'Crossfade between songs.' }],
  },
  {
    id: 'inquire',
    name: 'Inquire',
    color: '#f06a5f',
    mist: '#fdeceb',
    kind: 'Forms',
    tagline: 'Forms and surveys anyone can answer.',
    about: 'Build forms, surveys and sign-up sheets, share them by link, and read every answer as it arrives. Questions can show or hide depending on earlier answers.',
    url: urlOf('inquire'),
    host: 'inquire.elum.space',
    highlights: [
      { symbol: 'compose', title: 'Every kind of question', text: 'Short and long answers, choices, scales, dates and more.' },
      { symbol: 'link', title: 'Share by link', text: 'Anyone with the link can answer, with or without an ELUM account.' },
      { symbol: 'visible', title: 'Answers as they come', text: 'Read each answer, or see them all summed up.' },
      { symbol: 'invite', title: 'Work together', text: 'Share a form with people who help you build it.' },
    ],
    news: [{ date: '25 October 2026', text: 'Questions can follow earlier answers.' }],
  },
  {
    id: 'make',
    name: 'Make',
    color: '#ec7fa9',
    mist: '#fceaf1',
    kind: 'Design studio',
    tagline: 'A design studio: slides, posts, logos and screens.',
    about: 'Design presentations, posters, logos, business cards, app screens and web pages on a canvas that snaps things into line. Draw your own shapes with the pen and the brush, fill them with gradients, add shadows, blur and blend modes, and give pictures filters and shapes. Present full screen, share with anyone who has an ELUM account, or download PNG and PDF.',
    url: MAKE_URL,
    host: 'make.elum.space',
    featured: true,
    highlights: [
      { symbol: 'compose', title: 'The pen and the brush', text: 'Click to place points and draw any shape, or draw freehand. Double-click a drawing to move its points.' },
      { symbol: 'star', title: 'Effects', text: 'Gradients, shadows, blur, blend modes, outlines and highlights, on anything you place.' },
      { symbol: 'visible', title: 'Pictures', text: 'Eight filters, sliders for light and colour, and shapes to show a picture inside.' },
      { symbol: 'present', title: 'Present', text: 'Fills the screen until you press Esc. Elements can link to a web page or another page.' },
      { symbol: 'duplicate', title: 'Pages and layers', text: 'Duplicate, reorder and delete pages, with speaker notes, and keep elements in order with layers.' },
      { symbol: 'compose', title: 'Your words, your colours', text: 'Double-click any text to edit it, and pick any colour from the wheel or by its code.' },
      { symbol: 'download', title: 'Download', text: 'Save a page as PNG or the whole design as PDF.' },
    ],
    news: [
      { date: '10 November 2026', text: 'A design studio: the pen, the brush, twelve shapes, gradients, effects, picture filters and ten new templates.' },
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
    tagline: 'The web, your way, with no AI answers.',
    about: 'Search the web with results from Google, without AI Overviews or Gemini, in a browser that looks the way you like: your background or your own picture, your accent colour and your tab strip. Pages open in Browse tabs, with tab groups and every ELUM app a word away, and the address bar tucks away when you want more of the page.',
    url: BROWSE_URL,
    host: 'browse.elum.space',
    featured: true,
    highlights: [
      { symbol: 'star', title: 'Your own look', text: 'Seven backgrounds or your own picture, ten accent colours or any colour, and a colour for your tabs.' },
      { symbol: 'saved', title: 'Settings in one place', text: 'SafeSearch, pictures, where results open, the address bar, theme and less motion. Kept on your device.' },
      { symbol: 'visible', title: 'Just the web', text: 'Results from Google, without AI Overviews or Gemini.' },
      { symbol: 'open', title: 'Pages stay in Browse', text: 'Results and typed addresses open in a Browse tab, or as a clean reading view when a site refuses.' },
      { symbol: 'star', title: 'Tabs and groups', text: 'Group tabs, then give the group a name, a colour and a symbol.' },
      { symbol: 'private', title: 'Your searches, your device', text: 'Recent searches stay on this device only. Forget them at any time.' },
    ],
    news: [
      { date: '10 November 2026', text: 'Settings, backgrounds, accent and tab colours, and an address bar you can tuck away.' },
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
    host: 'write.elum.space',
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
    host: 'type.elum.space',
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
    host: 'account.elum.space',
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

export type TemplateKind = 'presentation' | 'poster' | 'social' | 'design' | 'document';

/** The app a template opens in. */
export type TemplateApp = 'make' | 'write';

/**
 * Templates for Make and Write, by the ids each app knows (ELUMMakeV1 src/editor/templates.ts and
 * ELUMWritev1 src/lib/templates.ts). "Use" opens the app with ?template=<id>&from=<click>, and it
 * starts a new design or document from it, once per click.
 */
export interface StoreTemplate {
  /** The template's id in its app (Make and Write each have their own, so a few repeat). */
  id: string;
  app: TemplateApp;
  name: string;
  description: string;
  kind: TemplateKind;
  /** Width over height. */
  ratio: number;
  /** How its cover looks, for the card: the ground, the ink, the accent, the layout and the big words on it. */
  look: { ground: string; ink: string; accent: string; layout: 'title' | 'lesson' | 'poster' | 'quote' | 'document' | 'banner' | 'page' | 'mark' | 'screen'; words: string; sub?: string; font?: 'serif' | 'tall' };
}

export const TEMPLATE_KINDS: { id: TemplateKind; name: string }[] = [
  { id: 'presentation', name: 'Presentations' },
  { id: 'poster', name: 'Posters' },
  { id: 'social', name: 'Social posts' },
  { id: 'design', name: 'Logos and screens' },
  { id: 'document', name: 'Documents' },
];

export const TEMPLATES: StoreTemplate[] = [
  {
    id: 'pitch',
    app: 'make',
    name: 'Pitch deck',
    description: 'A title, the problem, the idea and next steps.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: 'linear-gradient(135deg, #141a2e, #3b5bd6)', ink: '#ffffff', accent: '#ec7fa9', layout: 'title', words: 'Your big idea', sub: 'A short line on why it matters' },
  },
  {
    id: 'lesson',
    app: 'make',
    name: 'Lesson slides',
    description: 'Clean slides for teaching or a talk.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#ec7fa9', layout: 'lesson', words: 'Lesson title', sub: 'Your name · Date' },
  },
  {
    id: 'minimal-deck',
    app: 'make',
    name: 'Minimal presentation',
    description: 'Lots of white space and one idea per slide.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#ec7fa9', layout: 'title', words: 'A quiet title', sub: 'Subtitle or your name' },
  },
  {
    id: 'annual-report',
    app: 'make',
    name: 'Annual report',
    description: 'The year in numbers, highlights and what comes next.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: '#141a2e', ink: '#ffffff', accent: '#ec7fa9', layout: 'title', words: '2026 in review', sub: 'Annual report' },
  },
  {
    id: 'workshop',
    app: 'make',
    name: 'Workshop slides',
    description: 'An agenda, exercises and a wrap-up.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#3fc4a0', layout: 'lesson', words: 'Workshop title', sub: 'Date · Room' },
  },
  {
    id: 'product-launch',
    app: 'make',
    name: 'Product launch',
    description: 'Introduce something new and why people will love it.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: 'linear-gradient(135deg, #141a2e, #2a3a8f)', ink: '#ffffff', accent: '#e9b949', layout: 'title', words: 'Meet the new thing', sub: 'Available today' },
  },
  {
    id: 'event-poster',
    app: 'make',
    name: 'Event poster',
    description: 'Bold heading, date and place.',
    kind: 'poster',
    ratio: 0.707,
    look: { ground: 'linear-gradient(160deg, #f59a52, #ec7fa9)', ink: '#ffffff', accent: '#141a2e', layout: 'poster', words: 'Summer night market', sub: 'Friday 14 June · 6 pm', font: 'tall' },
  },
  {
    id: 'conference-poster',
    app: 'make',
    name: 'Conference poster',
    description: 'A research poster with the key finding up top.',
    kind: 'poster',
    ratio: 0.707,
    look: { ground: 'linear-gradient(180deg, #141a2e, #3b5bd6)', ink: '#ffffff', accent: '#bacafc', layout: 'poster', words: 'Your key finding', sub: 'Method · Results', font: 'tall' },
  },
  {
    id: 'recipe',
    app: 'make',
    name: 'Recipe card',
    description: 'Ingredients and steps for a favourite dish.',
    kind: 'poster',
    ratio: 0.707,
    look: { ground: '#fdf0e4', ink: '#141a2e', accent: '#f59a52', layout: 'poster', words: 'Lemon pasta', sub: 'Serves 2 · 20 minutes', font: 'serif' },
  },
  {
    id: 'workshop-flyer',
    app: 'make',
    name: 'Workshop flyer',
    description: 'Get people to sign up for a class or workshop.',
    kind: 'poster',
    ratio: 1275 / 1650,
    look: { ground: 'linear-gradient(150deg, #3fc4a0, #3b5bd6)', ink: '#ffffff', accent: '#ffffff', layout: 'poster', words: 'Learn something new', sub: 'Saturday · Free', font: 'tall' },
  },
  {
    id: 'menu',
    app: 'make',
    name: 'Menu',
    description: 'A café or restaurant menu.',
    kind: 'poster',
    ratio: 0.707,
    look: { ground: '#141a2e', ink: '#fdf0e4', accent: '#e9b949', layout: 'poster', words: 'Menu', sub: 'Starters · Mains · Desserts', font: 'serif' },
  },
  {
    id: 'invitation',
    app: 'make',
    name: 'Wedding invitation',
    description: 'An elegant invitation with names, date and place.',
    kind: 'poster',
    ratio: 0.707,
    look: { ground: '#fbf7f2', ink: '#5a4a3a', accent: '#c9a77c', layout: 'poster', words: 'Alex & Sam', sub: 'Saturday 12 June 2027', font: 'serif' },
  },
  {
    id: 'proposal',
    app: 'make',
    name: 'Proposal',
    description: 'A one-page project proposal.',
    kind: 'poster',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#3b5bd6', layout: 'document', words: 'Project proposal' },
  },
  {
    id: 'resume',
    app: 'make',
    name: 'Resume',
    description: 'A clean one-page resume.',
    kind: 'poster',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#141a2e', layout: 'document', words: 'Your Name' },
  },
  {
    id: 'invoice',
    app: 'make',
    name: 'Invoice',
    description: 'A simple invoice for freelance work.',
    kind: 'poster',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#3fc4a0', layout: 'document', words: 'Invoice' },
  },
  {
    id: 'newsletter',
    app: 'make',
    name: 'Newsletter',
    description: 'A monthly update with a few short stories.',
    kind: 'poster',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#ec7fa9', layout: 'document', words: 'The Monthly' },
  },
  {
    id: 'quote-post',
    app: 'make',
    name: 'Quote post',
    description: 'A square post for a quote or announcement.',
    kind: 'social',
    ratio: 1,
    look: { ground: '#141a2e', ink: '#ffffff', accent: '#ec7fa9', layout: 'quote', words: 'Make something people want to share.', font: 'serif' },
  },
  {
    id: 'birthday',
    app: 'make',
    name: 'Birthday card',
    description: 'A bright card to say happy birthday.',
    kind: 'social',
    ratio: 1,
    look: { ground: 'linear-gradient(135deg, #e9b949, #ec7fa9)', ink: '#ffffff', accent: '#ffffff', layout: 'poster', words: 'Happy birthday!', sub: 'With love from us', font: 'tall' },
  },
  {
    id: 'header',
    app: 'make',
    name: 'Profile header',
    description: 'A wide header for your profile or page.',
    kind: 'social',
    ratio: 3,
    look: { ground: 'linear-gradient(120deg, #141a2e, #3b5bd6)', ink: '#ffffff', accent: '#ec7fa9', layout: 'banner', words: 'Your Name', sub: 'What you make, in a few words' },
  },
  {
    id: 'thumbnail',
    app: 'make',
    name: 'Video thumbnail',
    description: 'A bold 16:9 thumbnail that reads at a glance.',
    kind: 'social',
    ratio: 16 / 9,
    look: { ground: '#141a2e', ink: '#ffffff', accent: '#e9b949', layout: 'banner', words: 'How I did it', sub: 'In 10 minutes' },
  },
  {
    id: 'logo',
    app: 'make',
    name: 'Logo',
    description: 'A mark drawn with the pen, and a name to go with it.',
    kind: 'design',
    ratio: 1,
    look: { ground: '#fffaf5', ink: '#141a2e', accent: 'linear-gradient(135deg, #f59a52, #ec7fa9)', layout: 'mark', words: 'Fern & Field', sub: 'Flowers · Plants', font: 'serif' },
  },
  {
    id: 'business-card',
    app: 'make',
    name: 'Business card',
    description: 'A front and a back, with a gradient and your details.',
    kind: 'design',
    ratio: 1050 / 600,
    look: { ground: 'linear-gradient(135deg, #141a2e, #3b5bd6)', ink: '#ffffff', accent: '#3fc4a0', layout: 'banner', words: 'Sam Rivera', sub: 'Product designer' },
  },
  {
    id: 'app-screen',
    app: 'make',
    name: 'App screen',
    description: 'Two phone screens that link to each other when presenting.',
    kind: 'design',
    ratio: 390 / 844,
    look: { ground: '#f4f5f8', ink: '#141a2e', accent: '#3b5bd6', layout: 'screen', words: 'Your plans', sub: 'Good morning' },
  },
  {
    id: 'landing-page',
    app: 'make',
    name: 'Website landing page',
    description: 'A hero, a button and three features, with soft colour behind.',
    kind: 'design',
    ratio: 1440 / 1024,
    look: { ground: '#ffffff', ink: '#141a2e', accent: 'linear-gradient(135deg, #ec7fa9, #9b84ee)', layout: 'screen', words: 'Design that feels like you made it.', sub: 'Northwind' },
  },
  {
    id: 'certificate',
    app: 'make',
    name: 'Certificate',
    description: 'A framed certificate with a name in script and a seal.',
    kind: 'poster',
    ratio: 1650 / 1275,
    look: { ground: '#fffdf7', ink: '#141a2e', accent: '#c9a77c', layout: 'title', words: 'Alex Morgan', sub: 'Certificate of achievement', font: 'serif' },
  },
  {
    id: 'mood-board',
    app: 'make',
    name: 'Mood board',
    description: 'Shapes ready for your pictures, and a palette.',
    kind: 'presentation',
    ratio: 16 / 9,
    look: { ground: '#f6f1ea', ink: '#2b2118', accent: '#f59a52', layout: 'lesson', words: 'Mood board', sub: 'Warm, quiet, a little wild', font: 'serif' },
  },
  {
    id: 'sale-post',
    app: 'make',
    name: 'Sale post',
    description: 'A bold square post with an outlined headline and a burst.',
    kind: 'social',
    ratio: 1,
    look: { ground: 'linear-gradient(135deg, #7093f8, #9b84ee)', ink: '#ffffff', accent: '#e9b949', layout: 'mark', words: 'Summer sale', sub: '50% off', font: 'tall' },
  },
  {
    id: 'quote-story',
    app: 'make',
    name: 'Quote story',
    description: 'A tall story with a quote and a flowing wave.',
    kind: 'social',
    ratio: 9 / 16,
    look: { ground: 'linear-gradient(180deg, #141a2e, #3b5bd6)', ink: '#ffffff', accent: '#ec7fa9', layout: 'quote', words: 'Make the thing you wish you could find.', font: 'serif' },
  },
  {
    id: 'infographic',
    app: 'make',
    name: 'Step-by-step infographic',
    description: 'Four numbered steps joined by arrows.',
    kind: 'poster',
    ratio: 0.707,
    look: { ground: '#ffffff', ink: '#141a2e', accent: 'linear-gradient(135deg, #3fc4a0, #7093f8)', layout: 'document', words: 'How to start a garden' },
  },
  {
    id: 'event-ticket',
    app: 'make',
    name: 'Event ticket',
    description: 'A wide ticket with the date, the place and a stub.',
    kind: 'design',
    ratio: 3,
    look: { ground: 'linear-gradient(120deg, #ec7fa9, #9b84ee)', ink: '#ffffff', accent: '#141a2e', layout: 'banner', words: 'Night Market', sub: 'Friday 14 June · 6 pm' },
  },
  {
    id: 'notes',
    app: 'write',
    name: 'Meeting notes',
    description: 'Agenda, notes and next steps.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#f59a52', layout: 'page', words: 'Meeting notes', sub: 'Agenda · Notes · Next steps' },
  },
  {
    id: 'letter',
    app: 'write',
    name: 'Letter',
    description: 'Addresses, date and a greeting.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#3b5bd6', layout: 'page', words: 'Dear Sam,', sub: '12 November 2026' },
  },
  {
    id: 'brief',
    app: 'write',
    name: 'Project brief',
    description: 'Goal, scope and timeline.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#3fc4a0', layout: 'page', words: 'Project brief', sub: 'Goal · Scope · Timeline' },
  },
  {
    id: 'resume',
    app: 'write',
    name: 'Resume',
    description: 'Experience, skills and education.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#141a2e', layout: 'page', words: 'Your Name', sub: 'Experience · Skills' },
  },
  {
    id: 'cover-letter',
    app: 'write',
    name: 'Cover letter',
    description: 'For a job you would love.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#9b84ee', layout: 'page', words: 'Cover letter', sub: 'For the role of …' },
  },
  {
    id: 'agenda',
    app: 'write',
    name: 'Meeting agenda',
    description: 'Topics, times and who leads.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#f59a52', layout: 'page', words: 'Agenda', sub: 'Topics · Times · Who leads' },
  },
  {
    id: 'essay',
    app: 'write',
    name: 'Essay',
    description: 'Introduction, argument and conclusion.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#ec7fa9', layout: 'page', words: 'Essay title', sub: 'Introduction' },
  },
  {
    id: 'lesson',
    app: 'write',
    name: 'Lesson plan',
    description: 'Aims, activities and checks.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#48bfe3', layout: 'page', words: 'Lesson plan', sub: 'Aims · Activities' },
  },
  {
    id: 'recipe',
    app: 'write',
    name: 'Recipe',
    description: 'Ingredients and method.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#f06a5f', layout: 'page', words: 'Recipe', sub: 'Ingredients · Method' },
  },
  {
    id: 'invoice',
    app: 'write',
    name: 'Invoice',
    description: 'Work done, amounts and payment.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#3fc4a0', layout: 'page', words: 'Invoice', sub: 'Work · Amount · Due' },
  },
  {
    id: 'newsletter',
    app: 'write',
    name: 'Newsletter',
    description: 'News, highlights and dates.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#ec7fa9', layout: 'page', words: 'Newsletter', sub: 'This month' },
  },
  {
    id: 'week',
    app: 'write',
    name: 'Weekly planner',
    description: 'Priorities and a day-by-day list.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#e9b949', layout: 'page', words: 'This week', sub: 'Monday · Tuesday · …' },
  },
  {
    id: 'trip',
    app: 'write',
    name: 'Trip itinerary',
    description: 'Travel, stays and plans by day.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#48bfe3', layout: 'page', words: 'Trip itinerary', sub: 'Day one · Day two' },
  },
  {
    id: 'thanks',
    app: 'write',
    name: 'Thank-you letter',
    description: 'A short, heartfelt note.',
    kind: 'document',
    ratio: 1275 / 1650,
    look: { ground: '#ffffff', ink: '#141a2e', accent: '#ec7fa9', layout: 'page', words: 'Thank you', sub: 'With warm wishes' },
  },
];

/**
 * The address that opens Make or Write with a template ready to edit. `click` names this one click,
 * so the app starts one design or document for it even if Back brings the address round again.
 */
export function templateUrl(template: Pick<StoreTemplate, 'id' | 'app'>, click?: string): string {
  const query = new URLSearchParams({ template: template.id });
  if (click) query.set('from', click);
  return `${template.app === 'write' ? WRITE_URL : MAKE_URL}/?${query.toString()}`;
}

/** The app a template opens in, by name. */
export const templateAppName = (t: Pick<StoreTemplate, 'app'>) => (t.app === 'write' ? 'Write' : 'Make');

/** A key for a template that is unique across Make and Write. */
export const templateKey = (t: Pick<StoreTemplate, 'id' | 'app'>) => `${t.app}:${t.id}`;

// --------------------------------------------------------------------- search

/** Apps and templates whose words match every word of the query, in catalogue order. */
export function searchCatalog(query: string): { apps: StoreApp[]; templates: StoreTemplate[] } {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return { apps: APPS, templates: TEMPLATES };
  const matches = (text: string) => words.every((w) => text.toLowerCase().includes(w));
  return {
    apps: APPS.filter((a) => matches([a.name, a.kind, a.tagline, a.about, ...a.highlights.map((h) => h.title)].join(' '))),
    templates: TEMPLATES.filter((t) => matches([t.name, t.description, t.kind, 'template', templateAppName(t)].join(' '))),
  };
}
