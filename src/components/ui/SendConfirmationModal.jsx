'use client';

import {
	Box,
	Flex,
	Text,
	IconButton,
	Button,
	VStack,
	HStack,
	Heading,
	Card,
} from '@chakra-ui/react';

import PropTypes from 'prop-types';
import { Tooltip } from '.';
import {
	FiAlertTriangle,
	FiCalendar,
	FiCheckCircle,
	FiLoader,
	FiSend,
	FiX,
} from 'react-icons/fi';
import { LuFileCheck } from 'react-icons/lu';

export const SendConfirmationModal = ({
	openSend,
	setOpenSend,
	item,
	onConfirm,
	loading = false,
}) => {
	const handleConfirm = () => {
		onConfirm(item.id);
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'No especificada';
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	if (!openSend) {
		return (
			<Tooltip
				content={
					item.status === 4
						? 'Ya fue enviado para aprobación'
						: 'Enviar para aprobación'
				}
				positioning={{ placement: 'bottom-center' }}
				showArrow
				openDelay={0}
			>
				<IconButton
					onClick={() => setOpenSend(true)}
					colorPalette='green'
					size='sm'
					disabled={item.status === 4}
				>
					<FiSend />
				</IconButton>
			</Tooltip>
		);
	}

	return (
		<Box
			position='fixed'
			inset={0}
			bg='blackAlpha.600'
			display='flex'
            borderRadius={'20px'}
			alignItems='center'
			justifyContent='center'
			p={4}
			zIndex={50}
            
		>
			<Box
				bg='white'
				borderRadius='lg'
				boxShadow='xl'
				w='full'
				maxW='90vh'
				maxH='90vh' // Máximo 90% del alto de la ventana
                overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}s
				// Scroll si el contenido se excede
			>
				{/* Header */}
				<Box px={6} py={4}>
					<Flex justify='space-between' align='center'>
						<HStack gap={3}>
							<Box bg='whiteAlpha.300' p={2} borderRadius='full'>
								<FiSend size={20} />
							</Box>
							<Box>
								<Text fontSize='xl' fontWeight='bold'>
									Enviar para Aprobación
								</Text>
								<Text fontSize='sm' color='green'>
									Confirmación requerida
								</Text>
							</Box>
						</HStack>
						<IconButton
							aria-label='Cerrar'
							onClick={() => setOpenSend(false)}
							variant='ghost'
							size='sm'
						
							disabled={loading}
						>
							<FiX size={16} />
						</IconButton>
					</Flex>
				</Box>

				{/* Content */}
				<Box p={6} pt={4}>
					<Box
						bg='yellow.50'
						border='1px solid'
						borderColor='yellow.300'
						borderRadius='md'
						p={4}
						mb={5}
						display='flex'
						alignItems='flex-start'
						gap={3}
						flexWrap='wrap' // <- Permitir que el texto salte si no cabe
					>
						<Box mt={1} flexShrink={0}>
							<FiAlertTriangle color='#D97706' />
						</Box>

						<Box flex='1' minW={0} wordBreak='break-word'>
							<Heading
								as='h4'
								size='sm'
								fontWeight='bold'
								color='blue.900'
								mb={2}
							>
								¿Estás seguro?
							</Heading>
							<Text color='gray.800'>
								Esta acción enviará el programa para revisión y aprobación del
								cronograma.
							</Text>
						</Box>
					</Box>
					<Card.Root borderLeft='4px solid' borderLeftColor='green.500'>
						<Card.Header pb={0}>
							<Text fontWeight='semibold'>Programa a enviar:</Text>
						</Card.Header>
						<Card.Body pt={2}>
							<Box
								bg='green.50'
								border='1px solid'
								borderColor='green.200'
								borderRadius='md'
								p={3}
								fontWeight='bold'
								color='green.700'
							>
								{item.program_name}
							</Box>

							<VStack
								spacing={3}
								align='start'
								mt={4}
								pt={2}
								borderTop='1px solid'
								borderColor='gray.100'
							>
								{item.study_mode_display && (
									<HStack spacing={2} fontSize='sm' color='gray.600'>
										<LuFileCheck size={16} color='#3B82F6' />
										<Text>Modo:</Text>
										<Text fontWeight='medium' color='gray.800'>
											{item.study_mode_display}
										</Text>
									</HStack>
								)}
								{item.semester_start_date && (
									<HStack spacing={2} fontSize='sm' color='gray.600'>
										<FiCalendar size={16} color='#9333EA' />
										<Text>Inicio de semestre:</Text>
										<Text fontWeight='medium' color='gray.800'>
											{formatDate(item.semester_start_date)}
										</Text>
									</HStack>
								)}
							</VStack>
						</Card.Body>
					</Card.Root>

					<Box
						bg='blue.50'
						p={4}
						mt={6}
						rounded='lg'
						border='1px solid'
						borderColor='blue.200'
					>
						<Flex gap={3} align='start'>
							<Box bg='blue.100' p={2} borderRadius='full'>
								<FiCheckCircle size={16} color='#2563EB' />
							</Box>
							<Box>
								<Text fontWeight='semibold' color='blue.900' mb={2}>
									¿Qué sucederá después?
								</Text>
								<VStack
									spacing={1}
									align='start'
									fontSize='sm'
									color='blue.800'
								>
									<Text>• El programa será enviado al comité de revisión</Text>
									<Text>
										• Recibirás una notificación del estado de la revisión
									</Text>
									<Text>
										• El cronograma será evaluado y aprobado o rechazado
									</Text>
									<Text>
										• No podrás editar el programa hasta recibir feedback
									</Text>
								</VStack>
							</Box>
						</Flex>
					</Box>
				</Box>

				{/* Footer */}
				<Flex
					px={6}
					py={4}
					bg='gray.50'
					justify='flex-end'
					borderTop='1px solid'
					borderColor='gray.100'
					gap={3}
				>
					<Button
						onClick={() => setOpenSend(false)}
						variant='outline'
						isDisabled={loading}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleConfirm}
						colorPalette='green'
						minW='120px'
						loading={loading}
                        loadingText='Enviando...'
						leftIcon={!loading ? <FiSend size={16} /> : undefined}
						spinner={<FiLoader className='animate-spin' size={16} />}
					>
						Enviar 
					</Button>
				</Flex>
			</Box>
		</Box>
	);
};

SendConfirmationModal.propTypes = {
	item: PropTypes.object.isRequired,
	onConfirm: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	openSend: PropTypes.bool.isRequired,
	setOpenSend: PropTypes.func.isRequired,
};
