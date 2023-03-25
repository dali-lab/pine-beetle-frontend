import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { RESOURCE_ROUTES, ROUTES } from '../constants';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // prevent scrolling up on resources page
    if (pathname !== ROUTES.RESOURCES && !Object.values(RESOURCE_ROUTES).includes(pathname)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
