let scriptLoadPromise = null;

export function loadPostcodeScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window is not defined'));
  }

  if (window.daum && window.daum.Postcode) {
    return Promise.resolve();
  }

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Daum postcode script load failed'));
      document.body.appendChild(script);
    });
  }

  return scriptLoadPromise;
}

export async function openPostcode(onComplete) {
  try {
    await loadPostcodeScript();
    new window.daum.Postcode({ oncomplete: onComplete }).open();
  } catch (error) {
    console.error(error);
  }
}
