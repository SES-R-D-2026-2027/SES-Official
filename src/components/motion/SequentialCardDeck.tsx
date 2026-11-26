"use client";

import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Card } from "@/components/ui/Card";
import type { PhysicsCardItem } from "@/components/motion/PlayfulPhysicsField";

interface PlacedCard {
  id: string;
  x: number;
  y: number;
}

interface SavedDeckState {
  nextIndex: number;
  placed: PlacedCard[];
}

interface DragState {
  id: string;
  index: number;
  source: "queue" | "placed";
  pointerId: number;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
  moved: boolean;
  activated: boolean;
}

const STORAGE_KEY = "ses-home-sequential-card-deck:v3";
const LEGACY_STORAGE_KEY = "ses-home-sequential-card-deck:v2";
const QUEUE_DURATION = 3_000;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function findNextCardIndex(
  startIndex: number,
  cards: PhysicsCardItem[],
  placed: PlacedCard[],
  excludedId?: string,
) {
  if (cards.length === 0) return -1;
  const placedIds = new Set(placed.map((item) => item.id));
  if (excludedId) placedIds.add(excludedId);

  for (let offset = 0; offset < cards.length; offset += 1) {
    const index = ((startIndex + offset) % cards.length + cards.length) % cards.length;
    if (!placedIds.has(cards[index].id)) return index;
  }
  return -1;
}

/**
 * One featured card is visible at a time. Its timer runs independently of placed-card
 * interactions. Moving it reveals the next card; a click without movement changes
 * nothing. Once all cards are placed, their progress bars fill together and the deck resets.
 */
