'use client';

export default function IkonKategori({ iconKey, className }: { iconKey?: string; className?: string }) {
  const commonProps = {
    className: className || 'h-6 w-6 text-neutral-800 transition group-hover:text-primary-600',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'aria-hidden': 'true' as const,
  };

  switch (iconKey) {
    case 'kulkas':
      return (
        <svg {...commonProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 3h8a2 2 0 0 1 2 2v14H6V5a2 2 0 0 1 2-2Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 10h12M10 7h.01M10 13h.01M9 19v2m6-2v2" />
        </svg>
      );
    case 'mesin-cuci':
      return (
        <svg {...commonProps}>
          <rect x="5" y="3" width="14" height="18" rx="2" strokeWidth="1.8" />
          <circle cx="12" cy="13" r="4" strokeWidth="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7h.01M12 7h.01M16 7h.01" />
        </svg>
      );
    case 'ac':
      return (
        <svg {...commonProps}>
          <rect x="3" y="6" width="18" height="6" rx="2" strokeWidth="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 12v2m5-2v4m5-4v2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 18c0 1-.8 2-1.8 2M12 20c0 1-.8 1.8-1.8 1.8M17 18c0 1 .8 2 1.8 2" />
        </svg>
      );
    case 'tv':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="12" rx="2" strokeWidth="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19h6m-4-2 1 2 1-2" />
        </svg>
      );
    case 'kipas-angin':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="10" r="3" strokeWidth="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 13v8m-4 0h8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 7c1.5-2.5 5-.6 4.3 1.8-.4 1.2-1.8 1.9-4.3 1.2M9.4 11.5c-2.8.8-4.7-2.5-2.6-4.1 1-.8 2.6-.5 4.2 1.6M12.7 10.7c1.3 2.6-1.6 5.4-3.9 4.2-1.1-.6-1.4-2.1-.1-4.5" />
        </svg>
      );
    case 'blender':
      return (
        <svg {...commonProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 3h4l1 7H9l1-7Zm-2 7h8l1 9H7l1-9Zm2 9v2m4-2v2" />
        </svg>
      );
    case 'rice-cooker':
      return (
        <svg {...commonProps}>
          <rect x="5" y="7" width="14" height="10" rx="4" strokeWidth="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 7V5h6v2m-8 4h10m-6 6v2h2v-2" />
        </svg>
      );
    case 'dispenser':
      return (
        <svg {...commonProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 4h8l1 6H7l1-6Zm-1 6h10v9H7v-9Zm5 3v4" />
        </svg>
      );
    case 'water-heater':
      return (
        <svg {...commonProps}>
          <rect x="7" y="3" width="10" height="18" rx="3" strokeWidth="1.8" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 8h4M10 12h4M10 16h4" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5h6v6H5zm8 0h6v6h-6zM5 13h6v6H5zm8 0h6v6h-6z" />
        </svg>
      );
  }
}

