import PropTypes from 'prop-types';
import {
	Box,
	Button,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
  IconButton,
	Input,
	SimpleGrid,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { Field, toaster } from '@/components/ui';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { ReactSelect } from '@/components/select';
import { useEffect, useState } from 'react';
import { FiPlus, FiAward, FiEdit } from 'react-icons/fi';
import {
	useCreateAcademicDegreeByPerson,
	useReadAcademicDegrees,
	useUpdateAcademicDegree,
} from '@/hooks/academic_degrees';
import { uploadToS3 } from '@/utils/uploadToS3';
import { RemoveAcademicDegreeModal, ViewAcademicDegreeDocumentModal } from '@/components/modals/academic_degrees';

export const DegreesApplicants = ({ data }) => {
	const [degrees, setDegrees] = useState([]);
	const [nameField, setNameField] = useState('');
	const [universityField, setUniversityField] = useState('');
	const [typeDegreeField, setTypeDegreeField] = useState(null);
	const [fileField, setFileField] = useState(null);
	const [isPending, setIsPending] = useState(false);

	const TypeDegreeOptions = [
		{ value: 1, label: 'Bachiller' },
		{ value: 2, label: 'Título' },
		{ value: 3, label: 'Maestría' },
		{ value: 4, label: 'Doctorado' },
		{ value: 5, label: 'Diploma' },
	];

	const {
		data: dataAcademicDegrees,
		isLoading,
		refetch: fetchAcademicDegrees,
	} = useReadAcademicDegrees({ person_id: data?.id });

	const { mutate: createDegree, isPending: isCreating } =
		useCreateAcademicDegreeByPerson();
	const { mutate: updateDegree, isPending: isUpdating } =
		useUpdateAcademicDegree();

	const [errors, setErrors] = useState({});
	const [editingIndex, setEditingIndex] = useState(null);

	useEffect(() => {
		if (dataAcademicDegrees?.results) {
			setDegrees(
				dataAcademicDegrees.results.map((degree) => ({
					id: degree.id,
					name: degree.name,
					university: degree.university,
					type_degree: degree.type_degree,
					path_url: degree.path_url,
				}))
			);
		}
	}, [dataAcademicDegrees]);

	const handleFileChange = (file) => {
		setFileField(file);

		if (errors.path_url) {
			setErrors((prev) => ({ ...prev, path_url: '' }));
		}
	};

	const resetForm = () => {
		setNameField('');
		setUniversityField('');
		setTypeDegreeField(null);
		setFileField(null);
		setErrors({});
		setEditingIndex(null);
	};

	const editDegree = (index) => {
		const degree = degrees[index];
		setNameField(degree.name);
		setUniversityField(degree.university);
		setTypeDegreeField(degree.type_degree);
		setFileField(degree.path_url);
		setEditingIndex(index);
		setErrors({});
	};

  const validateFields = () => {
    const newErrors = {};
		if (!nameField.trim()) newErrors.name = 'El nombre del título es requerido';
		if (!universityField.trim()) newErrors.university = 'La universidad es requerida';
		if (!typeDegreeField) newErrors.type_degree = 'El tipo de título es requerido';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
  };

	const addDegree = async () => {
		if(!validateFields()) return;

		try {
			setIsPending(true);
			let uploadedUrl = null;

			// Si estamos editando, actualizar el título existente
			if (editingIndex !== null) {
				const degreeToUpdate = degrees[editingIndex];
				
				// Si el archivo cambió, subir el nuevo archivo a S3
				if (fileField && fileField !== degreeToUpdate.path_url) {
					uploadedUrl = await uploadToS3(
						fileField,
						'sga_uni/academic_degrees',
						`${data?.document_num?.replace(/\s+/g, '_') || 'degree'}_${nameField.replace(/\s+/g, '_')}`
					);
				} else {
					// Mantener el archivo existente
					uploadedUrl = degreeToUpdate.path_url;
				}

				// Usar el hook de actualización
				updateDegree(
					{
						id: degreeToUpdate.id,
						payload: {
							name: nameField,
							university: universityField,
							type_degree: typeDegreeField,
							path_url: uploadedUrl,
						}
					},
					{
						onSuccess: () => {
							toaster.create({
								title: 'Título actualizado',
								description: 'El título se ha actualizado correctamente',
								type: 'success',
							});
							fetchAcademicDegrees(); // Recargar datos
							resetForm(); // Limpiar formulario después del éxito
						},
						onError: () => {
							toaster.create({
								title: 'Error',
								description: 'No se pudo actualizar el título',
								type: 'error',
							});
						},
					}
				);
			} else {
				// Crear nuevo título
				// Si hay archivo, subirlo a S3
				if (fileField) {
					uploadedUrl = await uploadToS3(
						fileField,
						'sga_uni/academic_degrees',
						`${data?.document_num?.replace(/\s+/g, '_') || 'degree'}_${nameField.replace(/\s+/g, '_')}`
					);
				}

				const payload = {
					degrees: [{
						name: nameField,
						university: universityField,
						type_degree: typeDegreeField,
						path_url: uploadedUrl,
					}]
				};

				// Crear título en el servidor
				createDegree(
					{ id: data?.id, payload },
					{
						onSuccess: () => {
							toaster.create({
								title: 'Título guardado',
								description: 'El título se ha guardado correctamente',
								type: 'success',
							});
							fetchAcademicDegrees(); // Recargar datos
							resetForm(); // Limpiar formulario después del éxito
						},
						onError: () => {
							toaster.create({
								title: 'Error',
								description: 'No se pudo guardar el título',
								type: 'error',
							});
						},
					}
				);
			}
		} catch (err) {
			console.log(err);
			toaster.create({
				title: 'Error al subir el documento.',
				type: 'error',
			});
		} finally {
			setIsPending(false);
		}
	};

	const getTypeDegreeLabelById = (id) => {
		const option = TypeDegreeOptions.find((opt) => opt.value === id);
		return option ? option.label : 'Sin especificar';
	};

	return (
		<Card.Root shadow='md'>
			<Card.Header>
				<HStack gap={2}>
					<Icon as={FiAward} boxSize={5} color='blue.600' />
					<Heading size='md'>Títulos Académicos</Heading>
				</HStack>
			</Card.Header>

			<Card.Body>
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
						{/* Formulario - Lado izquierdo */}
						<VStack gap={4} align='stretch'>
							<Heading size='sm' color='gray.700'>
								{editingIndex !== null
									? 'Editar Título'
									: 'Agregar Nuevo Título'}
							</Heading>

							<Field
								label='Nombre del Título'
								required
								errorText={errors.name}
								invalid={!!errors.name}
							>
								<Input
									value={nameField}
									onChange={(e) => setNameField(e.target.value)}
									placeholder='Ej: Licenciado en Ingeniería Civil'
								/>
							</Field>

							<Field
								label='Universidad'
								required
								errorText={errors.university}
								invalid={!!errors.university}
							>
								<Input
									value={universityField}
									onChange={(e) =>

										setUniversityField(e.target.value)
									}
									placeholder='Ej: Universidad Nacional de Ingeniería'
								/>
							</Field>

							<Field
								label='Tipo de Título'
								required
								errorText={errors.type_degree}
								invalid={!!errors.type_degree}
							>
								<ReactSelect
									options={TypeDegreeOptions}
									value={TypeDegreeOptions.find(
										(opt) => opt.value === typeDegreeField
									)}
									onChange={(opt) =>
										setTypeDegreeField(opt?.value)
									}
									placeholder='Seleccione tipo de título'
									isClearable
								/>
							</Field>

							<Field
								label='Documento del Título'
								errorText={errors.path_url}
								invalid={!!errors.path_url}
							>
								<CompactFileUpload
									name='degree-document'
									accept='application/pdf,image/png,image/jpeg,image/jpg'
									onChange={handleFileChange}
									defaultFile={
										typeof fileField === 'string'
											? fileField
											: null
									}
									onClear={() => handleFileChange(null)}
									placeholder='Seleccionar documento del título'
								/>
							</Field>

							<Stack direction={{ base: 'column', sm: 'row' }} gap={2}>
								<Button
									type='button'
									onClick={addDegree}
									bg='uni.secondary'
									color='white'
									size='sm'
									_hover={{ bg: 'uni.primary' }}
									leftIcon={editingIndex !== null ? undefined : <FiPlus />}
									isLoading={isPending || (editingIndex !== null ? isUpdating : isCreating)}
								>
									{editingIndex !== null
										? 'Actualizar Título'
										: 'Agregar Título'}
								</Button>

								{editingIndex !== null && (
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={resetForm}
									>
										Cancelar
									</Button>
								)}
							</Stack>
						</VStack>

						{/* Lista de títulos - Lado derecho */}
						<VStack gap={4} align='stretch'>
							<Heading size='sm' color='gray.700'>
								Títulos Agregados ({degrees.length})
							</Heading>

							{ isLoading ? (
                <Text>Cargando títulos...</Text>
              ) : degrees.length === 0 ? (
								<Box
									p={6}
									border='2px dashed'
									borderColor='gray.300'
									borderRadius='md'
									textAlign='center'
									color='gray.500'
								>
									<Text>No hay títulos agregados</Text>
									<Text fontSize='sm'>
										Usa el formulario para agregar títulos
									</Text>
								</Box>
							) : (
								<VStack gap={3} align='stretch' maxH='400px' overflowY='auto'>
									{degrees.map((degree, index) => (
										<Box
											key={degree.id}
											p={4}
											border='1px solid'
											borderColor={
												editingIndex === index ? 'blue.300' : 'gray.200'
											}
											borderRadius='md'
											bg={editingIndex === index ? 'blue.50' : 'white'}
										>
											<Flex justify='space-between' align='start' gap={3}>
												<VStack align='start' gap={1} flex='1'>
													<Text
														fontWeight='semibold'
														fontSize='sm'
														color='gray.700'
													>
														{degree.name}
													</Text>
													<Text fontSize='xs' color='gray.600'>
														{degree.university}
													</Text>
													<Text fontSize='xs' color='gray.500'>
														Tipo: {getTypeDegreeLabelById(degree.type_degree)}
													</Text>
													{degree.path_url && (
														<Text fontSize='xs' color='green.600'>
															✓ Documento adjunto
														</Text>
													)}
												</VStack>

												<HStack gap={1}>
                          <ViewAcademicDegreeDocumentModal item={degree} />
                          <IconButton
                            size='xs'
														bg='yellow.300'
                            color='black'
                            _hover={{ bg: 'yellow.400' }}
														onClick={() => editDegree(index)}
                          >
                            <FiEdit />
                          </IconButton>
                          <RemoveAcademicDegreeModal item={degree} fetchData={fetchAcademicDegrees} />
												</HStack>
											</Flex>
										</Box>
									))}
								</VStack>
							)}
						</VStack>
					</SimpleGrid>
			</Card.Body>
		</Card.Root>
	);
};

DegreesApplicants.propTypes = {
	data: PropTypes.object,
};
