import slugify from 'slugify';

export const generateSlug = (title) => {
  const base = slugify(title, { lower: true, strict: true, remove: /[*+~.()"!:@]/g });
  return `${base}-${Date.now()}`;
};
