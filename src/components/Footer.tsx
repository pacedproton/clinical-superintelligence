import { nav, site } from '../content/site';

export function Footer({ page }: { page: 'home' | 'case' }) {
  const href = (id: string) => (page === 'home' ? `#${id}` : `/#${id}`);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <p className="site-footer__name">{site.name}</p>
          <p className="site-footer__discipline mono">{site.discipline}</p>
        </div>
        <div className="site-footer__grid">
          <p className="site-footer__statement">{site.footerStatement}</p>
          <nav aria-label="Footer">
            <ul className="site-footer__nav">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={href(n.id)}>{n.label}</a>
                </li>
              ))}
              <li>
                <a href="/case-study/">Full case study</a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="site-footer__meta mono">
          <span>{site.domain}</span>
          <span>&copy; 2026</span>
        </p>
      </div>
    </footer>
  );
}
