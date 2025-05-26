import { Provider } from '@/components/ui/provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/styles/index.css';
import App from './App.jsx';

window.onload = () => {
	const favicon = document.getElementById('favicon');
	if (favicon) {
		const iconPath = import.meta.env.VITE_FAVICON || '/favicon.svg'; // Usa la variable o el valor por defecto
		favicon.href = iconPath;
	}
	document.title = import.meta.env.VITE_APP_TITLE || 'CRM';
};

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider>
			<App />
		</Provider>
	</StrictMode>
);
