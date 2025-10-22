// EncryptedStorage.js
import CryptoJS from 'crypto-js';

const SECRET_KEY =  `${import.meta.env.VITE_SECRET_KEY}`;

export const EncryptedStorage = {
	save: (key, data) => {
		const json = JSON.stringify(data);
		const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
		localStorage.setItem(key, encrypted);
	},
	load: (key) => {
		try {
			const encrypted = localStorage.getItem(key);
			if (!encrypted) return null;

			const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
			const decrypted = bytes.toString(CryptoJS.enc.Utf8);
			return JSON.parse(decrypted);
		} catch (e) {
			console.error('Error al desencriptar:', e);
			return null;
		}
	},
	remove: (key) => {
		localStorage.removeItem(key);
	},
};
