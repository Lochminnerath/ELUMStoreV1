import type { ServiceState } from '../lib/platform';
import type { AppNotification, AppUse, ElumStatus, Session, SignInInput, SignUpInput, User } from './types';

/** The contract every Store backend fulfils: Supabase in production, the browser when unconnected. */
export interface StoreApi {
  /** `remote` for the ELUM platform on Supabase, `local` for the browser only (development). */
  readonly mode: 'remote' | 'local';

  // Accounts: the same ELUM account as every other app. Store works signed out too.
  restoreSession(): Promise<Session | null>;
  signUp(input: SignUpInput): Promise<Session>;
  signIn(input: SignInInput): Promise<Session>;
  /** Signs in with a passkey. Only on ELUM's own domain (elum.space), where passkeys work. */
  signInWithPasskey?(): Promise<Session>;
  signOut(): Promise<void>;
  updateProfile(input: { name: string }): Promise<User>;
  /** Called when the session ends somewhere else. */
  onUnauthorized(handler: () => void): () => void;

  resendConfirmation?(email: string): Promise<void>;
  takeLinkProblem?(): string | null;
  typeDomain?(): Promise<string>;
  handleAvailable?(handle: string): Promise<boolean>;
  handoff?(to: string, next: string): Promise<string>;
  completeHandoff?(tokenHash: string): Promise<Session>;

  readonly notifications?: NotificationsApi;

  /** The ELUM apps and which of them the person has (signed in only). */
  myApps(): Promise<AppUse[]>;
  /** Adds an app to the person's ELUM account. */
  getApp(id: string): Promise<void>;
  /** How every ELUM service is doing, or null without the ELUM platform. */
  status(): Promise<ElumStatus | null>;

  /** The ELUM apps this account has added (in ELUM Store). Null when signed out, or unknown. */
  elumApps?(): Promise<string[] | null>;
  /** This app as the ELUM Console set it: mode, message, open incidents and flags. */
  serviceState?(service: string): Promise<ServiceState | null>;
}

export interface NotificationsApi {
  list(options?: { before?: string; unreadOnly?: boolean; limit?: number }): Promise<AppNotification[]>;
  markRead(ids?: string[]): Promise<void>;
  subscribe(onNew: (n: AppNotification) => void): () => void;
}
