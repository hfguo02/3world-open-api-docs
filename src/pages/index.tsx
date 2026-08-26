import React, {useEffect} from 'react';

export default function Home(): React.JSX.Element | null {
  useEffect(() => {
    window.location.replace(new URL('introduction', window.location.href).toString());
  }, []);

  return null;
}
