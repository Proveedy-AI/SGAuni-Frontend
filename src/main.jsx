import { Provider } from '@/components/ui/provider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/styles/index.css';
import { AuthProvider } from './context';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

window.onload = () => {
	const favicon = document.getElementById('favicon');
	if (favicon) {
		const iconPath = import.meta.env.VITE_FAVICON || '/favicon.png'; // Usa la variable o el valor por defecto
		favicon.href = iconPath;
	}
	document.title = import.meta.env.VITE_APP_TITLE || 'SGA - UNI';
};

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</AuthProvider>
		</Provider>
	</StrictMode>
);
