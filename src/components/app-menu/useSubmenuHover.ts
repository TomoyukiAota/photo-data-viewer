import { menuClasses } from '@mui/material/Menu';
import { useEffect, useLayoutEffect, useRef } from 'react';

/** A point in the window, in pixels from its top left corner. */
export interface Point {
  x: number;
  y: number;
}

/** A box in the window, by its edges, in pixels from its top left corner. */
export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type Triangle = [Point, Point, Point];

/** How long the pointer rests on the entry before its submenu opens, in milliseconds. */
export const restToOpen = 100;

/**
 * How long the pointer may rest over another entry on its way to the
 * submenu before the submenu closes, in milliseconds.
 */
export const restToClose = 300;

/**
 * How far behind the point where the pointer left the entry the way to the
 * submenu starts, in pixels: the pointer a step past that point, beside it or
 * under it, is on the way.
 */
const wayStartsBehind = 5;

/**
 * The way from the point where the pointer left the entry to the submenu: the
 * triangle between that point and the submenu's side that faces it, which the
 * pointer crosses on its way to the submenu, over the entries between. Null
 * when the point is in the submenu.
 */
export function wayToSubmenu(from: Point, submenu: Box): Triangle | null {
  const { left, top, right, bottom } = submenu;
  const behind = wayStartsBehind;
  if (from.x <= left) {
    // The submenu is on the right.
    return [
      { x: from.x - behind, y: from.y },
      { x: left, y: top },
      { x: left, y: bottom },
    ];
  }
  if (from.x >= right) {
    // On the left.
    return [
      { x: from.x + behind, y: from.y },
      { x: right, y: top },
      { x: right, y: bottom },
    ];
  }
  if (from.y <= top) {
    // Under it, as in a phone's width.
    return [
      { x: from.x, y: from.y - behind },
      { x: left, y: top },
      { x: right, y: top },
    ];
  }
  if (from.y >= bottom) {
    // Above it.
    return [
      { x: from.x, y: from.y + behind },
      { x: left, y: bottom },
      { x: right, y: bottom },
    ];
  }
  return null;
}

/**
 * Whether the point is in the triangle or on its edges. Nothing is in a
 * triangle without an area, the way to a submenu that is not laid out.
 */
export function isInTriangle(point: Point, [a, b, c]: Triangle): boolean {
  /** Which side of the line from one corner to the next the point is on. */
  const side = (from: Point, to: Point) =>
    (to.x - from.x) * (point.y - from.y) - (to.y - from.y) * (point.x - from.x);
  const area = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  if (area === 0) return false;
  const sides = [side(a, b), side(b, c), side(c, a)];
  return sides.every((s) => s >= 0) || sides.every((s) => s <= 0);
}

/**
 * The box of a menu's paper as it is laid out, in the window.
 *
 * TL;DR: Where the submenu is going to be, rather than where it is drawn
 * while it grows open.
 * Details: A menu grows open from its corner at its entry for a quarter of a
 * second, drawn smaller, and a pointer that heads for the submenu at once
 * heads for where it is going to be. The paper is placed in the menu's layer,
 * which covers the window.
 */
function laidOutBox(paper: HTMLElement): Box {
  const layer = paper.offsetParent?.getBoundingClientRect() ?? {
    left: 0,
    top: 0,
  };
  const left = layer.left + paper.offsetLeft;
  const top = layer.top + paper.offsetTop;
  return {
    left,
    top,
    right: left + paper.offsetWidth,
    bottom: top + paper.offsetHeight,
  };
}

/** The submenu that the entry opens, which the entry names while it is open. */
function submenuOf(entry: Element): HTMLElement | null {
  const id = entry.getAttribute('aria-controls');
  return id ? document.getElementById(id) : null;
}

/** What the entry of a submenu is given to open it on hover (useSubmenuHover). */
export type SubmenuEntryHandlers = Required<
  Pick<
    React.DOMAttributes<HTMLElement>,
    'onPointerMove' | 'onPointerLeave' | 'onMouseDown'
  >
>;

