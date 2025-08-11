// src/components/utils/agencyImage.js

// 샘플(폴백) 이미지
import profile1 from '@/assets/icons/sample_profile0.png';
const FALLBACKS = [profile1];

// 2) /src/assets/** 전체를 매니페스트로 (대문자 확장자도 포함)
const ASSET_MANIFEST = import.meta.glob(
  ['/src/assets/**/*.{png,jpg,jpeg,webp,gif,svg,PNG,JPG,JPEG,WEBP,GIF,SVG}'],
  { eager: true, import: 'default' }
);

function hash32(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return h | 0;
}

/**
 * 서버에서 내려오는 다양한 형태의 경로를
 * ASSET_MANIFEST 키 형식(/src/...)으로 정규화
 */
function toSrcKeyLike(u) {
  if (!u) return '';
  let p = String(u).trim();

  // 쿼리/해시 제거 (?v=1, #hash 등)
  p = p.split(/[?#]/)[0];

  // 윈도우 백슬래시 → 슬래시
  p = p.replace(/\\/g, '/');

  // 경로 어딘가에 /src/가 포함되어 있으면 그 지점부터 잘라서 사용
  const idx = p.indexOf('/src/');
  if (idx >= 0) p = p.slice(idx);

  // @ 별칭 → /src
  if (p.startsWith('@/')) p = p.replace(/^@\/+/, '/src/');

  // assets/.. → /src/assets/..
  if (p.startsWith('assets/'))  p = '/src/' + p;
  if (p.startsWith('/assets/')) p = '/src' + p;

  // ./src/... → /src/...
  if (p.startsWith('./src/')) p = p.replace(/^\.\/+/, '/');

  // src/... → /src/...
  if (p.startsWith('src/')) p = '/' + p;

  // 최종적으로 /src/로 시작하면 OK
  return p.startsWith('/src/') ? p : '';
}

// 매니페스트 한 번 생성 시, basename 인덱스 만들어 둠 (키: 파일명, 값: 실제 URL)
const BASENAME_INDEX = Object.fromEntries(
  Object.entries(ASSET_MANIFEST).map(([k, v]) => [k.split('/').pop(), v])
);

/**
 * 서버 URL을 실제 브라우저에서 표시 가능한 URL로 변환
 * 1) 절대 URL/data URL이면 그대로
 * 2) /src/assets/** 로 정규화 가능하면 매니페스트에서 해시된 URL 반환
 * 3) (2) 실패 시 파일명(basename)으로도 한 번 더 조회
 * 4) /public/** 는 / 로 치환
 * 5) 루트 경로(/foo.png)는 그대로 반환(정적서버가 처리)
 * 6) 그 외는 원문 그대로(상대경로/CDN 프리픽스 등)
 */
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

// 3) 최종 API: 서버 URL 우선, 없으면 시드 기반 폴백
export function getAgencyImage(serverUrl, seed) {
  const url = resolveImageUrl(serverUrl);
  if (url) return url;
  const idx = Math.abs(hash32(String(seed || ''))) % FALLBACKS.length;
  return FALLBACKS[idx];
}

export { resolveImageUrl };
