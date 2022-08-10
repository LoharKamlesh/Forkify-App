import { TIMEOUT_SEC } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} ${res.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} ${res.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const numberToFraction = function (ingredientQuantity) {
  if (parseFloat(ingredientQuantity) === parseInt(ingredientQuantity)) {
    return ingredientQuantity;
  }
  const gcd = function (a, b) {
    if (b < 0.0000001) {
      return a;
    }
    return gcd(b, Math.floor(a % b));
  };
  const len = ingredientQuantity.toString().length - 2;
  let denominator = Math.pow(10, len);
  let numerator = ingredientQuantity * denominator;
  var divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  let base = 0;
  if (numerator > denominator) {
    base = Math.floor(numerator / denominator);
    numerator -= base * denominator;
  }
  ingredientQuantity = Math.floor(numerator) + '/' + Math.floor(denominator);
  if (base) {
    ingredientQuantity = base + ' ' + ingredientQuantity;
  }
  return ingredientQuantity;
};
