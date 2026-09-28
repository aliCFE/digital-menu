const base = (props) => ({
  width: props.size || 20,
  height: props.size || 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: props.strokeWidth || 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export const SearchIcon = (p) => (
  <svg {...base(p)} className={p.className}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const SunIcon = (p) => (
  <svg {...base(p)} className={p.className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const MoonIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
);
export const GlobeIcon = (p) => (
  <svg {...base(p)} className={p.className}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" /></svg>
);
export const PhoneIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg>
);
export const WhatsAppIcon = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} className={p.className} fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.2-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3Z" />
  </svg>
);
export const FacebookIcon = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} className={p.className} fill="currentColor">
    <path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.2C16.3 4.1 15.3 4 14.2 4c-2.4 0-4.1 1.5-4.1 4.1v2.4H7.6v3h2.5V21h3.4Z" />
  </svg>
);
export const TikTokIcon = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 20} height={p.size || 20} className={p.className} fill="currentColor">
    <path d="M16.6 2h-3.2v13.8a2.7 2.7 0 1 1-2.7-2.9c.3 0 .5 0 .8.1V9.8a6 6 0 1 0 5.2 6V8.4a7.6 7.6 0 0 0 4.3 1.4V6.6a4.3 4.3 0 0 1-4.4-4.6Z" />
  </svg>
);
export const StarIcon = (p) => (
  <svg viewBox="0 0 24 24" width={p.size || 14} height={p.size || 14} className={p.className} fill={p.filled === false ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth="1.5">
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
  </svg>
);
export const PlusIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M5 12h14" /></svg>
);
export const CartIcon = (p) => (
  <svg {...base(p)} className={p.className}><circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.5L21.5 8H6" /></svg>
);
export const HomeIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
);
export const XIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const ChevronRightIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="m9 6 6 6-6 6" /></svg>
);
export const ChevronLeftIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="m15 6-6 6 6 6" /></svg>
);
export const CheckIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M20 6 9 17l-5-5" /></svg>
);
export const TrashIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" /></svg>
);
export const EditIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
export const CopyIcon = (p) => (
  <svg {...base(p)} className={p.className}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
export const EyeIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const EyeOffIcon = (p) => (
  <svg {...base(p)} className={p.className}><path d="M17.9 17.9A10.9 10.9 0 0 1 12 20c-7 0-11-8-11-8a19.4 19.4 0 0 1 5-5.9M9.9 4.2A9.6 9.6 0 0 1 12 4c7 0 11 8 11 8a19.4 19.4 0 0 1-2.2 3.1M14.1 14.1a3 3 0 1 1-4.2-4.2" /><path d="M2 2l20 20" /></svg>
);