/**
 * Opens a menu's submenu when a mouse's pointer rests on its entry, and
 * closes it when the pointer goes on to another entry of the menu, as the
 * submenus of a desktop's menus do. Returns what the entry is given.
 *
 * TL;DR: The submenu stays open while the pointer crosses other entries on its
 * way to the submenu, and closes when the pointer turns away or rests there.
 * Details: The way is the triangle between the point where the pointer left
 * the entry and the submenu's side that faces it (wayToSubmenu). The pointer
 * passing over the entry does not open the submenu: it opens once the pointer
 * has rested there. A touch, which has no hover, and the keyboard open the
 * submenu as they did. The pointer reaches the menu under the submenu only
 * where the submenu lets it through (LayoutSubmenu.tsx): there a press on
 * another entry closes the submenu before the entry takes it, so that the
 * focus goes back to the entry of the submenu and on to the menu's button
 * when the menu closes. A press on the entry leaves the focus in the submenu.
 */
export default function useSubmenuHover(options: {
  /** Whether the menu is open: its submenu opens while it is. */
  isMenuOpen: boolean;
  /** The entry while its submenu is open, or null. */
  openEntry: HTMLElement | null;
  /** Opens the submenu of the entry given, or closes it with null. */
  setOpenEntry: (entry: HTMLElement | null) => void;
}): SubmenuEntryHandlers {
  const { isMenuOpen, openEntry, setOpenEntry } = options;
  /** The submenu's opening, once the pointer has rested on the entry. */
  const opening = useRef<ReturnType<typeof setTimeout>>(undefined);
  /**
   * The way to the submenu, from where the pointer left the entry with the
   * submenu open, and the submenu's closing, once the pointer has rested on
   * the way over another entry.
   */
  const way = useRef<{
    triangle: Triangle | null;
    closing?: ReturnType<typeof setTimeout>;
  } | null>(null);

  // TL;DR: Opened or closed in another way, or the menu closed: a rest on the
  // entry from before does not open the submenu.
  // Details: Cancelled as the change is made, before the pointer's next
  // event. An effect, which runs a moment later, once the change is drawn,
  // could cancel an opening that the pointer started in that moment, back on
  // the entry.
  useLayoutEffect(
    () => () => clearTimeout(opening.current),
    [openEntry, isMenuOpen],
  );

  // While the submenu is open, where the pointer goes in the menu.
  useEffect(() => {
    if (!openEntry) return;
    const entry = openEntry;
    const menu = entry.closest('[role="menu"]');
    let isOverAnotherEntry = false;
    const endWay = () => {
      clearTimeout(way.current?.closing);
      way.current = null;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (!(event.target instanceof Element)) return;
      const { target } = event;
      if (entry.contains(target) || submenuOf(entry)?.contains(target)) {
        isOverAnotherEntry = false;
        endWay();
        return;
      }
      const anotherEntry = target.closest('[role="menuitem"]');
      isOverAnotherEntry = !!anotherEntry && !!menu?.contains(anotherEntry);
      // Beside the menus, or between the entries.
      if (!isOverAnotherEntry) return;
      const triangle = way.current?.triangle;
      const point = { x: event.clientX, y: event.clientY };
      if (triangle && isInTriangle(point, triangle)) {
        clearTimeout(way.current?.closing);
        way.current = {
          triangle,
          closing: setTimeout(() => {
            way.current = null;
            if (isOverAnotherEntry) setOpenEntry(null);
          }, restToClose),
        };
        return;
      }
      endWay();
      setOpenEntry(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (entry.contains(event.target)) return;
      if (menu?.contains(event.target)) setOpenEntry(null);
    };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerdown', onPointerDown);
      endWay();
    };
  }, [openEntry, setOpenEntry]);

  return {
    onPointerMove: (event) => {
      if (event.pointerType !== 'mouse' || !isMenuOpen || openEntry) return;
      const entry = event.currentTarget;
      clearTimeout(opening.current);
      opening.current = setTimeout(() => {
        // The focus goes to the entry first, as a click gives it, so that it
        // goes back there when the submenu closes.
        entry.focus({ preventScroll: true });
        setOpenEntry(entry);
      }, restToOpen);
    },
    onPointerLeave: (event) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(opening.current);
      const paper =
        openEntry &&
        submenuOf(openEntry)?.querySelector<HTMLElement>(
          `.${menuClasses.paper}`,
        );
      if (!paper) return;
      clearTimeout(way.current?.closing);
      way.current = {
        triangle: wayToSubmenu(
          { x: event.clientX, y: event.clientY },
          laidOutBox(paper),
        ),
      };
    },
    onMouseDown: (event) => {
      if (openEntry) event.preventDefault();
    },
  };
}
