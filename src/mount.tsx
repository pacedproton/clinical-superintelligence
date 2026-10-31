import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

/** Hydrates prerendered HTML in production; renders from scratch in dev. */
export function mount(node: ReactNode) {
  const el = document.getElementById('root')!;
  const tree = <StrictMode>{node}</StrictMode>;
  if (el.firstElementChild) hydrateRoot(el, tree);
  else createRoot(el).render(tree);
}
