import { ReactSelect } from '@/components/select';
import { Checkbox, Field, Modal, toaster, Tooltip } from '@/components/ui';
import { useReadCourses } from '@/hooks/courses';
import {
	useBulkCreateCurriculumMapCourses,
	useReadCurriculumMapsCourses,
} from '@/hooks/curriculum_maps_courses';
import {
	Box,
	Button,
	Card,
	Flex,
	Heading,
	IconButton,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { BsBook, BsPencil, BsTrash } from 'react-icons/bs';
import { FiBook, FiPlus } from 'react-icons/fi';

export const AddCoursesToCurriculumMap = ({ item, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [form, setForm] = useState({
		course_id: null,
		is_mandatory: false,
		cycle: '',
		credits: '',
		prerequisite_ids: [],
	});
	const [coursesList, setCoursesList] = useState([]);
	const [errors, setErrors] = useState({});
	const [editIdx, setEditIdx] = useState(null);

	const { mutate: addCoursesToCurriculum, isPending } =
		useBulkCreateCurriculumMapCourses();
	const {
		data: dataCurriculumMapsCourses,
		isLoading: isLoadingCurriculumMapsCourses,
		refetch: fetchCurriculumMapsCourses,
	} = useReadCurriculumMapsCourses(
    { curriculum_map: item.id },
    {  enabled: open && !!item?.id }
  );

	const filteredCoursesByCurriculumMap = dataCurriculumMapsCourses?.results || [];

	const { data: dataCourses, isLoading: loadingCourses } = useReadCourses(
		{},
		{ enabled: open }
	);
	const courseOptions =
		dataCourses?.results
			?.filter(
				(course) =>
					!filteredCoursesByCurriculumMap?.some(
						(cmc) => cmc.course === course.id
					)
			)
			?.filter((course) =>
				editIdx !== null
					? true
					: !coursesList.some((c) => c.course_id === course.id)
			)
			?.map((course) => ({
				value: course.id,
				label: `${course.code} - ${course.name}`,
			})) || [];

	useEffect(() => {
		if (form.course_id && (form.credits === '' || form.credits === null)) {
			const selectedCourse = dataCourses?.results?.find(
				(c) => c.id === form.course_id
			);
			if (selectedCourse && selectedCourse.default_credits) {
				setForm((prev) => ({
					...prev,
					credits: selectedCourse.default_credits,
				}));
			}
		}
		// eslint-disable-next-line
	}, [form.course_id, dataCourses]);

	// Opciones de prerrequisitos: cursos de coursesList y de filteredCoursesByCurriculumMap
	const PrerequisiteOptions = [
		...(coursesList
			.map((c) => {
				const course = dataCourses?.results?.find(
					(dc) => dc.id === c.course_id
				);
				return course
					? { value: course.id, label: `${course.code} - ${course.name}` }
					: null;
			})
			.filter(Boolean) || []),
		...(filteredCoursesByCurriculumMap?.map((fc) => ({
			value: fc.course,
			label: `${fc.course_code} - ${fc.course_name}`,
		})) || []),
	];

	const handleFormChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const resetForm = () => {
		setForm({
			course_id: null,
			is_mandatory: false,
			cycle: '',
			credits: '',
			prerequisite_ids: [],
		});
		setErrors({});
		setEditIdx(null);
	};

	const handleAddOrUpdateCourse = () => {
		if (!validateForm()) return;
		if (editIdx !== null) {
			setCoursesList((prev) =>
				prev.map((c, i) => (i === editIdx ? { ...form } : c))
			);
		} else {
			setCoursesList((prev) => [...prev, { ...form }]);
		}
		resetForm();
	};

	const handleRemoveCourse = (idx) => {
		setCoursesList((prev) => prev.filter((_, i) => i !== idx));
		if (editIdx === idx) resetForm();
	};

	const handleEditCourse = (idx) => {
		setForm({ ...coursesList[idx] });
		setEditIdx(idx);
		setErrors({});
	};

	const validateForm = () => {
		const err = {};
		if (!form.course_id) err.course_id = 'Selecciona un curso';
		if (form.cycle === '' || isNaN(Number(form.cycle)))
			err.cycle = 'Ciclo requerido';
		if (form.credits === '' || isNaN(Number(form.credits)))
			err.credits = 'Créditos requeridos';
		if (!Array.isArray(form.prerequisite_ids))
			err.prerequisite_ids = 'Selecciona los prerrequisitos';
		setErrors(err);
		return Object.keys(err).length === 0;
	};

	const handleSubmit = () => {
		if (!coursesList.length) {
			toaster.create({
				title: 'Sin cursos',
				description: 'Agrega al menos un curso',
				type: 'warning',
			});
			return;
		}
		const payload = {
			curriculum_map_id: item.id,
			courses: coursesList.map((c) => ({
				course_id: c.course_id,
				is_mandatory: c.is_mandatory,
				cycle: Number(c.cycle),
				credits: Number(c.credits),
				prerequisite_ids: c.prerequisite_ids,
			})),
		};

		addCoursesToCurriculum(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Cursos asignados',
					description: 'Los cursos se han asignado correctamente a la malla.',
					type: 'success',
				});
        fetchData();
				fetchCurriculumMapsCourses();
				setCoursesList([]);
				setOpen(false);
			},
			onError: (error) => {
				toaster.create({
					title: 'Error',
					description:
						error?.response?.data?.message ||
						'Ocurrió un error al asignar los cursos.',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			placement='center'
			size='7xl'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			onSave={handleSubmit}
			contentRef={contentRef}
			isPending={isPending}
			trigger={
				<Box>
					<Tooltip
						content='Agregar cursos'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='green' size='xs' disabled={!item?.editable}>
							<BsBook />
						</IconButton>
					</Tooltip>
				</Box>
			}
		>
			<Stack>
				<Card.Root>
					<Card.Header>
						<Heading
							size='md'
							display='flex'
							alignItems='center'
							gap={2}
							color='blue.500'
							fontSize='lg'
							fontWeight='semibold'
						>
							<FiBook size={24} />
							Agregar cursos
						</Heading>
					</Card.Header>
					<Card.Body maxH={{ base: '90vh', md: '600px' }} overflow='hidden'>
						<SimpleGrid
							columns={{ base: 1, md: 2 }}
							gap={4}
							mb={4}
							height='100%'
						>
							{/* Formulario para agregar/editar curso */}
							<Stack gap={2} border='1px solid #e2e8f0' borderRadius='md' p={3}>
								<Field
									label='Curso'
									required
									invalid={!!errors.course_id}
									errorText={errors.course_id}
								>
									<ReactSelect
										options={courseOptions}
										value={
											courseOptions.find(
												(opt) => opt.value === form.course_id
											) || null
										}
										onChange={(opt) =>
											handleFormChange('course_id', opt ? opt.value : null)
										}
										isLoading={loadingCourses || isLoadingCurriculumMapsCourses}
										isClearable
										isSearchable
										placeholder='Selecciona un curso'
									/>
								</Field>
								<Field label='Obligatorio'>
									<Checkbox
										checked={form.is_mandatory}
										onChange={(e) =>
											handleFormChange('is_mandatory', e.target.checked)
										}
									>
										Es obligatorio
									</Checkbox>
								</Field>
								<Field
									label='Ciclo'
									required
									invalid={!!errors.cycle}
									errorText={errors.cycle}
								>
									<Input
										type='number'
										min={1}
										max={20}
										value={form.cycle}
										onChange={(e) => handleFormChange('cycle', e.target.value)}
										placeholder='Ej: 1'
									/>
								</Field>
								<Field
									label='Créditos'
									required
									invalid={!!errors.credits}
									errorText={errors.credits}
								>
									<Input
										type='number'
										min={1}
										max={50}
										value={form.credits}
										onChange={(e) =>
											handleFormChange('credits', e.target.value)
										}
										placeholder='Ej: 4'
									/>
								</Field>
								<Field
									label='Prerrequisitos'
									invalid={!!errors.prerequisite_ids}
									errorText={errors.prerequisite_ids}
								>
									<ReactSelect
										options={PrerequisiteOptions.filter(
											(opt) => opt.value !== form.course_id
										)}
										value={PrerequisiteOptions.filter((opt) =>
											form.prerequisite_ids.includes(opt.value)
										)}
										onChange={(opts) =>
											handleFormChange(
												'prerequisite_ids',
												opts ? opts.map((o) => o.value) : []
											)
										}
										isMulti
										isClearable
										isSearchable
										placeholder='Selecciona uno o varios cursos'
									/>
								</Field>
								<Stack direction='row' gap={2}>
									<Button
										leftIcon={editIdx !== null ? null : <FiPlus />}
										colorPalette={editIdx !== null ? 'yellow' : 'blue'}
										variant={editIdx !== null ? 'solid' : 'outline'}
										onClick={handleAddOrUpdateCourse}
									>
										{editIdx !== null ? 'Actualizar' : 'Agregar curso'}
									</Button>
									{editIdx !== null && (
										<Button
											colorPalette='gray'
											variant='outline'
											onClick={resetForm}
										>
											Cancelar
										</Button>
									)}
								</Stack>
							</Stack>
							{/* Summary de cursos agregados */}
							<Box
								overflowY='auto'
								border='1px solid #e2e8f0'
								borderRadius='md'
								p={3}
								maxH={{ base: '250px', md: '500px' }}
								minH='120px'
								bg='white'
							>
								<Heading size='sm' mb={2} color='gray.600'>
									Cursos agregados
								</Heading>
								<Stack gap={2}>
									{coursesList.length === 0 &&
									filteredCoursesByCurriculumMap?.length === 0 ? (
										<Box color='gray.400'>No hay cursos agregados.</Box>
									) : (
										coursesList.map((c, idx) => {
											const courseLabel =
												dataCourses?.results?.find(
													(dc) => dc.id === c.course_id
												)?.name || '';
											return (
												<Card.Root
													key={idx}
													border='1px solid #e2e8f0'
													borderRadius='md'
												>
													<Flex justify='space-between' align='center' p={2}>
														<Box>
															<b>{courseLabel}</b> | Ciclo: {c.cycle} |
															Créditos: {c.credits} |{' '}
															{c.is_mandatory ? 'Obligatorio' : 'Opcional'}
															<br />
															Prerrequisitos:{' '}
															{c.prerequisite_ids
																.map((pid) => {
																	const pre = dataCourses?.results?.find(
																		(dc) => dc.id === pid
																	);
																	return pre ? pre.name : '';
																})
																.join(', ') || 'Ninguno'}
														</Box>
														<Stack direction='row' gap={1}>
															<IconButton
																size='xs'
																colorPalette='yellow'
																onClick={() => handleEditCourse(idx)}
															>
																<BsPencil />
															</IconButton>
															<IconButton
																size='xs'
																colorPalette='red'
																onClick={() => handleRemoveCourse(idx)}
															>
																<BsTrash />
															</IconButton>
														</Stack>
													</Flex>
												</Card.Root>
											);
										})
									)}
									{filteredCoursesByCurriculumMap?.map((fc, idx) => (
										<Card.Root
											key={idx}
											border='1px solid #e2e8f0'
											borderRadius='md'
											bg='blue.50'
										>
											<Flex justify='space-between' align='center' p={2}>
												<Box>
													<b>{fc.course_name}</b> | Ciclo: {fc.cycle} |
													Créditos: {fc.credits} |{' '}
													{fc.is_mandatory ? 'Obligatorio' : 'Opcional'}
													<br />
													Prerrequisitos:{' '}
													{fc.prerequisite
														?.map((pid) => {
															return pid;
														})
														.join(', ') || 'Ninguno'}
												</Box>
											</Flex>
										</Card.Root>
									))}
								</Stack>
							</Box>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

AddCoursesToCurriculumMap.propTypes = {
	item: PropTypes.object,
  fetchData: PropTypes.func,
};
