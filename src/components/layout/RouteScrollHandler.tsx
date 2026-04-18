import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HEADER_OFFSET = 96;

export function RouteScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hash) {
        const id = decodeURIComponent(hash.slice(1));
        const target = document.getElementById(id);

        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
          window.scrollTo({ top: Math.max(top, 0), behavior: 'auto' });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
