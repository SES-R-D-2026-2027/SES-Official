export interface MentorLink {
  email?: string;
  linkedin?: string;
  github?: string;
}

const labels: Record<string, string> = { email: 'Email', linkedin: 'LinkedIn', github: 'GitHub' };

export function ContactLinks({ name, links = {} }: { name: string; links?: MentorLink }) {
  const entries = Object.entries(links).filter(([k, v]) => v && labels[k]) as [string, string][];
  if (!entries.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <li key={key}>
          <a
            href={key === 'email' ? `mailto:${value}` : value}
            {...(key === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            aria-label={`${labels[key]} of ${name}`}
            className="brut-sm inline-block bg-white px-2 py-0.5 font-mono text-[11px] font-bold uppercase hover:bg-yellow"
          >
            {labels[key]}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default ContactLinks;
