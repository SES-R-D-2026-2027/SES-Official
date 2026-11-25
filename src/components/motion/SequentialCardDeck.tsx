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
  source: "queue" | "placed";
  pointerId: number;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
  moved: boolean;
}

const STORAGE_KEY = "ses-home-sequential-card-deck:v2";
const QUEUE_DURATION = 9_000;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * One wide featured card is shown at a time. A card advances only when the visitor
 * drags and drops it anywhere on the page. Once all six are placed, their progress
 * bars run together and the deck resets to its first card.
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
  const [portalReady, setPortalReady] = useState(false);
  const [deckWidth, setDeckWidth] = useState(0);
  const [placed, setPlaced] = useState<PlacedCard[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

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
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedDeckState;
        const validIds = new Set(cardsRef.current.map((card) => card.id));
        const restored = Array.isArray(saved.placed)
          ? saved.placed.filter((item) => validIds.has(item.id) && Number.isFinite(item.x) && Number.isFinite(item.y))
          : [];
        setPlaced(restored);
        setNextIndex(clamp(Number(saved.nextIndex) || restored.length, 0, cardsRef.current.length));
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

  // When the sixth card is dropped, all six bars fill in sync. Then the deck resets.
  const isDragging = dragging !== null;

  useEffect(() => {
    if (!ready || cards.length === 0 || placed.length !== cards.length || isDragging) return;

    setCycleProgress(0);
    const startedAt = performance.now();
    let resetTimer: number | undefined;
    const timer = window.setInterval(() => {
      const value = clamp((performance.now() - startedAt) / intervalMs, 0, 1);
      setCycleProgress(value);
      if (value >= 1) {
        window.clearInterval(timer);
        resetTimer = window.setTimeout(() => {
          setPlaced([]);
          setNextIndex(0);
          setCycleProgress(0);
        }, 240);
      }
    }, 40);

    return () => {
      window.clearInterval(timer);
      if (resetTimer !== undefined) window.clearTimeout(resetTimer);
    };
  }, [cards.length, intervalMs, isDragging, placed.length, ready]);

  const getCard = useCallback((id: string) => cardsRef.current.find((card) => card.id === id), []);

  const beginDrag = (event: ReactPointerEvent<HTMLElement>, id: string, source: DragState["source"]) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const drag: DragState = {
      id,
      source,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      clientX: event.clientX,
      clientY: event.clientY,
      moved: false,
    };
    dragRef.current = drag;
    setDragging(drag);
  };

  // Window-level listeners let the visitor drop a card on any page section, not just this area.
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== event.pointerId) return;
      if (Math.abs(event.clientX - current.startX) + Math.abs(event.clientY - current.startY) > 5) {
        current.moved = true;
      }
      current.clientX = event.clientX;
      current.clientY = event.clientY;
      setDragging({ ...current });
    };

    const onPointerUp = (event: PointerEvent) => {
      const current = dragRef.current;
      if (!current || current.pointerId !== event.pointerId) return;

      if (current.moved) {
        const pageWidth = Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth);
        const x = clamp(window.scrollX + event.clientX - current.offsetX, 8, Math.max(8, pageWidth - deckWidth - 8));
        const y = Math.max(8, window.scrollY + event.clientY - current.offsetY);
        const dropped: PlacedCard = { id: current.id, x, y };

        setPlaced((existing) => [...existing.filter((item) => item.id !== current.id), dropped]);
        if (current.source === "queue") {
          setNextIndex((index) => Math.min(index + 1, cardsRef.current.length));
        }
      }

      dragRef.current = null;
      setDragging(null);
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (dragRef.current?.pointerId !== event.pointerId) return;
      dragRef.current = null;
      setDragging(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [deckWidth]);

  const activeCard = nextIndex < cards.length ? cards[nextIndex] : null;
  const dragItem = dragging ? getCard(dragging.id) : undefined;
  const activeBar = (value: number, label: string, loop = false) => (
    <div className="absolute inset-x-0 bottom-0 h-[5px] bg-ink/15">
      <div
        className={`h-full origin-left bg-link ${loop ? "ses-card-progress-loop" : "transition-transform duration-75"}`}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={loop ? undefined : Math.round(value * 100)}
        aria-valuetext={loop ? "Repeating progress indicator" : `${Math.round(value * 100)} percent`}
        style={loop ? { animationDuration: `${intervalMs}ms` } : { transform: `scaleX(${value})` }}
      />
    </div>
  );

  const renderCard = (item: PhysicsCardItem, progress: number, label: string, compact = false, loop = false) => (
    <Card
      color={item.color}
      padding="md"
      className={`relative flex min-h-[7rem] w-full flex-col justify-center overflow-hidden rounded-brutal-lg !px-5 !py-4 shadow-brutal-lg ${compact ? "min-h-[6rem]" : ""}`}
    >
      <div className="flex min-w-0 flex-col justify-center gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold sm:text-xl">{item.title}</p>
          <p className="mt-0.5 font-hand text-lg font-semibold leading-tight sm:text-xl">{item.note}</p>
        </div>
        {!compact && (
          <span className="shrink-0 font-mono text-[10px] font-bold tracking-[0.12em] uppercase opacity-75 sm:text-xs">
            Drag to place · reveal next
          </span>
        )}
      </div>
      {activeBar(progress, label, loop)}
    </Card>
  );

  return (
    <>
      <div
        ref={boardRef}
        className={`relative w-full min-w-0 ${className}`}
        aria-label="Sequential SES idea cards. Drag each card anywhere on the page to reveal the next."
      >
        {activeCard && dragging?.source !== "queue" && (
          <div
            role="group"
            tabIndex={0}
            aria-label={`${activeCard.title}. Drag this card anywhere on the page to place it and reveal the next card.`}
            onPointerDown={(event) => beginDrag(event, activeCard.id, "queue")}
            className="relative w-full cursor-grab select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-link"
            style={{ touchAction: "none" }}
          >
            {renderCard(activeCard, 0, "Repeating timer bar on the featured card", false, true)}
          </div>
        )}
        {(!activeCard || dragging?.source === "queue") && (
          <div className="h-[7rem] w-full" aria-hidden="true" />
        )}
      </div>

      {portalReady && createPortal(
        <>
          {placed.map((entry) => {
            if (dragging?.id === entry.id) return null;
            const item = getCard(entry.id);
            if (!item) return null;
            const allPlaced = placed.length === cards.length;
            return (
              <div
                key={entry.id}
                role="group"
                tabIndex={0}
                aria-label={`${item.title}. Drag to reposition anywhere on the page.`}
                onPointerDown={(event) => beginDrag(event, entry.id, "placed")}
                className="absolute z-[80] cursor-grab select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-link"
                style={{ left: entry.x, top: entry.y, width: deckWidth || "min(36rem, calc(100vw - 2rem))", touchAction: "none" }}
              >
                {allPlaced
                  ? renderCard(item, cycleProgress, "Synchronized reset timer for all six cards", true)
                  : (
                    <Card color={item.color} padding="md" className="relative flex min-h-[6rem] w-full flex-col justify-center overflow-hidden rounded-brutal-lg !px-5 !py-4 shadow-brutal-lg">
                      <p className="truncate font-display text-lg font-bold">{item.title}</p>
                      <p className="mt-0.5 font-hand text-lg font-semibold leading-tight">{item.note}</p>
                    </Card>
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
                width: deckWidth || "min(36rem, calc(100vw - 2rem))",
              }}
            >
              {renderCard(
                dragItem,
                dragging.source === "placed" && placed.length === cards.length ? cycleProgress : 0,
                "Dragged SES card",
                dragging.source === "placed",
                dragging.source === "queue",
              )}
            </div>
          )}
        </>,
        document.body,
      )}
    </>
  );
}
