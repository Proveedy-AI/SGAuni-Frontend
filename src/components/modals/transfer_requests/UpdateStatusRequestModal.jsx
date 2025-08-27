import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
	Box,
	IconButton,
	Stack,
	Button,
	Text,
	Textarea,
	Flex,
	Icon,
	Card,
	Heading,
	SimpleGrid,
	Badge,
	HStack,
} from '@chakra-ui/react';
import { Alert, Field, Modal, toaster, Tooltip } from '@/components/ui';
import {
	FiAlertTriangle,
	FiCheckCircle,
	FiMessageSquare,
	FiXCircle,
} from 'react-icons/fi';
import { FiUser, FiArrowRight, FiEdit, FiRepeat } from 'react-icons/fi';
import { useUpdateTransferRequest } from '@/hooks/transfer_requests';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { uploadToS3 } from '@/utils/uploadToS3';

export const UpdateStatusRequestModal = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const { mutate: update, isPending } = useUpdateTransferRequest();
	const [documents, setDocuments] = useState([{ file: null }]);
	const [comments, setComments] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(null); // 4: Aprobado, 3: Rechazado
	const [errors, setErrors] = useState({});
	const [readInstructions, setReadInstructions] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setReadInstructions(false);
	}, [selectedStatus]);

	const handleFileChange = (file, index) => {
		const updated = [...documents];
		updated[index].file = file;
		setDocuments(updated);
	};

	const handleClear = (index) => {
		const updated = [...documents];
		updated[index].file = null;
		setDocuments(updated);
	};

	const addNewDocumentInput = () => {
		setDocuments([...documents, { file: null }]);
	};

	const validateFields = () => {
		const newErrors = {};
		if (selectedStatus === 3 && !comments.trim()) {
			newErrors.comments = 'El comentario es requerido para rechazar.';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitStatus = async () => {
		setIsLoading(true);

		if (!validateFields()) {
			setIsLoading(false);
			return;
		}

		try {
			let uploadedDocs = [];

			// Subimos cada archivo si es nuevo
			for (const [i, doc] of documents.entries()) {
				if (doc.file instanceof File) {
					const uuid = data?.student_uuid; // usa el uuid o id del estudiante
					const url = await uploadToS3(
						doc.file,
						'sga_uni/transfer_requests',
						`transfer_request_${uuid}_${i}`, // nombre único por índice
						'pdf'
					);
					uploadedDocs.push({
						document_name: `DOCUMENTO ${i + 1} - ${data?.student_full_name.toUpperCase()}`,
						document_url: url,
					});
				}
			}

			const payload = {
				status: selectedStatus,
				comment: comments || 'Aprobado',
			};

			if (selectedStatus === 4 && uploadedDocs.length > 0) {
				payload.documents = uploadedDocs;
			}

			update(
				{ id: data.id, payload },
				{
					onSuccess: () => {
						toaster.create({
							title: 'Solicitud de traslado actualizada correctamente.',
							type: 'success',
						});
						fetchData();
						setDocuments([{ file: null }]); // limpiar
						setOpen(false);
					},
					onError: (error) => {
						toaster.create({
							title: 'Error al actualizar la solicitud de traslado.',
							description: error.message || 'Inténtalo de nuevo más tarde.',
							type: 'error',
						});
					},
				}
			);
		} catch (err) {
			toaster.create({
				title: 'Error inesperado',
				description: err.message || 'No se pudo completar la acción.',
				type: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const isCompleted = selectedStatus && readInstructions;

	const handleOpenChange = (e) => {
		setOpen(e.open);
		if (!e.open) {
			setSelectedStatus(null);
			setComments('');
			setErrors({});
			setReadInstructions(false);
		}
	};

	return (
		<Modal
			placement='center'
			title={
				<>
					<HStack>
						<Icon as={FiCheckCircle} boxSize={5} />
						<Text fontWeight='medium'>
							Aprobar o Rechazar Solicitud de Traslado
						</Text>
					</HStack>
				</>
			}
			trigger={
				<Box>
					<Tooltip
						content='Aprobar / Rechazar'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='green'
							css={{ _icon: { width: '5', height: '5' } }}
							disabled={data.status === 3 || data.status === 4}
						>
							<FiCheckCircle />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='2xl'
			loading={isPending || isLoading}
			open={open}
			onOpenChange={handleOpenChange}
			contentRef={contentRef}
			disabledSave={!isCompleted}
			onSave={handleSubmitStatus}
			hiddenFooter={!selectedStatus}
			saveButtonProps={{ disabled: !readInstructions || isPending }}
		>
			<Stack gap={2} pb={6} maxH='70vh' overflowY='auto'>
				<Card.Root>
					<Card.Header>
						<Heading fontSize='lg'>Selecciona una Acción</Heading>
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
							<Button
								variant='outline'
								size='lg'
								height='4rem'
								flexDirection='column'
								gap={2}
								disabled={isPending}
								bg={selectedStatus === 4 ? 'green.600' : 'transparent'}
								_hover={
									selectedStatus === 4
										? { bg: 'green.700' }
										: {
												bg: 'green.50',
												borderColor: 'green.300',
												color: 'green.700',
											}
								}
								color={selectedStatus === 4 ? 'white' : undefined}
								borderColor={selectedStatus === 4 ? 'green.600' : undefined}
								onClick={() => setSelectedStatus(4)}
							>
								<Icon as={FiCheckCircle} boxSize={5} />
								<Text fontWeight='medium'>Aprobar Solicitud</Text>
							</Button>

							<Button
								variant='outline'
								size='lg'
								height='4rem'
								flexDirection='column'
								gap={2}
								disabled={isPending}
								bg={selectedStatus === 3 ? 'red.600' : 'transparent'}
								_hover={
									selectedStatus === 3
										? { bg: 'red.700' }
										: { bg: 'red.50', borderColor: 'red.300', color: 'red.700' }
								}
								color={selectedStatus === 3 ? 'white' : undefined}
								borderColor={selectedStatus === 3 ? 'red.600' : undefined}
								onClick={() => setSelectedStatus(3)}
							>
								<Icon as={FiXCircle} boxSize={5} />
								<Text fontWeight='medium'>Rechazar Solicitud</Text>
							</Button>
						</SimpleGrid>

						{selectedStatus && (
							<Alert
								mt={6}
								status='info'
								bg={selectedStatus === 4 ? 'green.50' : 'red.50'}
								borderColor={selectedStatus === 4 ? 'green.200' : 'red.200'}
								borderWidth='1px'
								color={selectedStatus === 4 ? 'green.600' : 'red.600'}
								icon={<FiAlertTriangle boxSize={4} mr={2} />}
							>
								<Stack>
									<Text color={selectedStatus === 4 ? 'green.800' : 'red.800'}>
										{selectedStatus === 4
											? 'La solicitud será aprobada y se notificará automáticamente.'
											: 'La solicitud será rechazada. Por favor, proporciona un comentario explicativo.'}
									</Text>
									{selectedStatus === 4 && (
										<>
											{documents.map((doc, i) => (
												<Field key={i} label={`Documento ${i + 1}:`}>
													<CompactFileUpload
														name={`document_${i}`}
														accept='.pdf'
														value={doc.file}
														onChange={(file) => handleFileChange(file, i)}
														onClear={() => handleClear(i)}
													/>
												</Field>
											))}

											<Button
												type='button'
												variant='outline'
												onClick={addNewDocumentInput}
												className='mt-2'
											>
												➕ Agregar otro documento
											</Button>

											<Box mt={2} p={3} bg='green.100' borderRadius='md'>
												<Stack spacing={3}>
													<Flex align='center' gap={2} wrap='wrap'>
														<Icon
															as={FiCheckCircle}
															color='green.600'
															boxSize={5}
														/>
														<Text fontWeight='bold' color='green.900'>
															Instrucciones
														</Text>
													</Flex>
													<Flex
														direction={{ base: 'column', md: 'row' }}
														gap={4}
														align={{ md: 'center' }}
													>
														<Flex align='center' gap={2}>
															<Icon as={FiUser} color='gray.700' boxSize={4} />
															<Text fontSize='sm' color='gray.700'>
																<strong>De:</strong>{' '}
																{data?.from_program_name || ''}
															</Text>
															<Icon
																as={FiArrowRight}
																color='green.700'
																boxSize={4}
															/>
															<Text fontSize='sm' color='green.700'>
																<strong>A:</strong>{' '}
																{data?.to_program_name || ''}
															</Text>
														</Flex>
													</Flex>
													<Flex
														direction={{ base: 'column', md: 'row' }}
														gap={3}
														align={{ md: 'center' }}
													>
														<Flex align='center' gap={2}>
															<Icon as={FiEdit} color='blue.600' boxSize={4} />
															<Text fontSize='sm' color='blue.900'>
																Crear manualmente la nueva matrícula del periodo
																activo en el programa destino.
															</Text>
														</Flex>
														<Flex align='center' gap={2}>
															<Icon
																as={FiRepeat}
																color='purple.600'
																boxSize={4}
															/>
															<Text fontSize='sm' color='purple.900'>
																Convalidar los cursos que sean necesarios.
															</Text>
														</Flex>
													</Flex>
													<Flex align='center' gap={2} mt={2}>
														<input
															type='checkbox'
															id='readInstructionsApprove'
															checked={readInstructions}
															onChange={(e) =>
																setReadInstructions(e.target.checked)
															}
															style={{
																accentColor: '#38A169',
																width: 18,
																height: 18,
															}}
														/>
														<label
															htmlFor='readInstructionsApprove'
															style={{
																fontSize: '0.95em',
																color: '#22543d',
																fontWeight: 500,
															}}
														>
															He leído y comprendo las instrucciones y confirmo
															mi decisión.
														</label>
													</Flex>
												</Stack>
											</Box>
										</>
									)}
									{selectedStatus === 3 && (
										<Flex align='center' gap={2} mt={2}>
											<input
												type='checkbox'
												id='readInstructionsReject'
												checked={readInstructions}
												onChange={(e) => setReadInstructions(e.target.checked)}
												style={{
													accentColor: '#E53E3E',
													width: 18,
													height: 18,
												}}
											/>
											<label
												htmlFor='readInstructionsReject'
												style={{
													fontSize: '0.95em',
													color: '#9B2C2C',
													fontWeight: 500,
												}}
											>
												He leído y comprendo las instrucciones y confirmo mi
												decisión.
											</label>
										</Flex>
									)}
								</Stack>
							</Alert>
						)}
					</Card.Body>
				</Card.Root>

				{selectedStatus === 3 && (
					<Card.Root borderLeft='4px solid' borderLeftColor='red.500'>
						<Card.Header>
							<Flex align='center' gap={2}>
								<Icon as={FiMessageSquare} boxSize={5} color='red.700' />
								<Heading fontSize='lg' color='red.700'>
									Comentario de Rechazo
								</Heading>
								<Badge colorPalette='red' variant='solid' ml={2}>
									Requerido
								</Badge>
							</Flex>
						</Card.Header>
						<Card.Body>
							<Box>
								<Heading fontSize='sm' fontWeight='medium' color='gray.700'>
									Explica las razones del rechazo
								</Heading>
								<Textarea
									minHeight='100px'
									resize='none'
									focusBorderColor='red.500'
									value={comments}
									onChange={(e) => setComments(e.target.value)}
									placeholder='Describe las razones por las cuales la solicitud no puede ser aprobada...'
									disabled={isPending}
								/>
								{errors.comments && (
									<Text fontSize='xs' color='red.500' mt={1}>
										{errors.comments}
									</Text>
								)}
								<Text fontSize='xs' color='gray.500' mt={1}>
									Este comentario será visible para el solicitante.
								</Text>
							</Box>
						</Card.Body>
					</Card.Root>
				)}
			</Stack>
		</Modal>
	);
};

UpdateStatusRequestModal.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};
