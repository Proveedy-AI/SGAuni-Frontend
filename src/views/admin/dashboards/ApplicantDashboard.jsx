import {
	Box,
	Heading,
	Text,
	SimpleGrid,
	Flex,
	IconButton,
	Button,
	Collapsible,
} from '@chakra-ui/react';

import { useState } from 'react';
import { FaCheckCircle, FaRegWindowClose } from 'react-icons/fa';
import { LuCheckCheck } from 'react-icons/lu';

export const ApplicantDashboard = () => {
	return (
		<Collapsible.Root unmountOnExit>
			<Collapsible.Content>
				<Box
					p={6}
					mb={2}
					borderRadius='lg'
					bgImage="url('/img/congratulation.png')"
					bgSize='cover'
					bgPosition='center'
					mx='auto'
					w={{ base: 'full', md: '95%' }}
					color='white'
					boxShadow='lg'
					position='relative'
				>
					<Flex justify='space-between' align='center' mb={4}>
						<Heading size='lg'>Panel de Postulante</Heading>
					</Flex>

					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
						<Box bg='whiteAlpha.800' p={4} borderRadius='md' color='gray.800'>
							<Heading size='md'>Mis Documentos</Heading>
							<Text mt={2}>Accede a los documentos requeridos.</Text>
						</Box>

						<Box bg='whiteAlpha.800' p={4} borderRadius='md' color='gray.800'>
							<Heading size='md'>Ficha de Inscripción</Heading>
							<Text mt={2}>Descarga tu ficha de inscripción.</Text>
						</Box>
					</SimpleGrid>
				</Box>
			</Collapsible.Content>

			{/* Botón fuera del box, parte inferior */}
			<Collapsible.Trigger asChild>
				<Flex justify='end' w={{ base: 'full', md: '95%' }} mx='auto' mb={4}>
					<IconButton
						size='sm'
						variant='ghost'
						aria-label='Cerrar panel'
						
						_hover={{ bg: 'whiteAlpha.300' }}
					>
						<LuCheckCheck /> Marcar como visto
					</IconButton>
				</Flex>
			</Collapsible.Trigger>
		</Collapsible.Root>
	);
};