export function SequentialCardDeck({
  cards,
  className = "",
  intervalMs = QUEUE_DURATION,
}: {
  cards: PhysicsCardItem[];
  className?: string;
  intervalMs?: number;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef(cards);
  const dragRef = useRef<DragState | null>(null);
  const placedRef = useRef<PlacedCard[]>([]);
  const cycleResetPendingRef = useRef(false);
  const [portalReady, setPortalReady] = useState(false);
  const [deckWidth, setDeckWidth] = useState(0);
  const [placed, setPlaced] = useState<PlacedCard[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0);
  const [activeCycle, setActiveCycle] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [ready, setReady] = useState(false);

  cardsRef.current = cards;
  placedRef.current = placed;

  const resetDeck = useCallback(() => {
    cycleResetPendingRef.current = false;
    setPlaced([]);
    setNextIndex(0);
    setActiveProgress(0);
    setActiveCycle((cycle) => cycle + 1);
    setCycleProgress(0);
  }, []);

  useEffect(() => {
    setPortalReady(true);
    const board = boardRef.current;
    if (!board) return;

    const measure = () => setDeckWidth(board.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedDeckState;
        const validIds = new Set(cardsRef.current.map((card) => card.id));
        const restored = Array.isArray(saved.placed)
          ? saved.placed.filter(
              (item) => validIds.has(item.id) && Number.isFinite(item.x) && Number.isFinite(item.y),
            )
          : [];
        setPlaced(restored);
        const suggested = Number.isInteger(saved.nextIndex) ? saved.nextIndex : 0;
        const restoredIndex = suggested >= 0 && suggested < cardsRef.current.length
          ? findNextCardIndex(suggested, cardsRef.current, restored)
          : findNextCardIndex(0, cardsRef.current, restored);
        setNextIndex(restoredIndex);
      }
    } catch {
      // The deck remains usable when local storage is unavailable or invalid.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const state: SavedDeckState = { nextIndex, placed };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Saving positions is optional.
    }
  }, [nextIndex, placed, ready]);

  const getCard = useCallback((id: string) => cardsRef.current.find((card) => card.id === id), []);

  // The featured card owns its timer. Moving or clicking any already-placed card
  // cannot restart it because the timer only follows the featured-card index.
  useEffect(() => {
    const activeCard = cards[nextIndex];
    if (!ready || !activeCard) {
      setActiveProgress(0);
      return;
    }

    setActiveProgress(0);
    const startedAt = performance.now();
    let advanceTimer: number | undefined;
    const timer = window.setInterval(() => {
      const value = clamp((performance.now() - startedAt) / intervalMs, 0, 1);
      setActiveProgress(value);
      if (value >= 1) {
        window.clearInterval(timer);
        advanceTimer = window.setTimeout(() => {
          const next = findNextCardIndex(nextIndex + 1, cardsRef.current, placedRef.current);
          setNextIndex(next);
          setActiveCycle((cycle) => cycle + 1);
          setActiveProgress(0);
        }, 140);
      }
    }, 32);

    return () => {
      window.clearInterval(timer);
      if (advanceTimer !== undefined) window.clearTimeout(advanceTimer);
    };
  }, [activeCycle, cards, intervalMs, nextIndex, ready]);

  // The synchronized reset begins only when every card is placed. Its timer is
  // independent of card interaction, so picking up or repositioning a card does
  // not restart the six progress bars.
  const allCardsPlaced = cards.length > 0 && placed.length === cards.length;
  useEffect(() => {
    if (!ready || !allCardsPlaced) {
      setCycleProgress(0);
      cycleResetPendingRef.current = false;
      return;
    }

    setCycleProgress(0);
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const value = clamp((performance.now() - startedAt) / intervalMs, 0, 1);
      setCycleProgress(value);
      if (value >= 1) {
        window.clearInterval(timer);
        // Do not remove a card from under an active pointer. Complete the reset
        // immediately after that pointer is released instead.
        if (dragRef.current) {
          cycleResetPendingRef.current = true;
        } else {
          resetDeck();
        }
      }
    }, 32);

    return () => {
      window.clearInterval(timer);
    };
  }, [allCardsPlaced, intervalMs, ready, resetDeck]);

  const beginDrag = (event: ReactPointerEvent<HTMLElement>, id: string, source: DragState["source"]) => {
    event.preventDefault();
    const index = cardsRef.current.findIndex((card) => card.id === id);
    if (index < 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const drag: DragState = {
      id,
      index,
      source,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      clientX: event.clientX,
      clientY: event.clientY,
      moved: false,
      activated: false,
    };
    dragRef.current = drag;
    setDragging(drag);
  };

  // Window-level listeners allow cards to be dropped anywhere on the page.
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (Math.abs(event.clientX - current.startX) + Math.abs(event.clientY - current.startY) > 5) {
        current.moved = true;
      }
      if (current.source === "queue" && current.moved && !current.activated) {
        current.activated = true;
        setNextIndex(findNextCardIndex(current.index + 1, cardsRef.current, placedRef.current, current.id));
      }
      current.clientX = event.clientX;
      current.clientY = event.clientY;
      setDragging({ ...current });
    };

    const onPointerUp = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== event.pointerId) return;

      const boardRect = boardRef.current?.getBoundingClientRect();
      const droppedOnDeck = Boolean(
        boardRect &&
        event.clientX >= boardRect.left &&
        event.clientX <= boardRect.right &&
        event.clientY >= boardRect.top &&
        event.clientY <= boardRect.bottom,
      );
      const pageWidth = Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth);
      const cardWidth = Math.min(deckWidth || 560, Math.max(240, window.innerWidth - 24));

      if (current.moved && droppedOnDeck) {
        // Dropping onto the featured slot restores the card to the front.
        setPlaced((existing) => existing.filter((item) => item.id !== current.id));
        setNextIndex(current.index);
        cycleResetPendingRef.current = false;
      } else if (current.moved) {
        const x = clamp(
          window.scrollX + event.clientX - current.offsetX,
          8,
          Math.max(8, pageWidth - cardWidth - 8),
        );
        const y = Math.max(8, window.scrollY + event.clientY - current.offsetY);
        const dropped: PlacedCard = { id: current.id, x, y };
        setPlaced((existing) => [
          ...existing.filter((item) => item.id !== current.id),
          dropped,
        ]);
      }

      dragRef.current = null;
      setDragging(null);
      if (cycleResetPendingRef.current) resetDeck();
    };

    const onPointerCancel = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (current.source === "queue" && current.activated) setNextIndex(current.index);
      dragRef.current = null;
      setDragging(null);
      if (cycleResetPendingRef.current) resetDeck();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [deckWidth, resetDeck]);

  const activeCard = nextIndex >= 0 && nextIndex < cards.length ? cards[nextIndex] : null;
  const dragItem = dragging ? getCard(dragging.id) : undefined;
  const widthStyle = deckWidth || "min(36rem, calc(100vw - 2rem))";

  const progressBar = (value: number, label: string) => (
    <div className="absolute inset-x-0 bottom-0 h-[5px] bg-ink/15">
      <div
        className="h-full origin-left bg-link transition-transform duration-75 ease-linear"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        style={{ transform: `scaleX(${value})` }}
      />
    </div>
  );

  const renderCard = (
    item: PhysicsCardItem,
    progress: number,
    label: string,
    showProgress = true,
  ) => (
    <Card
      color={item.color}
      padding="md"
      className="relative flex min-h-[7.5rem] w-full flex-col justify-center overflow-hidden rounded-brutal-lg !px-5 !py-4 shadow-brutal-lg sm:min-h-[7rem]"
    >
      <div className="flex min-w-0 flex-col justify-center gap-1.5">
        <p className="break-words font-display text-lg leading-tight font-bold sm:text-xl">{item.title}</p>
        <p className="break-words font-hand text-lg leading-snug font-semibold sm:text-xl">{item.note}</p>
      </div>
      {showProgress && progressBar(progress, label)}
    </Card>
  );

  return (
    <>
      <div
        ref={boardRef}
        className={`relative min-h-[7.5rem] w-full min-w-0 ${className}`}
        aria-label="Sequential SES idea cards. Drag the featured card anywhere on the page, or drop it here to return it to the front."
      >
        {activeCard && !(dragging?.source === "queue" && dragging.id === activeCard.id) && (
          <div
            key={activeCard.id}
            role="group"
            tabIndex={0}
            aria-label={`${activeCard.title}. Drag to place it anywhere on the page. A simple click keeps it in the deck.`}
            onPointerDown={(event) => beginDrag(event, activeCard.id, "queue")}
            className="relative w-full cursor-grab select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-link ses-deck-card-enter"
            style={{ touchAction: "none" }}
          >
            {renderCard(activeCard, activeProgress, `${activeCard.title} rotation progress`)}
          </div>
        )}
        {(!activeCard || (dragging?.source === "queue" && dragging.id === activeCard.id)) && (
          <div className="h-[7.5rem] w-full" aria-hidden="true" />
        )}
      </div>

      {portalReady && createPortal(
        <>
          {placed.map((entry) => {
            if (dragging?.id === entry.id) return null;
            const item = getCard(entry.id);
            if (!item) return null;
            const allPlaced = allCardsPlaced;
            return (
              <div
                key={entry.id}
                role="group"
                tabIndex={0}
                aria-label={`${item.title}. Drag to reposition. Drop on the featured-card slot to return it to the front.`}
                onPointerDown={(event) => beginDrag(event, entry.id, "placed")}
                className="absolute z-[80] cursor-grab select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-link"
                style={{ left: entry.x, top: entry.y, width: widthStyle, touchAction: "none" }}
              >
                {renderCard(
                  item,
                  allPlaced ? cycleProgress : 0,
                  allPlaced ? "Synchronized deck reset progress" : `${item.title} placed card`,
                  allPlaced,
                )}
              </div>
            );
          })}

          {dragging && dragItem && (
            <div
              key={`dragging-${dragging.id}`}
              className="pointer-events-none fixed z-[100]"
              style={{
                left: dragging.clientX - dragging.offsetX,
                top: dragging.clientY - dragging.offsetY,
                width: widthStyle,
              }}
            >
              {renderCard(
                dragItem,
                allCardsPlaced ? cycleProgress : 0,
                allCardsPlaced ? "Synchronized deck reset progress" : `Moving ${dragItem.title}`,
                allCardsPlaced || (dragging.source === "queue" && !dragging.activated),
              )}
            </div>
          )}
        </>,
        document.body,
      )}
    </>
  );
}
