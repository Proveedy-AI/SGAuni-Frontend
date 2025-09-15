import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import {
	Button,
	Stack,
	Text,
	Box,
	Badge,
	Card,
	SimpleGrid,
	Flex,
	VStack,
	Heading,
	IconButton,
} from '@chakra-ui/react';
import { Alert, Modal, toaster, Field, Tooltip } from '@/components/ui';
import { ReactSelect } from '@/components/select';
import { FiPlus, FiX } from 'react-icons/fi';
import { useReadCurriculumMapsCourses } from '@/hooks/curriculum_maps_courses';
import { LuBookPlus } from 'react-icons/lu';
import {
	useBulkCreateConvalidations,
	useReadCourseConvalidations,
} from '@/hooks/curriculum_course_convalidations';

export const CreateConvalidations = ({
	item, // Malla que viene como parámetro
	data, // Todas las mallas
	fetchData,
}) => {
	const [open, setOpen] = useState(false);
	const [selectedOtherCurriculumMap, setSelectedOtherCurriculumMap] =
		useState(null);
	const [selectedCoursesToConvalidate, setSelectedCoursesToConvalidate] =
		useState([]);
	const [selectedCourseParameter, setSelectedCourseParameter] = useState(null);
	const [convalidations, setConvalidations] = useState([]);

	// Estado para convalidaciones ya existentes (no editable)
	const [existingConvalidations, setExistingConvalidations] = useState([]);
	const [readInstructions, setReadInstructions] = useState(false);
	const contentRef = useRef();

	const { mutate: createBulkConvalidations, isPending } =
		useBulkCreateConvalidations();

	// Hook para leer convalidaciones existentes
	const { data: dataCourseConvalidations } = useReadCourseConvalidations({
		enabled: open && !!item?.id,
	});
	// IDs de cursos ya convalidados (para filtrar en ReactSelect)
	const alreadyConvalidatedCourseIds = (dataCourseConvalidations?.results || [])
		.filter((c) => c.curriculum_map_current === item?.id)
		.reduce((acc, c) => {
			// from_curriculum_map puede ser array
			if (Array.isArray(c.from_curriculum_map)) {
				acc.push(...c.from_curriculum_map);
			}
			if (c.to_curriculum_map) {
				acc.push(c.to_curriculum_map);
			}
			return acc;
		}, []);

	// Guardar convalidaciones existentes en estado solo para mostrar
	useEffect(() => {
		if (dataCourseConvalidations?.results) {
			setExistingConvalidations(
				dataCourseConvalidations.results.filter(
					(c) => c.curriculum_map_current === item?.id
				)
			);
		}
	}, [dataCourseConvalidations, item?.id]);

	// Hook para obtener cursos de la malla seleccionada (parámetro)
	const { data: parameterCurriculumCourses } = useReadCurriculumMapsCourses(
		{},
		{ enabled: open && !!item?.id }
	);

	// Hook para obtener cursos de la otra malla seleccionada
	const { data: otherCurriculumCourses } = useReadCurriculumMapsCourses(
		{},
		{ enabled: open && !!selectedOtherCurriculumMap?.value }
	);

	// Filtrar mallas curriculares (excluir la malla parámetro)
	const otherCurriculumMapsOptions =
		data
			?.filter((map) => map.id !== item?.id)
			?.map((map) => ({
				value: map.id,
				label: `${map.code} - ${map.year}`,
				...map,
			})) || [];

	// Filtrar cursos de la malla parámetro usando 'course' como value y excluyendo los ya convalidados
	const parameterCoursesOptions =
		parameterCurriculumCourses?.results
			?.filter((course) => course.curriculum_map === item?.id)
			?.filter((course) => !alreadyConvalidatedCourseIds?.includes(course.id))
			?.map((course) => ({
				value: course.course, // Cambiado de id a course
				label: `${course.course_code} - ${course.course_name}`,
				credits: course.credits,
				cycle: course.cycle,
				...course,
			})) || [];

	// Filtrar cursos de la otra malla seleccionada usando 'course' como value y excluyendo los ya convalidados
	const otherCoursesOptions =
		otherCurriculumCourses?.results
			?.filter(
				(course) => course.curriculum_map === selectedOtherCurriculumMap?.value
			)
			?.filter((course) => !alreadyConvalidatedCourseIds?.includes(course.id))
			?.map((course) => ({
				value: course.course, // Cambiado de id a course
				label: `${course.course_code} - ${course.course_name}`,
				credits: course.credits,
				cycle: course.cycle,
				...course,
			})) || [];

	const [editingIndex, setEditingIndex] = useState(null);

	// Extraer todos los ids de cursos ya usados, excluyendo los de la convalidación en edición
	let usedOtherCoursesIds = convalidations.flatMap((c, idx) =>
		editingIndex !== null && idx === editingIndex
			? []
			: c.courses_to_convalidate
	);
	let usedParameterCourseIds = convalidations
		.map((c, idx) =>
			editingIndex !== null && idx === editingIndex ? null : c.course_parameter
		)
		.filter(Boolean);

	// Filtrar para que no aparezcan, pero permitir los de la convalidación en edición
	const filteredOtherCoursesOptions = otherCoursesOptions?.filter(
		(course) =>
			!usedOtherCoursesIds.includes(course.value) ||
			selectedCoursesToConvalidate.some((sel) => sel.value === course.value)
	);

	const filteredParameterCoursesOptions = parameterCoursesOptions?.filter(
		(course) =>
			!usedParameterCourseIds.includes(course.value) ||
			(selectedCourseParameter &&
				selectedCourseParameter.value === course.value)
	);

	const handleEditConvalidation = (index) => {
		const c = convalidations[index];
		setSelectedCoursesToConvalidate(c.coursesToConvalidateData);
		setSelectedCourseParameter(c.courseParameterData);
		setEditingIndex(index);
	};

	const handleCancelEdit = () => {
		setSelectedCoursesToConvalidate([]);
		setSelectedCourseParameter(null);
		setEditingIndex(null);
	};

	const handleAddConvalidation = () => {
		if (selectedCoursesToConvalidate.length === 0 || !selectedCourseParameter) {
			toaster.create({
				title: 'Selección incompleta',
				description:
					'Debes seleccionar cursos a convalidar y un curso parámetro',
				type: 'warning',
			});
			return;
		}

		const newConvalidation = {
			courses_to_convalidate: selectedCoursesToConvalidate.map((c) => c.value), // value ahora es course
			course_parameter: selectedCourseParameter.value, // value ahora es course
			coursesToConvalidateData: selectedCoursesToConvalidate,
			courseParameterData: selectedCourseParameter,
		};

		if (editingIndex !== null) {
			// Update existente
			const updated = [...convalidations];
			updated[editingIndex] = newConvalidation;
			setConvalidations(updated);
			setEditingIndex(null);
		} else {
			// Agregar nuevo
			setConvalidations([...convalidations, newConvalidation]);
		}

		// Reset
		setSelectedCoursesToConvalidate([]);
		setSelectedCourseParameter(null);
		setEditingIndex(null);
	};

	const removeConvalidation = (index) => {
		setConvalidations(convalidations.filter((_, i) => i !== index));
	};

	const handleSubmitData = async () => {
		if (convalidations.length === 0) {
			toaster.create({
				title: 'Sin convalidaciones',
				description: 'Debes agregar al menos una convalidación',
				type: 'warning',
			});
			return;
		}

		const payload = {
			curriculum_map_old_id: selectedOtherCurriculumMap.value,
			curriculum_map_current_id: item.id,
			convalidations: convalidations.map((convalidation) => ({
				from_course_ids: convalidation.courses_to_convalidate, // ya es array de course
				to_course_id: convalidation.course_parameter, // ya es course
			})),
		};

		createBulkConvalidations(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Convalidaciones creadas correctamente',
					type: 'success',
				});
				setOpen(false);
				setConvalidations([]);
				setSelectedOtherCurriculumMap(null);
				fetchData?.();
			},
			onError: (error) => {
				toaster.create({
					title: 'Error al crear convalidaciones',
					description: error?.response?.data?.message || error.message,
					type: 'error',
				});
			},
		});
	};

	const totalCoursesToConvalidate = convalidations.reduce(
		(sum, c) => sum + c.courses_to_convalidate.length,
		0
	);

	useEffect(() => {
		if (!open) {
			setConvalidations([]);
			setSelectedOtherCurriculumMap(null);
			setSelectedCoursesToConvalidate([]);
			setSelectedCourseParameter(null);
			setEditingIndex(null);
			setReadInstructions(false);
		}
	}, [open]);

	useEffect(() => {
		setConvalidations([]);
		setSelectedCoursesToConvalidate([]);
		setSelectedCourseParameter(null);
		setEditingIndex(null);
	}, [selectedOtherCurriculumMap]);

	return (
		<Modal
			title='Crear Convalidaciones de Malla Curricular'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Crear convalidaciones'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='yellow' size='xs' disabled={!item?.is_editable}>
							<LuBookPlus />
						</IconButton>
					</Tooltip>
				</Box>
			}
			onSave={handleSubmitData}
			loading={isPending}
			disabledSave={!readInstructions || convalidations.length === 0}
			size={'7xl'}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack gap={4} ref={contentRef}>
				<Box p={6} maxH='calc(90vh - 140px)' overflowY='auto'>
					<Stack gap={6}>
						{/* Información de la malla parámetro */}
						<Card.Root bg='blue.50' border='1px solid' borderColor='blue.200'>
							<Card.Header>
								<Card.Title color='blue.700'>
									Malla Curricular Base: {item?.code} - {item?.year}
								</Card.Title>
							</Card.Header>
							<Card.Body>
								<Text fontSize='sm' color='blue.600'>
									Los cursos de esta malla serán los parámetros para las
									convalidaciones
								</Text>
							</Card.Body>
						</Card.Root>

						{/* Selección de otra malla curricular */}
						<Field label='Seleccionar Malla Curricular a Convalidar' required>
							<ReactSelect
								options={otherCurriculumMapsOptions}
								value={selectedOtherCurriculumMap}
								onChange={setSelectedOtherCurriculumMap}
								placeholder='Selecciona una malla curricular'
								isClearable
								isSearchable
							/>
						</Field>

						{/* Formulario de convalidación */}
						{selectedOtherCurriculumMap && (
							<Card.Root>
								<Card.Header>
									<Card.Title>Agregar Convalidación</Card.Title>
								</Card.Header>
								<Card.Body>
									<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
										{/* Cursos a convalidar (múltiple selección) */}
										<Field
											label={`Cursos de ${selectedOtherCurriculumMap.label} (Múltiple)`}
											required
										>
											<ReactSelect
												options={filteredOtherCoursesOptions}
												value={selectedCoursesToConvalidate}
												onChange={setSelectedCoursesToConvalidate}
												placeholder='Selecciona cursos a convalidar'
												isMulti
												isClearable
												isSearchable
											/>
										</Field>

										{/* Curso parámetro (selección única) */}
										<Field
											label={`Curso de ${item?.code} - ${item?.year}`}
											required
										>
											<ReactSelect
												options={filteredParameterCoursesOptions}
												value={selectedCourseParameter}
												onChange={setSelectedCourseParameter}
												placeholder='Selecciona curso parámetro'
												isClearable
												isSearchable
											/>
										</Field>
									</SimpleGrid>

									{/* Botones para agregar o editar convalidación */}
									<Flex gap={2} mt={4}>
										{editingIndex !== null ? (
											<>
												<Button
													onClick={handleAddConvalidation}
													colorPalette='blue'
													disabled={
														!selectedCoursesToConvalidate.length ||
														!selectedCourseParameter
													}
												>
													Guardar Edición
												</Button>
												<Button
													onClick={handleCancelEdit}
													colorPalette='gray'
													variant='outline'
												>
													Cancelar
												</Button>
											</>
										) : (
											<Button
												onClick={handleAddConvalidation}
												colorPalette='blue'
												disabled={
													!selectedCoursesToConvalidate.length ||
													!selectedCourseParameter
												}
											>
												<FiPlus /> Agregar Convalidación
											</Button>
										)}
									</Flex>
								</Card.Body>
							</Card.Root>
						)}

						{/* Lista de convalidaciones agregadas */}
						{convalidations.length > 0 && (
							<VStack gap={4} align='stretch'>
								<Flex justify='space-between' align='center'>
									<Heading fontSize='md' fontWeight='medium' color='gray.900'>
										Convalidaciones Configuradas
									</Heading>
									<Badge colorScheme='green' fontSize='sm'>
										Total: {totalCoursesToConvalidate} cursos a convalidar
									</Badge>
								</Flex>

								<VStack gap={3} align='stretch'>
									{convalidations.map((convalidation, index) => (
										<Card.Root
											key={index}
											border='1px solid'
											borderColor='gray.200'
											rounded='lg'
										>
											<Card.Header>
												<Flex justify='space-between' align='center' w='full'>
													<Card.Title>Convalidación #{index + 1}</Card.Title>
													<Button
														onClick={() => removeConvalidation(index)}
														size='sm'
														variant='ghost'
														colorScheme='red'
													>
														<FiX size={16} />
													</Button>
												</Flex>
											</Card.Header>
											<Card.Body>
												<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
													<Box>
														<Text
															fontSize='sm'
															fontWeight='medium'
															color='gray.700'
															mb={2}
														>
															Cursos a Convalidar (
															{convalidation.coursesToConvalidateData.length}):
														</Text>
														<VStack align='start' gap={1}>
															{convalidation.coursesToConvalidateData.map(
																(course) => (
																	<Text
																		key={course.value}
																		fontSize='sm'
																		color='gray.600'
																	>
																		• {course.label} ({course.credits} créditos)
																	</Text>
																)
															)}
														</VStack>
													</Box>

													<Box>
														<Text
															fontSize='sm'
															fontWeight='medium'
															color='gray.700'
															mb={2}
														>
															Curso Parámetro:
														</Text>
														<Text fontSize='sm' color='gray.600'>
															{convalidation.courseParameterData.label} (
															{convalidation.courseParameterData.credits}{' '}
															créditos)
														</Text>
													</Box>
												</SimpleGrid>
												<Button
													onClick={() => handleEditConvalidation(index)}
													size='sm'
													variant='ghost'
													colorScheme='blue'
												>
													Editar
												</Button>
											</Card.Body>
										</Card.Root>
									))}
								</VStack>
							</VStack>
						)}
						{/* Lista de convalidaciones ya existentes (solo lectura) */}
						{existingConvalidations.length > 0 && (
							<VStack gap={4} align='stretch'>
								<Flex justify='space-between' align='center'>
									<Heading fontSize='md' fontWeight='medium' color='gray.900'>
										Convalidaciones Existentes (No editables)
									</Heading>
									<Badge colorScheme='gray' fontSize='sm'>
										Total: {existingConvalidations.length}
									</Badge>
								</Flex>
								<VStack gap={3} align='stretch'>
									{existingConvalidations.map((c, idx) => (
										<Card.Root
											key={c.id}
											border='1px solid'
											borderColor='gray.100'
											rounded='lg'
											bg='gray.50'
										>
											<Card.Header>
												<Card.Title>Convalidación #{idx + 1}</Card.Title>
											</Card.Header>
											<Card.Body>
												<Text fontSize='sm' color='gray.700'>
													<b>De cursos:</b>{' '}
													{Array.isArray(c.from_curriculum_map)
														? c.from_curriculum_map.join(', ')
														: c.from_curriculum_map}
												</Text>
												<Text fontSize='sm' color='gray.700'>
													<b>A curso:</b> {c.to_curriculum_map}
												</Text>
											</Card.Body>
										</Card.Root>
									))}
								</VStack>
							</VStack>
						)}

						{/* Instrucciones y confirmación */}
						<Alert status='info' title='Información sobre Convalidaciones'>
							Las convalidaciones permitirán que los cursos seleccionados de
							otras mallas curriculares sean equivalentes al curso parámetro de
							la malla base.
						</Alert>

						<Flex align='center' gap={2}>
							<input
								type='checkbox'
								id='readInstructions'
								checked={readInstructions}
								onChange={(e) => setReadInstructions(e.target.checked)}
								style={{ accentColor: '#3182CE', width: 18, height: 18 }}
							/>
							<label
								htmlFor='readInstructions'
								style={{
									fontSize: '0.95em',
									color: '#2D3748',
									fontWeight: 500,
								}}
							>
								He revisado las convalidaciones y confirmo la configuración.
							</label>
						</Flex>
					</Stack>
				</Box>
			</Stack>
		</Modal>
	);
};

CreateConvalidations.propTypes = {
	item: PropTypes.object.isRequired,
	data: PropTypes.array,
	fetchData: PropTypes.func,
};
