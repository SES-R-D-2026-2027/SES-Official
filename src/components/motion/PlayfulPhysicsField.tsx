"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { TileColor } from "@/types/content";

export interface PhysicsCardItem {
  id: string;
  title: string;
  note: string;
  color: TileColor;
  image?: string;
  imageAlt?: string;
}

type BallBody = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  awake: boolean;
  radius: number;
  node: HTMLButtonElement;
};

type CardBody = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  awake: boolean;
  width: number;
  height: number;
  node: HTMLDivElement;
};

type ActiveDrag = {
  kind: "ball" | "card";
  id: number | string;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  lastPointerX: number;
  lastPointerY: number;
  lastDeltaX: number;
  lastDeltaY: number;
  moved: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const storeKey = "ses-physics-card:";
const ballAnchors = [0.18, 0.5, 0.82];

/**
 * Small, click-to-launch SES physics playground. Cards can be moved directly or nudged with
 * arrow keys. Launched logo spheres collide with the cards and each other. Positions persist.
 */
export function PlayfulPhysicsField({
  cards,
  className = "",
  label = "Interactive SES playground",
  heightClassName = "min-h-[22rem] sm:min-h-[19rem]",
}: {
  cards: PhysicsCardItem[];
  className?: string;
  label?: string;
  heightClassName?: string;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<BallBody[]>([]);
  const cardsRef = useRef<CardBody[]>([]);
  const dragRef = useRef<ActiveDrag | null>(null);
  const frameRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const width = board.clientWidth;
    const height = board.clientHeight;
    sizeRef.current = { width, height };
    const isNarrow = width < 620;
    const cardAnchors = isNarrow
      ? cards.length > 3
        ? [[0.02, 0.035], [0.98, 0.035], [0.02, 0.64], [0.98, 0.64]]
        : [[0.02, 0.06], [0.98, 0.06], [0.5, 0.62]]
      : cards.length > 3
        ? [[0.02, 0.04], [0.98, 0.04], [0.02, 0.64], [0.98, 0.64]]
        : [[0.02, 0.08], [0.5, 0.08], [0.98, 0.08]];

    const cardNodes = Array.from(board.querySelectorAll<HTMLDivElement>("[data-physics-card]"));
    cardsRef.current = cardNodes.map((node, index) => {
      const item = cards[index];
      const cardWidth = node.offsetWidth;
      const cardHeight = node.offsetHeight;
      let x = clamp((cardAnchors[index % cardAnchors.length][0] * Math.max(width - cardWidth, 0)), 0, Math.max(width - cardWidth, 0));
      let y = clamp((cardAnchors[index % cardAnchors.length][1] * Math.max(height - cardHeight, 0)), 0, Math.max(height - cardHeight, 0));
      try {
        const saved = localStorage.getItem(`${storeKey}${item.id}`);
        if (saved) {
          const parsed = JSON.parse(saved) as { x?: number; y?: number };
          x = clamp((Number(parsed.x) || 0) * Math.max(width - cardWidth, 0), 0, Math.max(width - cardWidth, 0));
          y = clamp((Number(parsed.y) || 0) * Math.max(height - cardHeight, 0), 0, Math.max(height - cardHeight, 0));
        }
      } catch {
        // Local storage is optional. The cards remain movable without it.
      }
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      return { id: item.id, x, y, vx: 0, vy: 0, awake: false, width: cardWidth, height: cardHeight, node };
    });

    const ballNodes = Array.from(board.querySelectorAll<HTMLButtonElement>("[data-physics-orb]"));
    ballsRef.current = ballNodes.map((node, index) => {
      const diameter = node.offsetWidth || 68;
      const radius = diameter / 2;
      const x = clamp(ballAnchors[index] * width - radius, 0, Math.max(width - diameter, 0));
      const y = clamp(height * (0.9 - index * 0.025) - radius, 0, Math.max(height - diameter, 0));
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      return { id: index, x, y, vx: 0, vy: 0, awake: false, radius, node };
    });

    const paint = () => {
      for (const ball of ballsRef.current) {
        ball.node.style.left = `${ball.x}px`;
        ball.node.style.top = `${ball.y}px`;
      }
      for (const card of cardsRef.current) {
        card.node.style.left = `${card.x}px`;
        card.node.style.top = `${card.y}px`;
      }
    };

    const persistCards = () => {
      const { width: boardWidth, height: boardHeight } = sizeRef.current;
      for (const card of cardsRef.current) {
        try {
          localStorage.setItem(`${storeKey}${card.id}`, JSON.stringify({
            x: card.x / Math.max(boardWidth - card.width, 1),
            y: card.y / Math.max(boardHeight - card.height, 1),
          }));
        } catch {
          // Position saving is a convenience, not a requirement for dragging.
        }
      }
    };

    const startSimulation = () => {
      if (frameRef.current !== null) return;
      const tick = () => {
        const { width: boardWidth, height: boardHeight } = sizeRef.current;
        let moving = false;
        const active = dragRef.current;

        for (const ball of ballsRef.current) {
          if ((active?.kind === "ball" && active.id === ball.id) || !ball.awake) continue;
          ball.vy += 0.22;
          ball.x += ball.vx;
          ball.y += ball.vy;
          ball.vx *= 0.999;
          if (ball.x < 0) { ball.x = 0; ball.vx = Math.abs(ball.vx) * 0.78; }
          if (ball.x + ball.radius * 2 > boardWidth) { ball.x = boardWidth - ball.radius * 2; ball.vx = -Math.abs(ball.vx) * 0.78; }
          if (ball.y < 0) { ball.y = 0; ball.vy = Math.abs(ball.vy) * 0.78; }
          if (ball.y + ball.radius * 2 > boardHeight) {
            ball.y = boardHeight - ball.radius * 2;
            ball.vy = Math.abs(ball.vy) > 1 ? -Math.abs(ball.vy) * 0.58 : 0;
            ball.vx *= 0.985;
            if (Math.abs(ball.vx) < 0.09 && Math.abs(ball.vy) < 0.08) {
              ball.vx = 0;
              ball.vy = 0;
              ball.awake = false;
            }
          }
          if (Math.abs(ball.vx) < 0.035) ball.vx = 0;
          if (Math.abs(ball.vy) < 0.08 && ball.y + ball.radius * 2 >= boardHeight - 1) ball.vy = 0;
        }

        for (const card of cardsRef.current) {
          if ((active?.kind === "card" && active.id === card.id) || !card.awake) continue;
          card.vy += 0.18;
          card.x += card.vx;
          card.y += card.vy;
          card.vx *= 0.985;
          if (card.x < 0) { card.x = 0; card.vx = Math.abs(card.vx) * 0.35; }
          if (card.x + card.width > boardWidth) { card.x = boardWidth - card.width; card.vx = -Math.abs(card.vx) * 0.35; }
          if (card.y < 0) { card.y = 0; card.vy = Math.abs(card.vy) * 0.35; }
          if (card.y + card.height > boardHeight) {
            card.y = boardHeight - card.height;
            card.vy = Math.abs(card.vy) > 0.9 ? -Math.abs(card.vy) * 0.28 : 0;
            card.vx *= 0.9;
            if (Math.abs(card.vx) < 0.09 && Math.abs(card.vy) < 0.08) {
              card.vx = 0;
              card.vy = 0;
              card.awake = false;
            }
          }
          if (Math.abs(card.vx) < 0.06) card.vx = 0;
          if (Math.abs(card.vy) < 0.08 && card.y + card.height >= boardHeight - 1) card.vy = 0;
        }

        // Sphere-to-card collisions transfer momentum to the card.
        for (const ball of ballsRef.current) {
          if ((active?.kind === "ball" && active.id === ball.id) || !ball.awake) continue;
          const centerX = ball.x + ball.radius;
          const centerY = ball.y + ball.radius;
          for (const card of cardsRef.current) {
            if (active?.kind === "card" && active.id === card.id) continue;
            const nearestX = clamp(centerX, card.x, card.x + card.width);
            const nearestY = clamp(centerY, card.y, card.y + card.height);
            let dx = centerX - nearestX;
            let dy = centerY - nearestY;
            const distance = Math.hypot(dx, dy);
            if (distance >= ball.radius) continue;
            if (distance < 0.001) { dx = 0; dy = -1; }
            const length = Math.hypot(dx, dy) || 1;
            const nx = dx / length;
            const ny = dy / length;
            const penetration = ball.radius - distance;
            ball.x += nx * penetration;
            ball.y += ny * penetration;
            const normalSpeed = ball.vx * nx + ball.vy * ny;
            if (normalSpeed < 0) {
              ball.vx -= 1.72 * normalSpeed * nx;
              ball.vy -= 1.72 * normalSpeed * ny;
            }
            card.vx += -nx * Math.max(Math.abs(normalSpeed) * 0.72, 1.8);
            card.vy += -ny * Math.max(Math.abs(normalSpeed) * 0.72, 1.8);
            card.awake = true;
          }
        }

        // Sphere-to-sphere collisions keep all SES orbs responsive to one another.
        const balls = ballsRef.current;
        for (let i = 0; i < balls.length; i += 1) {
          for (let j = i + 1; j < balls.length; j += 1) {
            const a = balls[i];
            const b = balls[j];
            if (!a.awake && !b.awake) continue;
            const dx = (b.x + b.radius) - (a.x + a.radius);
            const dy = (b.y + b.radius) - (a.y + a.radius);
            const distance = Math.hypot(dx, dy);
            const minimum = a.radius + b.radius;
            if (distance >= minimum || distance < 0.001) continue;
            const nx = dx / distance;
            const ny = dy / distance;
            const overlap = (minimum - distance) / 2;
            a.awake = true;
            b.awake = true;
            a.x -= nx * overlap; a.y -= ny * overlap;
            b.x += nx * overlap; b.y += ny * overlap;
            const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (relative < 0) {
              a.vx += relative * nx * 0.82; a.vy += relative * ny * 0.82;
              b.vx -= relative * nx * 0.82; b.vy -= relative * ny * 0.82;
            }
          }
        }

        // Cards push one another when a launched sphere moves them into a neighbour.
        const movingCards = cardsRef.current;
        for (let i = 0; i < movingCards.length; i += 1) {
          for (let j = i + 1; j < movingCards.length; j += 1) {
            const a = movingCards[i];
            const b = movingCards[j];
            if (!a.awake && !b.awake) continue;
            const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
            const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
            if (overlapX <= 0 || overlapY <= 0) continue;
            a.awake = true;
            b.awake = true;
            if (overlapX < overlapY) {
              const direction = a.x + a.width / 2 < b.x + b.width / 2 ? -1 : 1;
              if (!(active?.kind === "card" && active.id === a.id)) a.x += direction * overlapX / 2;
              if (!(active?.kind === "card" && active.id === b.id)) b.x -= direction * overlapX / 2;
              const impulse = (a.vx - b.vx) * 0.22;
              a.vx -= impulse; b.vx += impulse;
            } else {
              const direction = a.y + a.height / 2 < b.y + b.height / 2 ? -1 : 1;
              if (!(active?.kind === "card" && active.id === a.id)) a.y += direction * overlapY / 2;
              if (!(active?.kind === "card" && active.id === b.id)) b.y -= direction * overlapY / 2;
              const impulse = (a.vy - b.vy) * 0.22;
              a.vy -= impulse; b.vy += impulse;
            }
          }
        }

        paint();
        for (const ball of ballsRef.current) {
          if (ball.awake && (Math.abs(ball.vx) > 0.08 || Math.abs(ball.vy) > 0.08)) moving = true;
        }
        for (const card of cardsRef.current) {
          if (card.awake && (Math.abs(card.vx) > 0.08 || Math.abs(card.vy) > 0.08)) moving = true;
        }
        if (moving || dragRef.current) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          frameRef.current = null;
          persistCards();
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    const onResize = () => {
      const nextWidth = board.clientWidth;
      const nextHeight = board.clientHeight;
      sizeRef.current = { width: nextWidth, height: nextHeight };
      for (const card of cardsRef.current) {
        card.width = card.node.offsetWidth;
        card.height = card.node.offsetHeight;
        card.x = clamp(card.x, 0, Math.max(0, nextWidth - card.width));
        card.y = clamp(card.y, 0, Math.max(0, nextHeight - card.height));
      }
      for (const ball of ballsRef.current) {
        ball.x = clamp(ball.x, 0, Math.max(0, nextWidth - ball.radius * 2));
        ball.y = clamp(ball.y, 0, Math.max(0, nextHeight - ball.radius * 2));
      }
      paint();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(board);

    const getBody = (kind: ActiveDrag["kind"], id: ActiveDrag["id"]) =>
      kind === "ball"
        ? ballsRef.current.find((body) => body.id === id)
        : cardsRef.current.find((body) => body.id === id);

    const onPointerMove = (event: PointerEvent) => {
      const active = dragRef.current;
      if (!active || active.pointerId !== event.pointerId) return;
      const body = getBody(active.kind, active.id);
      const rect = board.getBoundingClientRect();
      if (!body) return;
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const nextX = clamp(pointerX - active.offsetX, 0, Math.max(0, sizeRef.current.width - (active.kind === "ball" ? (body as BallBody).radius * 2 : (body as CardBody).width)));
      const nextY = clamp(pointerY - active.offsetY, 0, Math.max(0, sizeRef.current.height - (active.kind === "ball" ? (body as BallBody).radius * 2 : (body as CardBody).height)));
      const deltaX = pointerX - active.lastPointerX;
      const deltaY = pointerY - active.lastPointerY;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 0.5) active.moved = true;
      active.lastDeltaX = deltaX;
      active.lastDeltaY = deltaY;
      active.lastPointerX = pointerX;
      active.lastPointerY = pointerY;
      body.x = nextX;
      body.y = nextY;
      body.vx = 0;
      body.vy = 0;
      body.awake = false;
      paint();
    };

    const onPointerUp = (event: PointerEvent) => {
      const active = dragRef.current;
      if (!active || active.pointerId !== event.pointerId) return;
      const body = getBody(active.kind, active.id);
      if (body) {
        const impulse = active.moved ? 1 : 0;
        if (active.kind === "ball") {
          const ball = body as BallBody;
          ball.vx = active.moved ? clamp(active.lastDeltaX * 0.72, -15, 15) : (ball.id % 2 ? 4.5 : -4.5);
          ball.vy = active.moved ? clamp(active.lastDeltaY * 0.72, -15, 15) : -8.5;
          ball.awake = true;
        } else {
          const card = body as CardBody;
          card.vx = clamp(active.lastDeltaX * 0.28 * impulse, -8, 8);
          card.vy = clamp(active.lastDeltaY * 0.28 * impulse, -8, 8);
          card.awake = Math.abs(card.vx) > 0.08 || Math.abs(card.vy) > 0.08;
        }
      }
      dragRef.current = null;
      startSimulation();
    };

    board.addEventListener("pointermove", onPointerMove);
    board.addEventListener("pointerup", onPointerUp);
    board.addEventListener("pointercancel", onPointerUp);

    // Expose pointer handlers to the React nodes without recreating the physics loop.
    (board as HTMLDivElement & { __sesStartDrag?: (event: ReactPointerEvent<HTMLElement>, kind: ActiveDrag["kind"], id: ActiveDrag["id"]) => void }).__sesStartDrag = (event, kind, id) => {
      const body = getBody(kind, id);
      if (!body) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = board.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const offsetX = pointerX - body.x;
      const offsetY = pointerY - body.y;
      dragRef.current = {
        kind, id, pointerId: event.pointerId, offsetX, offsetY,
        lastPointerX: pointerX, lastPointerY: pointerY,
        lastDeltaX: 0, lastDeltaY: 0, moved: false,
      };
      body.vx = 0;
      body.vy = 0;
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      startSimulation();
    };

    // Keyboard positioning is available for cards and launching for spheres.
    (board as HTMLDivElement & { __sesNudgeCard?: (id: string, dx: number, dy: number) => void; __sesLaunchBall?: (id: number) => void }).__sesNudgeCard = (id, dx, dy) => {
      const card = cardsRef.current.find((body) => body.id === id);
      if (!card) return;
      card.x = clamp(card.x + dx, 0, Math.max(0, sizeRef.current.width - card.width));
      card.y = clamp(card.y + dy, 0, Math.max(0, sizeRef.current.height - card.height));
      paint();
      persistCards();
    };
    (board as HTMLDivElement & { __sesLaunchBall?: (id: number) => void }).__sesLaunchBall = (id) => {
      const ball = ballsRef.current.find((body) => body.id === id);
      if (!ball) return;
      ball.vx += id % 2 ? 4.5 : -4.5;
      ball.vy = -8.5;
      ball.awake = true;
      startSimulation();
    };

    return () => {
      resizeObserver.disconnect();
      board.removeEventListener("pointermove", onPointerMove);
      board.removeEventListener("pointerup", onPointerUp);
      board.removeEventListener("pointercancel", onPointerUp);
      delete (board as HTMLDivElement & { __sesStartDrag?: unknown }).__sesStartDrag;
      delete (board as HTMLDivElement & { __sesNudgeCard?: unknown }).__sesNudgeCard;
      delete (board as HTMLDivElement & { __sesLaunchBall?: unknown }).__sesLaunchBall;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      dragRef.current = null;
    };
  }, [cards]);

  const startDrag = (event: ReactPointerEvent<HTMLElement>, kind: ActiveDrag["kind"], id: ActiveDrag["id"]) => {
    const board = boardRef.current as (HTMLDivElement & { __sesStartDrag?: (event: ReactPointerEvent<HTMLElement>, kind: ActiveDrag["kind"], id: ActiveDrag["id"]) => void }) | null;
    board?.__sesStartDrag?.(event, kind, id);
  };

  const nudgeCard = (id: string, event: ReactKeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-14, 0], ArrowRight: [14, 0], ArrowUp: [0, -14], ArrowDown: [0, 14],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const board = boardRef.current as (HTMLDivElement & { __sesNudgeCard?: (id: string, dx: number, dy: number) => void }) | null;
    board?.__sesNudgeCard?.(id, move[0], move[1]);
  };

  const launchBall = (id: number) => {
    const board = boardRef.current as (HTMLDivElement & { __sesLaunchBall?: (id: number) => void }) | null;
    board?.__sesLaunchBall?.(id);
  };

  return (
    <div className={`relative ${heightClassName} overflow-hidden rounded-brutal-lg border-2 border-dashed border-ink/30 bg-bg/70 dot-grid ${className}`}>
      <div ref={boardRef} className="absolute inset-0 touch-none" aria-label={label}>
        <div className="pointer-events-none absolute top-2 left-3 z-20 rounded-full bg-surface/90 px-3 py-1 font-mono text-[10px] tracking-widest text-muted uppercase">
          Drag cards. Click or drag an SES orb to launch it.
        </div>
        {cards.map((item) => (
          <div
            key={item.id}
            data-physics-card
            role="group"
            tabIndex={0}
            aria-label={`${item.title}. Drag to move or use arrow keys.`}
            onPointerDown={(event) => startDrag(event, "card", item.id)}
            onKeyDown={(event) => nudgeCard(item.id, event)}
            className="absolute z-10 w-[min(14rem,44%)] cursor-grab select-none active:cursor-grabbing focus-ring"
            style={{ left: 0, top: 0 }}
          >
            <Card color={item.color} padding="sm" className="min-h-24 w-full shadow-brutal-lg">
              <div className="flex items-center gap-2">
                {item.image && (
                  <Avatar name={item.title} src={item.image} alt={item.imageAlt ?? item.title} size="lg" fallback="silhouette" />
                )}
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold tracking-widest uppercase">{item.title}</p>
                  <p className="mt-1 font-hand text-base leading-tight font-semibold">{item.note}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
        {ballAnchors.map((_, index) => (
          <button
            key={index}
            type="button"
            data-physics-orb
            aria-label={`SES logo sphere ${index + 1}. Drag or press Enter to launch.`}
            onPointerDown={(event) => startDrag(event, "ball", index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); launchBall(index); }
            }}
            className="ses-physics-orb absolute z-20 flex size-16 items-center justify-center rounded-full border-2 border-white/70 shadow-[0_10px_18px_rgba(8,22,46,0.34),inset_-7px_-9px_14px_rgba(4,21,49,0.38),inset_5px_5px_12px_rgba(255,255,255,0.62)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-link sm:size-[4.5rem]"
            style={{ left: 0, top: 0 }}
          >
            <Image src="/brand/ses-ball-mark.png" alt="" aria-hidden="true" width={38} height={38} draggable={false} className="relative z-10 size-9 object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}
