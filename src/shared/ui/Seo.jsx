import { useEffect } from 'react';
import { env } from '../config/env';

export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = `${title} | ${env.appName}`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
