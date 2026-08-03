import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sc_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sc_token');
      localStorage.removeItem('sc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads';

export const getImageUrl = (path, type = 'posters') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${uploadsUrl}/${type}/${path}`;
};

export const ARTIST_COVERS = {
  'Crayon Case': 'https://f4.bcbits.com/img/a3253599809_10.jpg',
  'Reality Club': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwYfNnHtyWEVqP4fl087k7QOQJIexWOH9TX-k8i5fDqA&s',
  'The Milo': 'https://i.scdn.co/image/ab67616d0000b273d848576bdd6be0a638cca09b',
  'Wave to Earth': 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/16/ec/bf16ec6f-d1ca-51bb-dc80-aa1e3a479ff7/cover_W2E.jpg/600x600bb.jpg',
};

export const CONCERT_BRANCH_COVERS = {
  // Reality Club Branches
  'reality-club-city-lights-jakarta-2026': 'https://assets.loket.com/neo/production/images/banner/20260116203736_696a3f2030a5c.jpg',
  'reality-club-city-lights-bandung-2026': 'https://assets.loket.com/neo/production/images/banner/20240715172204_6694f84ca9df5.jpg',
  'reality-club-city-lights-yogyakarta-2026': 'https://assets.loket.com/neo/production/images/banner/20240715172509_6694f905750e9.jpg',

  // The Milo Branches
  'the-milo-acoustic-jakarta-2026': 'https://i.scdn.co/image/ab67616d0000b273d848576bdd6be0a638cca09b',
  'the-milo-acoustic-surabaya-2026': 'https://i.scdn.co/image/ab67616d0000b273df3a0ec97de41c2cfadf70c5',
  'the-milo-acoustic-yogyakarta-2026': 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/84/37/4d/84374dc2-ffef-193a-eb80-0a5eb5b01ce4/artwork.jpg/600x600bb.jpg',

  // Wave to Earth Branches
  'wave-to-earth-flaws-and-all-jakarta-2026': 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/16/ec/bf16ec6f-d1ca-51bb-dc80-aa1e3a479ff7/cover_W2E.jpg/600x600bb.jpg',
  'wave-to-earth-flaws-and-all-surabaya-2026': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOcuS9GbJkWZ3XG2ISFvtzV7EbPJzcVmKZ-X8Y5YqXx_ZdlxmgqANb-Nbb&s=10',

  // Crayon Case
  'crayon-case-live-in-jakarta-2026': 'https://f4.bcbits.com/img/a3253599809_10.jpg',
};

export const getConcertPoster = (concert) => {
  if (!concert) return ARTIST_COVERS['Crayon Case'];
  const poster = concert.poster || concert.image || concert.poster_url;
  if (poster && typeof poster === 'string' && poster.startsWith('http')) return poster;
  if (poster && typeof poster === 'string' && !poster.includes('images') && !poster.includes('static') && poster !== 'userImg0') {
    return getImageUrl(poster, 'posters');
  }

  // Check specific branch/city slug
  const slug = concert.slug || (concert.title ? concert.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
  if (slug && CONCERT_BRANCH_COVERS[slug]) {
    return CONCERT_BRANCH_COVERS[slug];
  }

  // Matching slug keywords
  for (const [key, url] of Object.entries(CONCERT_BRANCH_COVERS)) {
    if (slug && slug.includes(key)) return url;
  }

  const artist = concert.artist_name || concert.artist;
  if (artist && ARTIST_COVERS[artist]) {
    return ARTIST_COVERS[artist];
  }
  return ARTIST_COVERS['Crayon Case'];
};

export default api;
