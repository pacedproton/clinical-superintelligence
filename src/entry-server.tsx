import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { Home } from './pages/Home';
import { CaseStudy } from './pages/CaseStudy';

export function render(page: 'home' | 'case'): string {
  return renderToString(<StrictMode>{page === 'home' ? <Home /> : <CaseStudy />}</StrictMode>);
}
