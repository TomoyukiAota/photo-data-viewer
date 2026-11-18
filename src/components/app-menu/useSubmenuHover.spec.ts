import { isInTriangle, wayToSubmenu } from './useSubmenuHover';

// Where the submenu of the layouts is, as the browser suite finds it: beside
// the menu at 1280 pixels, from the top of its entry, which is 36 pixels
// high, down, and under its entry at 320 pixels.
/** In English, on the left of the menu, which is at the window's right. */
const onTheLeft = { left: 629, top: 246, right: 1071, bottom: 390 };
/** In Arabic, on the right of the menu, which is at the window's left. */
const onTheRight = { left: 229, top: 246, right: 615, bottom: 390 };
/** In a phone's width. */
const under = { left: 16, top: 342, right: 304, bottom: 530 };

describe('wayToSubmenu', () => {
  it('leads from where the pointer left the entry, a little behind it, to the side of the submenu that faces it', () => {
    expect(wayToSubmenu({ x: 1180, y: 282 }, onTheLeft)).toEqual([
      { x: 1185, y: 282 },
      { x: 1071, y: 246 },
      { x: 1071, y: 390 },
    ]);
    expect(wayToSubmenu({ x: 130, y: 282 }, onTheRight)).toEqual([
      { x: 125, y: 282 },
      { x: 229, y: 246 },
      { x: 229, y: 390 },
    ]);
    expect(wayToSubmenu({ x: 200, y: 293 }, under)).toEqual([
      { x: 200, y: 288 },
      { x: 16, y: 342 },
      { x: 304, y: 342 },
    ]);
  });

  it('is none from a point in the submenu', () => {
    expect(wayToSubmenu({ x: 1000, y: 300 }, onTheLeft)).toBeNull();
  });
});

describe('isInTriangle', () => {
  it('holds the pointer that heads for the submenu across the entry under its own, and not the one that goes straight down', () => {
    const way = wayToSubmenu({ x: 1180, y: 282 }, onTheLeft)!;
    expect(isInTriangle({ x: 1150, y: 300 }, way)).toBe(true);
    expect(isInTriangle({ x: 1100, y: 340 }, way)).toBe(true);
    // A step past the point where it left the entry.
    expect(isInTriangle({ x: 1180, y: 284 }, way)).toBe(true);
    expect(isInTriangle({ x: 1180, y: 300 }, way)).toBe(false);
    // Up, to the entry above its own.
    expect(isInTriangle({ x: 1150, y: 240 }, way)).toBe(false);
  });

  it('holds the pointer that heads for the submenu on the right, in a language written from right to left', () => {
    const way = wayToSubmenu({ x: 130, y: 282 }, onTheRight)!;
    expect(isInTriangle({ x: 160, y: 300 }, way)).toBe(true);
    expect(isInTriangle({ x: 130, y: 300 }, way)).toBe(false);
    expect(isInTriangle({ x: 100, y: 300 }, way)).toBe(false);
  });

  it('holds the pointer that heads down for the submenu under the entry, and not the one that goes up', () => {
    const way = wayToSubmenu({ x: 200, y: 293 }, under)!;
    expect(isInTriangle({ x: 180, y: 320 }, way)).toBe(true);
    expect(isInTriangle({ x: 200, y: 280 }, way)).toBe(false);
  });

  it('holds nothing in the way to a submenu that is not laid out', () => {
    const none = { left: 0, top: 0, right: 0, bottom: 0 };
    const way = wayToSubmenu({ x: 1180, y: 282 }, none)!;
    expect(isInTriangle({ x: 1150, y: 300 }, way)).toBe(false);
    expect(isInTriangle({ x: 0, y: 0 }, way)).toBe(false);
  });
});
