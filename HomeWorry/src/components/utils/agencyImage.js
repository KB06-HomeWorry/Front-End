// src/components/utils/agencyImage.js

// 폴백 이미지
import profile1 from '@/assets/icons/sample_profile0.png';
const FALLBACKS = [profile1];

const ASSET_MANIFEST = import.meta.glob(
  ['/src/assets/**/*.{png,jpg,jpeg,PNG,JPG,JPEG,SVG}'],
  { eager: true, import: 'default' }
);

function hash32(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return h | 0;
}

//서버에서 내려오는 경로 /src/... 으로 정규화
function toSrcKeyLike(u) {
  if (!u) return '';
  let p = String(u).trim();
  p = p.split(/[?#]/)[0];
  p = p.replace(/\\/g, '/');
  const idx = p.indexOf('/src/');
  if (idx >= 0) p = p.slice(idx);

  if (p.startsWith('@/')) p = p.replace(/^@\/+/, '/src/');

  if (p.startsWith('assets/'))  p = '/src/' + p;
  if (p.startsWith('/assets/')) p = '/src' + p;

  if (p.startsWith('./src/')) p = p.replace(/^\.\/+/, '/');

  if (p.startsWith('src/')) p = '/' + p;

  // 최종 /src/로 시작하면 리턴
  return p.startsWith('/src/') ? p : '';
}

const BASENAME_INDEX = Object.fromEntries(
  Object.entries(ASSET_MANIFEST).map(([k, v]) => [k.split('/').pop(), v])
);

function resolveImageUrl(serverUrl) {
  if (!serverUrl) return '';

  const raw = String(serverUrl).trim();

  if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw)) return raw;

  const key = toSrcKeyLike(raw);
  if (key && ASSET_MANIFEST[key]) return ASSET_MANIFEST[key];

  const base = raw.split(/[?#]/)[0].replace(/\\/g, '/').split('/').pop();
  if (base && BASENAME_INDEX[base]) return BASENAME_INDEX[base];

  if (raw.startsWith('/public/')) return raw.replace(/^\/public/, '');
  if (raw.startsWith('public/'))  return '/' + raw.replace(/^public\//, '');
  if (raw.startsWith('/')) return raw;

  return raw;
}

// 최종 API - 서버 URL 우선, 없으면 폴백
export function getAgencyImage(serverUrl, seed) {
  const url = resolveImageUrl(serverUrl);
  if (url) return url;
  const idx = Math.abs(hash32(String(seed || ''))) % FALLBACKS.length;
  return FALLBACKS[idx];
}

export { resolveImageUrl };
