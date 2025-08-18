import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, toaster, Tooltip } from '@/components/ui';
import {
	Box,
	Card,
	Flex,
	Heading,
	HStack,
	IconButton,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	FiAlertTriangle,
	FiCalendar,
	FiCheckCircle,
	FiSend,
	FiUser,
} from 'react-icons/fi';

import { formatDateString } from '@/components/ui/dateHelpers';
import { useCreateEnrollmentsProgramsReview } from '@/hooks/enrollments_programs/useCreateEnrollmentsProgramsReview';

export const SendAEnrollmentProgramtoConfirmForm = ({ fetchData, item }) => {
	const [open, setOpen] = useState(false);

	const { mutate: createProgramsReview, isPending: LoadingProgramsReview } =
		useCreateEnrollmentsProgramsReview();

	const handleSubmitData = () => {
		createProgramsReview(item.id, {
			onSuccess: () => {
				toaster.create({
					title: 'Programa enviado correctamente',
					type: 'success',
				});
				fetchData();
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Enviar Proceso de Matrícula para Aprobación'
			placement='center'
			size='4xl'
			trigger={
				<Box>
					<Tooltip
						content={
							item.status === 2
								? 'Ya fue enviado para aprobación'
								: item.status === 4
									? 'Aprobado'
									: 'Enviar para aprobación'
						}
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							disabled={item.status === 4 || item.status === 2}
							colorPalette='green'
							size='xs'
						>
							<FiSend />
						</IconButton>
					</Tooltip>
				</Box>
			}
			onSave={handleSubmitData}
			loading={LoadingProgramsReview}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '70vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				{/* Content */}
				<Stack gap={4}>
					<Box
						bg='yellow.50'
						border='1px solid'
						borderColor='yellow.300'
						borderRadius='md'
						p={4}
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
							{item.program_name && (
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
							)}

							<VStack
								gap={3}
								align='start'
								mt={4}
								pt={2}
								borderTop='1px solid'
								borderColor='gray.100'
							>
								{item.semester_start_date && (
									<HStack spacing={2} fontSize='sm' color='gray.600'>
										<FiCalendar size={16} color='#9333EA' />
										<Text>Inicio de semestre:</Text>
										<Text fontWeight='medium' color='gray.800'>
											{formatDateString(item.semester_start_date)}
										</Text>
									</HStack>
								)}
								<HStack spacing={2} fontSize='sm' color='gray.600'>
									<FiUser size={16} color='#9333EA' />
									<Text>Director a enviar:</Text>
									<Text fontWeight='medium' color='gray.800'>
										{item.director_name}
									</Text>
								</HStack>
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
				</Stack>
			</Stack>
		</Modal>
	);
};

SendAEnrollmentProgramtoConfirmForm.propTypes = {
	fetchData: PropTypes.func,
	onRoleCreated: PropTypes.func,
	item: PropTypes.object,
};
