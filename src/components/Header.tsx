import { useEffect, useState } from 'react';
import { nav, site } from '../content/site';

type Props = {
  /** On the home page links are in-page anchors; elsewhere they point back home. */
  page: 'home' | 'case';
};

export function Header({ page }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(page === 'case' ? 'case-study' : null);
  const [scrolled, setScrolled] = useState(false);

  const href = (id: string) => {
    if (page === 'home') return `#${id}`;
    return id === 'case-study' ? '/case-study/' : `/#${id}`;
  };

  // Track the section in view so the current location is announced and shown.
  useEffect(() => {
    if (page !== 'home') return;
    const sections = ['top', ...nav.map((n) => n.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id === 'top' ? null : visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [page]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="wrap site-header__inner">
        <a className="wordmark" href={page === 'home' ? '#top' : '/'} aria-label={`${site.name}, home`}>
          <span className="wordmark__mark" aria-hidden="true" />
          <span className="wordmark__text">{site.name}</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
          <span className="menu-toggle__icon" aria-hidden="true" />
        </button>

        <nav id="site-nav" className="site-nav" aria-label="Primary">
          <ul>
            {nav.map((item, i) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  aria-current={active === item.id ? (page === 'case' ? 'page' : 'location') : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="site-nav__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
