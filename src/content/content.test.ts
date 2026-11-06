import { describe, expect, it } from 'vitest';
import { layOver, safeColor, safeImage, safeLink, storeOnly } from './content';
import { DEFAULTS } from './defaults';

describe('Store content', () => {
  it('keeps only Store sections from what the Console saved', () => {
    expect(storeOnly({ home: { a: 1 }, 'store.hero': { title: 'Shop' }, 'store.nope': {} })).toEqual({ 'store.hero': { title: 'Shop' } });
    expect(storeOnly(null)).toEqual({});
  });
  it('lays a change over the built-in words, keeping the shape', () => {
    const hero = layOver(DEFAULTS['store.hero'], { title: 'Shop', headline: 42, extra: 'x' });
    expect(hero.title).toBe('Shop');
    expect(hero.headline).toBe(DEFAULTS['store.hero'].headline);
    expect('extra' in hero).toBe(false);
  });
  it('keeps a card’s built-in parts it does not mention', () => {
    const latest = layOver(DEFAULTS['store.latest'], { cards: [{ id: 'tune', title: 'Tune, now with lyrics' }] });
    expect(latest.cards).toHaveLength(1);
    expect(latest.cards[0].title).toBe('Tune, now with lyrics');
    expect(latest.cards[0].band).toBe('#48bfe3');
  });
  it('lets the app circles be reordered', () => {
    expect(layOver(DEFAULTS['store.row'], { left: ['tune', 'code'] }).left).toEqual(['tune', 'code']);
  });
  it('only uses safe pictures, colours and links', () => {
    expect(safeImage('/brand/a.png')).toBe('/brand/a.png');
    expect(safeImage('javascript:alert(1)')).toBeNull();
    expect(safeImage('http://x.example/a.png')).toBeNull();
    expect(safeColor('#ff0000', '#000')).toBe('#ff0000');
    expect(safeColor('red; background:url(x)', '#000')).toBe('#000');
    expect(safeLink('javascript:alert(1)')).toBeNull();
    expect(safeLink('https://elum.space')).toBe('https://elum.space');
  });
});
