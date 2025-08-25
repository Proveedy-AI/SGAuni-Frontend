import PropTypes from 'prop-types';
import {
	Badge,
	Box,
	Card,
	Flex,
	Icon,
	IconButton,
	Input,
	Progress,
	SimpleGrid,
	Stack,
	Text,
	Textarea,
} from '@chakra-ui/react';
import { Alert, Field, Modal, toaster, Tooltip } from '@/components/ui';
import {
	FiCalendar,
	FiCheckCircle,
	FiClock,
	FiFileText,
	FiMessageSquare,
	FiUser,
} from 'react-icons/fi';
import { useState } from 'react';
import { useQualificationAdmissionEvaluation } from '@/hooks/admissions_evaluations/useQualificationAdmissionEvaluation';
import { formatDateString } from '@/components/ui/dateHelpers';
import { LuFileType } from 'react-icons/lu';
import { FaGrinStars } from 'react-icons/fa';

export const UpdateQualificationEvaluationModal = ({ data, fetchData, fetchDataMain }) => {
	const [open, setOpen] = useState(false);
	const [qualification, setQualification] = useState(data.qualification || '');
	const [comment, setComments] = useState(data.feedback || '');
	const { mutateAsync: updateExam, isPending } =
		useQualificationAdmissionEvaluation();

	const handleUpdateQualification = async () => {
		if (qualification < 0 || qualification > 20) {
			toaster.create({
				title: 'la calificación debe estar entre 0 y 20',
				type: 'warning',
			});
			return;
		}

		const payload = {
			feedback: comment,
			qualification: qualification,
		};

		updateExam(
			{ id: data.uuid, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Calificación actualizada correctamente',
						type: 'success',
					});
					fetchData();
					fetchDataMain();
					setOpen(false);
				},
				onError: (error) => {
					toaster.create({
						title: error?.message || 'Error al actualizar la calificación',
						type: 'error',
					});
				},
			}
		);
	};

	const getEvaluationTypeInfo = (type) => {
		const types = {
			1: {
				label: 'Ensayo',
				color: 'blue',
				icon: FiFileText,
			},
			2: {
				label: 'Entrevista',
				color: 'purple',
				icon: FiMessageSquare,
			},
			3: {
				label: 'Examen',
				color: 'green',
				icon: FiCheckCircle,
			},
		};

		return (
			types[type] || {
				label: 'Evaluación',
				colorScheme: 'gray',
				icon: FiFileText,
			}
		);
	};

	const getQualificationLevel = (score) => {
		if (score >= 18) {
			return {
				label: 'Excelente',
				color: 'green.600',
				bg: 'green.50',
			};
		}
		if (score >= 15) {
			return {
				label: 'Bueno',
				color: 'blue.600',
				bg: 'blue.50',
			};
		}
		if (score >= 12) {
			return {
				label: 'Regular',
				color: 'yellow.600',
				bg: 'yellow.50',
			};
		}
		if (score >= 10) {
			return {
				label: 'Deficiente',
				color: 'orange.600',
				bg: 'orange.50',
			};
		}
		return {
			label: 'Insuficiente',
			color: 'red.600',
			bg: 'red.50',
		};
	};

	const typeInfo = getEvaluationTypeInfo(data.type_application);
	const TypeIcon = typeInfo.icon;
	const qualificationNumber = Number.parseFloat(qualification) || 0;
	const qualificationLevel = getQualificationLevel(qualificationNumber);
	const progressPercentage = (qualificationNumber / 20) * 100;

	return (
		<Modal
			title='Calificar Evaluación'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Calificar tarea'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='green'
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FiCheckCircle />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='4xl'
			loading={isPending}
			onSave={handleUpdateQualification}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '75vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<Card.Root borderLeftWidth='4px' borderLeftColor='green.500'>
					<Card.Header pb={3}>
						<Flex align='center' gap={2}>
							<Icon as={LuFileType} boxSize={5} color='green.600' />
							<Text fontSize='20px' fontWeight='bold'>
								Información de la Evaluación
							</Text>
						</Flex>
					</Card.Header>

					<Card.Body>
						<Flex direction={{ base: 'column', md: 'row' }} gap={6}>
							{/* Columna izquierda */}
							<Flex direction='column' gap={4} flex={1}>
								<Flex align='start' gap={3}>
									<Icon as={FiFileText} boxSize={4} color='gray.400' mt={1} />
									<Box>
										<Text fontSize='sm' color='gray.600' fontWeight='medium'>
											Tipo de Evaluación
										</Text>
										<Box mt={1}>
											<Badge
												colorPalette={typeInfo.color}
												borderWidth='1px'
												px={1}
											>
												<Flex align='center' gap={2}>
													<Icon as={TypeIcon} boxSize={3} />
													<Text fontSize={'18px'}>
														{data.type_application_display}
													</Text>
												</Flex>
											</Badge>
										</Box>
									</Box>
								</Flex>

								<Flex align='start' gap={3}>
									<Icon as={FiUser} boxSize={4} color='gray.400' mt={1} />
									<Box>
										<Text fontSize='sm' color='gray.600' fontWeight='medium'>
											Evaluador Asignado
										</Text>
										<Flex align='center' gap={2} mt={1}>
											<Text
												fontWeight='medium'
												fontSize={'18px'}
												color='gray.900'
											>
												{data.evaluator_full_name}
											</Text>
										</Flex>
									</Box>
								</Flex>
							</Flex>

							{/* Columna derecha */}
							<Flex direction='column' gap={4} flex={1}>
								<Flex align='start' gap={3}>
									<Icon as={FiCalendar} boxSize={4} color='gray.400' mt={1} />
									<Box>
										<Text fontSize='sm' color='gray.600' fontWeight='medium'>
											Fecha de Evaluación
										</Text>
										<Text color='gray.900' fontSize={'16px'} mt={1}>
											{formatDateString(data.start_date)}
											{data.start_date !== data.end_date &&
												` - ${formatDateString(data.end_date)}`}
										</Text>
									</Box>
								</Flex>

								<Flex align='start' gap={3}>
									<Icon as={FiClock} boxSize={4} color='gray.400' mt={1} />
									<Box>
										<Text fontSize='sm' color='gray.600' fontWeight='medium'>
											Hora
										</Text>
										<Text color='gray.900' mt={1} fontFamily='mono'>
											{data.evaluation_time}
										</Text>
									</Box>
								</Flex>
							</Flex>
						</Flex>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title display='flex' alignItems='center' gap={2}>
							<Icon as={FaGrinStars} boxSize={5} color='yellow.600' />
							Calificación y Retroalimentación
						</Card.Title>
					</Card.Header>
					<Card.Body display='flex' flexDirection='column' gap={6}>
						{/* Calificación */}
						<Box display='flex' flexDirection='column' gap={4}>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
								{/* Input de calificación */}
								<Box display='flex' flexDirection='column' gap={2}>
									<Field label='calificación: (0-20)' required>
										<Input
											type='number'
											min={0}
											max={20}
											placeholder='Calificación'
											size='xs'
											value={qualification}
											onChange={(e) => setQualification(e.target.value)}
										/>
									</Field>
									{qualification && !isNaN(Number(qualification)) && (
										<Text fontSize='xs' color='gray.500'>
											Equivale al{' '}
											{((Number(qualification) / 20) * 100).toFixed(1)}%
										</Text>
									)}
								</Box>

								{/* Vista previa */}
								{qualification && !isNaN(Number(qualification)) && (
									<Box
										p={4}
										borderRadius='lg'
										borderWidth='1px'
										bg={qualificationLevel.bg}
										borderColor='gray.200'
									>
										<Flex justifyContent='space-between' mb={2}>
											<Text fontSize='sm' fontWeight='medium' color='gray.600'>
												Nivel de Desempeño
											</Text>
											<Text
												fontSize='sm'
												fontWeight='bold'
												color={qualificationLevel.color}
											>
												{qualificationLevel.label}
											</Text>
										</Flex>
										<Progress.Root
											value={progressPercentage}
											size='sm'
											borderRadius='md'
										>
											<Progress.Track
												style={{
													backgroundColor: '#EDF2F7', // gray.200
													borderRadius: '8px',
													overflow: 'hidden',
												}}
											>
												<Progress.Range
													style={{
														backgroundColor: '#000000',
														transition: 'width 0.2s ease',
													}}
												/>
											</Progress.Track>
										</Progress.Root>
										<Flex
											justifyContent='space-between'
											fontSize='xs'
											color='gray.500'
											mt={1}
										>
											<Text>0</Text>
											<Text fontWeight='medium'>{qualification}/20</Text>
											<Text>20</Text>
										</Flex>
									</Box>
								)}
							</SimpleGrid>

							{/* Validación */}
							{qualification &&
								(isNaN(Number(qualification)) ||
									Number(qualification) < 0 ||
									Number(qualification) > 20) && (
									<Alert
										status='error'
										variant='subtle'
										bg='red.50'
										borderColor='red.200'
									>
										La calificación debe ser un número entre 0 y 20.
									</Alert>
								)}
						</Box>

						{/* Comentario */}
						<Box display='flex' flexDirection='column' gap={2}>
							<Field label='Ingresar observación'>
								<Textarea
									placeholder='Observación'
									size='sm'
									value={comment}
									onChange={(e) => setComments(e.target.value)}
								/>
							</Field>
							<Flex
								justifyContent='space-between'
								fontSize='xs'
								color='gray.500'
							>
								<Text>
									Opcional pero recomendado para retroalimentación constructiva
								</Text>
								<Text>{comment.length} caracteres</Text>
							</Flex>
						</Box>

						{/* Info adicional */}
						<Alert
							status='info'
							variant='subtle'
							bg='blue.50'
							borderColor='blue.200'
						>
							<strong>Escala de Calificación:</strong>
							<br />• 18-20: Excelente • 15-17: Bueno • 12-14: Regular • 10-11:
							Deficiente • 0-9: Insuficiente
						</Alert>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

UpdateQualificationEvaluationModal.propTypes = {
	data: PropTypes.object.isRequired,
	fetchData: PropTypes.func.isRequired,
	fetchDataMain: PropTypes.func.isRequired,
};
