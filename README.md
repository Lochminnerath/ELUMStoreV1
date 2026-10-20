# ELUM Store

Every ELUM app in one place: Write, Type, Make, Browse and ELUM Account, free with an ELUM
account, plus templates that open straight in Make. Made by you. Runs without AI.

Store is one of the ELUM apps. Every ELUM app shares one Supabase project and one account, so
the apps someone gets in Store are the same ones the other apps and ELUM Account know about.
Browsing Store needs no account; getting an app does.

## What Store does

- **Every ELUM app** (`/`, `/apps/:id`): what it does, what is new, whether it is a beta, and how
  it is running right now (the `elum-status` function from ELUMBrowseV1).
- **Get** adds an app to the person's ELUM account through the platform's `elum_join_service`
  function (the call every ELUM app makes when someone signs in to it). Signed out, Get goes
  through sign-in and finishes on the app's page (`/apps/make?get=1`).
- **Open** opens the app signed in (ELUM Account hands the sign-in over), in this window, in a new
  window, or in an ELUM Browse tab under its elum.services address.
- **Templates for Make** (`/templates`): "Use in Make" opens Make with `?template=<id>`, and Make
  starts a new design from that template.
- **Your apps** (`/library`): the apps in your account and when you last used each.
- **Search** (`/search?q=`) across apps and templates; `/` jumps to the search box.

What Store offers lives in `src/store/catalog.ts`. Which apps someone has comes from the platform
(`elum_me`), so it is the same in every app.

## Run it

```sh
npm install
cp .env.example .env.local   # fill in VITE_SUPABASE_ANON_KEY
npm run dev
```

Without the Supabase settings Store runs in preview mode: accounts and the apps you get are kept in
this browser only. Netlify builds refuse to deploy that way (`scripts/require-supabase.mjs`).

```sh
npm run typecheck
npm test
npm run build
```

## Deploy (Netlify)

`netlify.toml` builds the app and serves it as a single-page app. In the site's environment
variables set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_ELUM_ACCOUNT_URL`.

Store may be shown inside ELUM Browse's tabs, and by no other site
(`Content-Security-Policy: frame-ancestors`).

## The platform

Store adds nothing to the database of its own. It needs the `store` and `browse` rows in
`elum.services` to be open (`beta` or `active`), so they can be got: ELUMAccountsV1
`supabase/migrations/20261028000000_open_store_and_browse.sql`. Signing in to Store from the other
apps needs `https://elumstore.netlify.app` among ELUM Account's handoff origins (its default list
includes it).
