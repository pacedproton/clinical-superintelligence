import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { Home } from './pages/Home';
import { CaseStudy } from './pages/CaseStudy';
import { Paper } from './pages/Paper';

export function render(page: 'home' | 'case' | 'paper'): string {
  const node = page === 'home' ? <Home /> : page === 'case' ? <CaseStudy /> : <Paper />;
  return renderToString(<StrictMode>{node}</StrictMode>);
}
