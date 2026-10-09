import { ChevronDown, CircleAlert } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Form controls with a visible label, optional hint and an error message wired up
// through aria-describedby / aria-invalid. Ids derive from `name` unless `id` is given.

interface FieldOwnProps {
  label: string;
  name: string;
  id?: string;
  hint?: string;
  error?: string;
  /** Wrapper class (the control itself uses the shared control style). */
  className?: string;
}

const controlClasses =
  "w-full rounded-brutal border-brutal bg-surface px-3.5 py-2.5 text-base text-ink shadow-brutal placeholder:text-muted focus-ring disabled:opacity-60";

function fieldIds(name: string, id?: string) {
  const control = id ?? `field-${name}`;
  return { control, hint: `${control}-hint`, error: `${control}-error` };
}

function describedBy(ids: ReturnType<typeof fieldIds>, hint?: string, error?: string) {
  return [hint && ids.hint, error && ids.error].filter(Boolean).join(" ") || undefined;
}

function FieldShell({
  label,
  hint,
  error,
  required,
  ids,
  className,
  children,
}: Pick<FieldOwnProps, "label" | "hint" | "error" | "className"> & {
  required?: boolean;
  ids: ReturnType<typeof fieldIds>;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={ids.control} className="font-display font-semibold text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-link">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={ids.hint} className="-mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p
          id={ids.error}
          className="flex items-center gap-1.5 self-start rounded-brutal-sm bg-tile-coral px-2 py-1 text-sm font-medium text-ink border-brutal"
        >
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export type InputProps = FieldOwnProps & Omit<ComponentProps<"input">, keyof FieldOwnProps>;

export function Input({ label, name, id, hint, error, className, required, ...rest }: InputProps) {
  const ids = fieldIds(name, id);
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      ids={ids}
      className={className}
    >
      <input
        id={ids.control}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, hint, error)}
        className={controlClasses}
        {...rest}
      />
    </FieldShell>
  );
}

export type TextareaProps = FieldOwnProps & Omit<ComponentProps<"textarea">, keyof FieldOwnProps>;

export function Textarea({
  label,
  name,
  id,
  hint,
  error,
  className,
  required,
  rows = 4,
  ...rest
}: TextareaProps) {
  const ids = fieldIds(name, id);
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      ids={ids}
      className={className}
    >
      <textarea
        id={ids.control}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, hint, error)}
        className={cn(controlClasses, "resize-y")}
        {...rest}
      />
    </FieldShell>
  );
}

export type SelectProps = FieldOwnProps &
  Omit<ComponentProps<"select">, keyof FieldOwnProps> & {
    options: { value: string; label: string }[];
    /** First, empty option ("Choose a department…"). */
    placeholder?: string;
  };

export function Select({
  label,
  name,
  id,
  hint,
  error,
  className,
  required,
  options,
  placeholder,
  defaultValue,
  ...rest
}: SelectProps) {
  const ids = fieldIds(name, id);
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      ids={ids}
      className={className}
    >
      <div className="relative">
        <select
          id={ids.control}
          name={name}
          required={required}
          defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, hint, error)}
          className={cn(controlClasses, "appearance-none pr-10")}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-ink"
        />
      </div>
    </FieldShell>
  );
}
