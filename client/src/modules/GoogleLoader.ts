import { Loader } from '@googlemaps/js-api-loader';

const apiKey = String(import.meta.env.VITE_GOOGLE_API_KEY);

export const GoogleLoader = new Loader({
  apiKey,
  version: 'weekly',
  libraries: ['places']
});
