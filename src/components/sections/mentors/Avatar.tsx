export interface AvatarProps {
  name: string;
  photo?: string | null;
  color?: string;
  className?: string;
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

export function Avatar({ name, photo, color = 'bg-yellow', className = '' }: AvatarProps) {
  return (
    <div className={`brut-sm overflow-hidden ${className}`}>
      {photo ? (
        <img
          src={photo}
          alt={`Portrait of ${name}`}
          width="400"
          height="400"
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110 group-focus-within:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div
          role="img"
          aria-label={`${name} (no photo yet)`}
          className={`flex aspect-square w-full items-center justify-center text-5xl font-bold transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none ${color}`}
        >
          <span aria-hidden="true">{initials(name)}</span>
        </div>
      )}
    </div>
  );
}

export default Avatar;
