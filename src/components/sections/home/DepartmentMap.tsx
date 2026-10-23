"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { tileColor } from "@/components/ui/variants";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";

export interface DepartmentNode {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  color?: TileColor;
}

export interface DepartmentMapProps {
  departments: DepartmentNode[];
  /** Label of the hub in the middle ("SES core"). */
  centerLabel: string;
  className?: string;
}

// Node positions on a circle (in % of the square map); the first node sits at 12 o'clock.
const RADIUS = 38;

function position(index: number, count: number) {
  const angle = (-90 + (360 / count) * index) * (Math.PI / 180);
  return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) };
}

/**
 * Simplified, interactive department map (DESIGN.md §6.2): departments sit on a hexagon around
 * the SES hub. Hover, focus or tap a node to read its short description in the panel below.
 */
export function DepartmentMap({ departments, centerLabel, className }: DepartmentMapProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelId = useId();
  const active = departments.find((d) => d.id === activeId);
  const points = departments.map((_, i) => position(i, departments.length));

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full overflow-visible"
          fill="none"
        >
          <polygon
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            className="stroke-ink"
            strokeWidth={0.6}
            strokeDasharray="2 1.5"
          />
          {points.map((p, i) => (
            <line
              key={departments[i].id}
              x1={50}
              y1={50}
              x2={p.x}
              y2={p.y}
              strokeWidth={departments[i].id === activeId ? 1.2 : 0.5}
              className={departments[i].id === activeId ? "stroke-link" : "stroke-ink"}
            />
          ))}
        </svg>

        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center gap-0.5 brutal bg-primary px-3 py-2 text-center text-on-primary">
          <span className="font-display text-sm font-bold uppercase">{centerLabel}</span>
          <span className="font-mono text-xs tracking-widest uppercase">
            {departments.length} nodes
          </span>
        </div>

        <ul aria-label="Teams">
          {departments.map((department, i) => {
            const isActive = department.id === activeId;
            return (
              <li
                key={department.id}
                className="absolute w-max max-w-24 -translate-1/2 md:max-w-28"
                style={{ left: `${points[i].x}%`, top: `${points[i].y}%` }}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-controls={panelId}
                  onMouseEnter={() => setActiveId(department.id)}
                  onFocus={() => setActiveId(department.id)}
                  onClick={() => setActiveId(department.id)}
                  className={cn(
                    "w-full press brutal rounded-brutal-sm px-1 py-1.5 text-center text-xs leading-tight font-semibold focus-ring sm:px-2",
                    tileColor({ color: department.color ?? "paper" }),
                    isActive && "underline decoration-2 underline-offset-2 shadow-brutal-lg",
                  )}
                >
                  {department.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        id={panelId}
        aria-live="polite"
        className="min-h-24 rounded-brutal bg-surface p-4 border-brutal"
      >
        {active ? (
          <div className="flex flex-col gap-2">
            <p className="font-display font-bold">{active.name}</p>
            <p className="text-sm text-muted">{active.shortDescription}</p>
            <Link
              href={`/departments/${active.slug}`}
              className="inline-flex items-center gap-1 self-start rounded-brutal-sm text-sm font-semibold focus-ring"
            >
              Meet the team
              <ArrowRight aria-hidden="true" className="size-4" />
              <span className="sr-only">: {active.name}</span>
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Hover or tap a team on the map. Ideas welcome — skills optional.
          </p>
        )}
      </div>
    </div>
  );
}
