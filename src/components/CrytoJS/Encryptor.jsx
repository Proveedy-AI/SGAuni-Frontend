// Encryptor.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = `${import.meta.env.VITE_SECRET_KEY}`; // o puedes pasarla como argumento si prefieres

export const Encryptor = {
  encrypt: (data) => {
    const json = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
    return encrypted;
  },

  decrypt: (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error al desencriptar:', error);
      return null;
    }
  },
};
