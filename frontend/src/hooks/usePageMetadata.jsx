import { useEffect } from 'react';

const usePageMetadata = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | TechBlog`;
    }
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
};

export default usePageMetadata;
