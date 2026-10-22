import { describe, expect, it } from 'vitest';
import { newerSeen, RELEASES, tourSteps, whatsNewFor, type Release } from './releases';

const r = (id: string): Release => ({ id, date: id, title: id, intro: 'i', features: [{ title: 't', text: 'x', art: 'spark' }] });
const list = [r('c'), r('b'), r('a')];

describe("what's new", () => {
  it('shows nothing to someone with nothing recorded, and records the latest quietly', () => {
    expect(whatsNewFor(list, null)).toEqual({ show: [], record: 'c' });
  });

  it('shows every release since the last one seen', () => {
    expect(whatsNewFor(list, 'a').show.map((x) => x.id)).toEqual(['c', 'b']);
    expect(whatsNewFor(list, 'b').show.map((x) => x.id)).toEqual(['c']);
  });

  it('shows nothing once the latest was seen', () => {
    expect(whatsNewFor(list, 'c')).toEqual({ show: [], record: null });
  });

  it('shows the latest when the last one seen no longer exists', () => {
    expect(whatsNewFor(list, 'gone').show.map((x) => x.id)).toEqual(['c']);
  });

  it('has nothing to do without releases', () => {
    expect(whatsNewFor([], 'a')).toEqual({ show: [], record: null });
  });

  it('trusts whichever of the account and this browser saw more', () => {
    expect(newerSeen(list, 'a', 'c')).toBe('c');
    expect(newerSeen(list, 'b', null)).toBe('b');
    expect(newerSeen(list, null, 'b')).toBe('b');
    expect(newerSeen(list, 'gone', 'a')).toBe('a');
    expect(newerSeen(list, null, null)).toBeNull();
  });

  it('opens each release with its title, then one step per feature', () => {
    const steps = tourSteps(list.slice(0, 2));
    expect(steps.map((s) => s.key)).toEqual(['c:intro', 'c:0', 'b:intro', 'b:0']);
    expect(steps[0].art).toBe('mark');
  });

  it('has unique ids and something to show in every release', () => {
    expect(new Set(RELEASES.map((x) => x.id)).size).toBe(RELEASES.length);
    for (const release of RELEASES) expect(release.features.length).toBeGreaterThan(0);
    const keys = tourSteps(RELEASES).map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
