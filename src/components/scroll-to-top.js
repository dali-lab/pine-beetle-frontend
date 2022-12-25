import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// adopted from: https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
function ScrollToTop({ history, children }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, []);

  return children;
}

export default withRouter(ScrollToTop);
