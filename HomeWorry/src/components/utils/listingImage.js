// 매물 이미지 타입별 랜덤 매칭 + 매물 상세페이지와 매물 리스트 동일 랜덤 이미지 배정되도록 하는 로직(leeday)

export const LISTING_TYPE_BY_CAT = {
  'list-oneroom': ['원룸'],
  'list-villa': ['단독/다가구', '빌라', '상가주택', '다세대'],
  'list-officetel': ['오피스텔'],
  'list-flat': ['아파트', '연립'],
};

export function getCatByHousingType(ht) {
  const t = (ht || '').toString();
  for (const [cat, arr] of Object.entries(LISTING_TYPE_BY_CAT)) {
    if (arr.some((label) => t.includes(label))) return cat;
  }
  return null;
}

const toArr = (mods) => Object.values(mods).map((m) => m.default);

const FLAT_IMAGES = toArr(
  import.meta.glob('/src/assets/images/room/flat/flat*.{png,jpg,jpeg,webp}', {
    eager: true,
  })
);
const FLAT_BLUEPRINTS = toArr(
  import.meta.glob(
    '/src/assets/images/room/flat/blueprint*.{png,jpg,jpeg,webp}',
    { eager: true }
  )
);

export const FALLBACK_POOLS = {
  'list-oneroom': toArr(
    import.meta.glob('/src/assets/images/room/oneroom/*.{png,jpg,jpeg,webp}', {
      eager: true,
    })
  ),
  'list-villa': toArr(
    import.meta.glob('/src/assets/images/room/villa/*.{png,jpg,jpeg,webp}', {
      eager: true,
    })
  ),
  'list-officetel': toArr(
    import.meta.glob(
      '/src/assets/images/room/officetel/*.{png,jpg,jpeg,webp}',
      { eager: true }
    )
  ),
  'list-flat': FLAT_IMAGES,
  'list-blueprint': FLAT_BLUEPRINTS,
  default: toArr(
    import.meta.glob('/src/assets/images/room/default/*.{png,jpg,jpeg,webp}', {
      eager: true,
    })
  ),
};

export function normalizeImgUrl(u) {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('//')) {
    if (typeof window !== 'undefined' && window.location?.protocol) {
      return `${window.location.protocol}${u}`;
    }
    return `https:${u}`;
  }
  if (u.startsWith('/')) {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : '';
    return origin ? `${origin}${u}` : u;
  }
  return u;
}

function hash32(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h << 5) + h + str.charCodeAt(i);
  return h | 0;
}

function mapToIndex(seed, n) {
  const x = ((seed >>> 0) * 0x9e3779b1) >>> 0;
  return x % n;
}

export function getFallbackImage(housingType, seedKey = '') {
  const cat = getCatByHousingType(housingType);
  if (cat === 'list-flat' && housingType.includes('아파트')) {
    const flatPool = FALLBACK_POOLS['list-flat'];
    const blueprintPool = FALLBACK_POOLS['list-blueprint'];
    if (!flatPool || flatPool.length === 0 || !blueprintPool || blueprintPool.length === 0) return '';
    const seed = hash32(String(seedKey) + '|' + String(housingType || ''));
    const flatIdx = mapToIndex(seed, flatPool.length);
    const blueprintIdx = mapToIndex(seed, blueprintPool.length);
    return {
      flat: flatPool[flatIdx],
      blueprint: blueprintPool[blueprintIdx]
    };
  }
  const pool = (cat && FALLBACK_POOLS[cat]) || FALLBACK_POOLS.default;
  if (!pool || pool.length === 0) return '';
  const seed = hash32(String(seedKey) + '|' + String(housingType || ''));
  const idx = mapToIndex(seed, pool.length);
  return pool[idx];
}

export function pickPrimaryImage(src) {
  const candidates = [
    src?.mainImage,
    src?.imageUrl,
    src?.thumbnail,
    src?.image,
    Array.isArray(src?.images) ? src.images[0] : null,
    Array.isArray(src?.photos) ? src.photos[0] : null,
  ];

  let url = candidates.find((v) => typeof v === 'string' && v);

  if (!url) {
    const obj = candidates.find((v) => v && typeof v === 'object' && v.url);
    url = obj?.url;
  }
  return normalizeImgUrl(url);
}

export function getListingImage(arg1, seedKey, primaryImage) {
  if (typeof arg1 === 'object' && arg1 !== null) {
    const listing = arg1;
    const primary = pickPrimaryImage(listing);
    if (primary) return primary;
    const seed = listing.id ?? listing.address ?? listing.listing ?? '';
    return getFallbackImage(listing.housingType, seed);
  }

  const housingType = arg1;
  const primary = normalizeImgUrl(primaryImage);
  if (primary) return primary;
  return getFallbackImage(housingType, seedKey);
}
