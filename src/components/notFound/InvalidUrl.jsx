// src/pages/InvalidUrl.jsx
import { Box, Text } from '@chakra-ui/react';

export default function InvalidUrl() {
	return (
		<Box p={10} textAlign='center'>
			<Text fontSize='xl' color='red.500'>
				La URL que estás intentando abrir no es válida o está mal formada.
			</Text>
			<Text mt={4}>Por favor, verifica el enlace e inténtalo de nuevo.</Text>
		</Box>
	);
}
