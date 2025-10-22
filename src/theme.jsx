import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
	theme: {
		tokens: {
			colors: {
				uni: {
					100: '#F2F2F2',
					200: '#D9F0FF',
					300: '#BAE4FF',
					400: '#88CEFA',
					primary: '#8B1F1F',   // Rojo oscuro profundo
					secondary: '#711610', // Rojo brillante oscuro
					gray: {
						100: '#BAC3CE',
						200: '#788193',
						300: '#2F3D4B',
						400: '#1A2129',
						500: '#151A20',
						600: '#0F1319',
						700: '#0B0E13',
						800: '#07090D',
						900: '#040507',
					},
					yellow: {
						100: '#FFF3CF',
						200: '#FFE9A5',
						300: '#FFD75C',
						400: '#F0B90E',
					},
					red: {
						100: '#FFD2D2', // Rojo suave
						200: '#FBB1B1', // Rojo pastel
						300: '#F47E7E', // Rojo medio
						400: '#DD5757', // Rojo oscuro
						500: '#B03D3D', // Rojizo cálido
						600: '#8F2A2A', // Rojo más fuerte
						700: '#7C1D1D', // Rojo intenso
						800: '#6A1010', // Rojo muy oscuro
					},
					green: {
						100: '#CAFFE2',
						200: '#8DF1BB',
						300: '#5CDC97',
						400: '#12B75E',
					},
					blue: {
						100: '#C5DCFF',
						200: '#7CB1FF',
						300: '#7CB1FF',
						400: '#0166FE',
					},
					purple: {
						100: '#DEC5FF',
						200: '#BF90FC',
						300: '#9F5BF8',
						400: '#873BE9',
					},
				},
			},
		},
	},
});
