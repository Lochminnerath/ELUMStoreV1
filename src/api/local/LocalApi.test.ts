import { describe, expect, it } from 'vitest';
import { ApiError } from '../errors';
import { LocalApi } from './LocalApi';

const signUp = (api: LocalApi, name: string, email: string) => api.signUp({ name, email, password: 'long-password-1' });

describe('preview mode', () => {
  it('signs up, signs out and signs back in', async () => {
    const api = new LocalApi();
    const { user } = await signUp(api, 'Ada', 'ada@example.org');
    expect(user.name).toBe('Ada');
    await api.signOut();
    expect(await api.restoreSession()).toBeNull();
    await expect(api.signIn({ email: 'ada@example.org', password: 'wrong-password' })).rejects.toMatchObject({ code: 'invalid_credentials' });
    expect((await api.signIn({ email: 'ADA@example.org', password: 'long-password-1' })).user.id).toBe(user.id);
  });

  it('refuses ELUM Type addresses without the platform', async () => {
    await expect(new LocalApi().signUp({ name: 'Fen', email: '', password: 'long-password-1', accountType: 'type', handle: 'fen' })).rejects.toBeInstanceOf(ApiError);
  });

  it('keeps the apps someone gets, and refuses apps that are not open yet', async () => {
    const api = new LocalApi();
    await api.signUp({ name: 'Ada', email: 'ada.store@example.org', password: 'long-password-1' });
    expect((await api.myApps()).some((a) => a.joined)).toBe(false);
    await api.getApp('make');
    const apps = await api.myApps();
    expect(apps.find((a) => a.id === 'make')).toMatchObject({ joined: true, stage: 'beta' });
    expect(apps.find((a) => a.id === 'write')?.joined).toBe(false);
    await expect(api.getApp('nothing')).rejects.toBeInstanceOf(ApiError);
  });

  it('needs someone signed in to get apps', async () => {
    const api = new LocalApi();
    await api.signOut();
    await expect(api.getApp('make')).rejects.toBeInstanceOf(ApiError);
  });
});
