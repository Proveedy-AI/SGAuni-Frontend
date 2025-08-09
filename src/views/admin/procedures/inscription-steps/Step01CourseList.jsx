import PropTypes from 'prop-types';
import { Button, toaster, useColorModeValue } from '@/components/ui';
import {
	Badge,
	Box,
	Heading,
	HStack,
	Icon,
	Table,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight, FiX } from 'react-icons/fi';
import {
	useCreateCourseSelection,
	useDeleteCourseSelection,
	useReadCourseGroupsById,
} from '@/hooks/course-selections';

export const Step01CourseList = ({
	courses,
	mySelections,
	selectedCourse,
	setSelectedCourse,
	onRefreshSelections,
	isSomeRequestPending,
}) => {
	const bgColor = useColorModeValue('white', 'gray.800');

	const { data: courseGroups, isLoading: isLoadingGroups } =
		useReadCourseGroupsById(
			selectedCourse?.course_id,
			{},
			{ enabled: !!selectedCourse }
		);

	// const groupWithLocalData = [
	//   ...(Array.isArray(courseGroups) ? courseGroups : []),
	//   {
	//       id: 101,
	//       group_code: "EX_1",
	//       course_id: 1,
	//       course_name: "Estructuras de Datos",
	//       teacher_name: "Pedrizi",
	//       capacity: 45,
	//       enrolled_count: 1,
	//       schedule_info: [
	//           {
	//             day: "Martes",
	//             day_number: 2,
	//             start_time: "08:00",
	//             end_time: "12:00",
	//             duration: "08:00 - 12:00"
	//           }
	//       ]
	//   },
	//   {
	//       id: 102,
	//       group_code: "EXA_2",
	//       course_id: 1,
	//       course_name: "Estructuras de Datos",
	//       teacher_name: "Armandizi",
	//       capacity: 45,
	//       enrolled_count: 1,
	//       schedule_info: [
	//           {
	//             day: "Miercoles",
	//             day_number: 3,
	//             start_time: "08:00",
	//             end_time: "10:00",
	//             duration: "08:00 - 10:00"
	//           },
	//           {
	//             day: "Jueves",
	//             day_number: 3,
	//             start_time: "08:00",
	//             end_time: "10:00",
	//             duration: "08:00 - 10:00"
	//           }
	//       ]
	//   }
	// ];

	const { mutateAsync: createSelection, isPending: loadingGroupSelection } =
		useCreateCourseSelection();
	const { mutateAsync: removeSelection, isPending: loadingGroupRemoval } =
		useDeleteCourseSelection();

	// Verificar si ya hay un grupo seleccionado de este curso (por course_name, no por group_code)
	const isCourseAlreadySelected = (courseName) => {
		return (
			mySelections?.some((selection) => selection.course_name === courseName) ||
			false
		);
	};

	// Función auxiliar para convertir tiempo a minutos
	const timeToMinutes = (timeString) => {
		const [hours, minutes] = timeString.split(':').map(Number);
		return hours * 60 + minutes;
	};

	const handleSelectGroup = async (groupId) => {
		await createSelection(groupId, {
			onSuccess: () => {
				toaster.create({
					title: 'Grupo añadido a la matrícula',
					type: 'success',
				});
				onRefreshSelections();
			},
			onError: (error) => {
				toaster.create({
					title: error
						? error.message || 'Error al añadir el grupo'
						: 'Error al añadir el grupo',
					type: 'error',
				});
			},
		});
	};

	const handleRemoveGroup = async (groupName) => {
		const selection = mySelections?.find(
			(selection) => selection.course_name === groupName
		);
		if (!selection) {
			toaster.create({
				title: 'Grupo no encontrado en la selección',
				type: 'error',
			});
			return;
		}

		await removeSelection(selection.id, {
			onSuccess: () => {
				toaster.create({
					title: 'Grupo eliminado de la matrícula',
					type: 'success',
				});
				onRefreshSelections();
			},
			onError: (error) => {
				toaster.create({
					title: error ? error.message : 'Error al eliminar el grupo',
					type: 'error',
				});
			},
		});
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case 'available':
				return (
					<Badge colorScheme='green' variant='subtle'>
						Disponible
					</Badge>
				);
			case 'blocked':
				return (
					<Badge colorScheme='red' variant='subtle'>
						Bloqueado
					</Badge>
				);
			default:
				return (
					<Badge colorScheme='gray' variant='subtle'>
						Sin estado
					</Badge>
				);
		}
	};

	const isCourseSelected = (courseId) => {
		return mySelections?.some((sel) => sel.course_code === courseId); // o usa course_id si es que lo tienes
	};

	// Vista de lista de cursos
	if (!selectedCourse) {
		return (
			<Box>
				<HStack justify='space-between' mb={4}>
					<Text fontSize='lg' fontWeight='semibold'>
						Listado de Cursos
					</Text>
					<Badge
						colorPalette='blue'
						fontSize='lg'
						px={4}
						py={2}
						borderRadius='full'
					>
						{mySelections?.length || 0} cursos seleccionados
					</Badge>
				</HStack>

				{/* Tabla de cursos */}
				<Box
					bg={bgColor}
					borderRadius='lg'
					overflow='hidden'
					border='1px solid'
					borderColor='gray.200'
				>
					<Table.Root variant='simple'>
						<Table.Header bg='gray.50'>
							<Table.Row>
								<Table.Cell>Curso</Table.Cell>
								<Table.Cell>Ciclo</Table.Cell>
								<Table.Cell>Créditos</Table.Cell>
								<Table.Cell>Estado</Table.Cell>
								<Table.Cell textAlign='right'>Acciones</Table.Cell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{courses.map((course) => (
								<Table.Row
									key={course.course_id}
									bg={
										isCourseSelected(course.course_code)
											? 'blue.100'
											: undefined
									}
								>
									<Table.Cell>
										<VStack align='start' gap={1}>
											<HStack>
												<Text fontWeight='medium'>{course.course_name}</Text>
												{isCourseSelected(course.course_code) && (
													<Badge colorPalette='green' variant='subtle'>
														Seleccionado
													</Badge>
												)}
											</HStack>
											<Text fontSize='sm' color='gray.500'>
												{course.course_code}
											</Text>
										</VStack>
									</Table.Cell>
									<Table.Cell>
										<Text>Ciclo {course.cycle}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text>{course.credits} créditos</Text>
									</Table.Cell>
									<Table.Cell>
										{getStatusBadge(course.status)}
										{course.status === 'blocked' &&
											course.reasons?.length > 0 && (
												<Text fontSize='xs' color='red.500' mt={1}>
													{course.reasons[0]}
												</Text>
											)}
									</Table.Cell>
									<Table.Cell textAlign='right'>
										<Button
											bg='blue.600'
											size='sm'
											rightIcon={<Icon as={FiArrowRight} />}
											onClick={() => setSelectedCourse(course)}
											disabled={
												course.status === 'blocked' || isSomeRequestPending
											}
										>
											Ver horarios
										</Button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</Box>
			</Box>
		);
	}

	return (
		<Box>
			<Button
				leftIcon={<Icon as={FiArrowLeft} />}
				variant='ghost'
				onClick={() => setSelectedCourse(null)}
				mb={4}
				bg='blue.500'
				color='white'
				_hover={{ bg: 'blue.600' }}
			>
				Regresar a Listado de Cursos
			</Button>

			<Box mb={6}>
				<Heading as='h3' size='md' mb={2}>
					{selectedCourse.course_name}
				</Heading>
				<HStack spacing={4}>
					<Text fontSize='sm' color='gray.600'>
						Ciclo {selectedCourse.cycle}
					</Text>
					<Text fontSize='sm' color='gray.600'>
						{selectedCourse.credits} créditos
					</Text>
					<Text fontSize='sm' color='gray.600'>
						{selectedCourse.course_code}
					</Text>
				</HStack>
			</Box>

			{isLoadingGroups ? (
				<Box textAlign='center' py={8}>
					<Text>Cargando grupos...</Text>
				</Box>
			) : (
				<Box
					bg={bgColor}
					borderRadius='lg'
					overflow='hidden'
					border='1px solid'
					borderColor='gray.200'
				>
					<Table.Root variant='simple'>
						<Table.Header bg='gray.50'>
							<Table.Row>
								<Table.Cell>Sección</Table.Cell>
								<Table.Cell>Horario</Table.Cell>
								<Table.Cell>Docente</Table.Cell>
								<Table.Cell>Capacidad</Table.Cell>
								<Table.Cell>Estado</Table.Cell>
								<Table.Cell textAlign='right'>Acciones</Table.Cell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{courseGroups?.map((group) => {
								// Verificar si este grupo específico está seleccionado
								const isThisGroupSelected =
									mySelections?.some(
										(selection) =>
											selection.course_name === group.course_name &&
											selection.group_code === group.group_code
									) || false;

								// Verificar si ya hay algún grupo de este curso seleccionado
								const courseAlreadySelected = isCourseAlreadySelected(
									group.course_name
								);

								// Verificar conflictos de horario específicos para este grupo
								const hasConflict =
									mySelections?.some((selection) => {
										if (
											!selection.schedule ||
											typeof selection.schedule === 'string'
										) {
											return false;
										}
										if (!Array.isArray(selection.schedule)) {
											return false;
										}

										const groupSlots = Array.isArray(group.schedule_info)
											? group.schedule_info
											: group.schedule_info
												? [group.schedule_info] // si es un objeto único, lo metemos en un array
												: [];

										return groupSlots.some((groupSlot) => {
											return selection.schedule.some((selectionSlot) => {
												if (groupSlot.day !== selectionSlot.day) {
													return false;
												}

												const groupStart = timeToMinutes(groupSlot.start_time);
												const groupEnd = timeToMinutes(groupSlot.end_time);
												const selectionStart = timeToMinutes(
													selectionSlot.start_time
												);
												const selectionEnd = timeToMinutes(
													selectionSlot.end_time
												);

												return (
													groupStart < selectionEnd && groupEnd > selectionStart
												);
											});
										});
									}) || false;

								// Verificar si está lleno
								const isGroupFull = group.enrolled_count >= group.capacity;

								// Determinar si el grupo debe estar deshabilitado
								// Si este grupo específico está seleccionado, debe poder quitarse
								// Si otro grupo del mismo curso está seleccionado, este debe estar deshabilitado
								const isDisabled =
									isGroupFull ||
									(!isThisGroupSelected && courseAlreadySelected) ||
									(!isThisGroupSelected && hasConflict);

								return (
									<Table.Row key={group.id} _hover={{ bg: 'gray.50' }}>
										<Table.Cell>
											<Text fontWeight='medium'>{group.group_code}</Text>
										</Table.Cell>
										<Table.Cell>
											<VStack align='start' spacing={1}>
												{Array.isArray(group.schedule_info) &&
													group.schedule_info?.map((schedule, index) => (
														<Text key={index} fontSize='sm'>
															{schedule.day}: {schedule.duration}
														</Text>
													))}
												{(!group.schedule_info ||
													!Array.isArray(group.schedule_info) ||
													group.schedule_info.length === 0) && (
													<Text fontSize='sm' color='gray.400'>
														Sin horario
													</Text>
												)}
											</VStack>
										</Table.Cell>
										<Table.Cell>
											<Text fontSize='sm'>{group.teacher_name}</Text>
										</Table.Cell>
										<Table.Cell>
											<VStack align='start' spacing={1}>
												<Text fontSize='sm'>
													{group.enrolled_count}/{group.capacity}
												</Text>
											</VStack>
										</Table.Cell>
										<Table.Cell>
											<VStack align='start' spacing={1}>
												<Badge
													colorScheme={
														group.enrolled_count < group.capacity
															? 'green'
															: 'red'
													}
													variant='subtle'
													size='sm'
												>
													{group.enrolled_count < group.capacity
														? 'Disponible'
														: 'Lleno'}
												</Badge>
												{!isThisGroupSelected && courseAlreadySelected && (
													<Text fontSize='xs' color='orange.500'>
														Ya tienes un grupo de este curso
													</Text>
												)}
												{!isThisGroupSelected && hasConflict && (
													<Text fontSize='xs' color='red.500'>
														Conflicto de horario
													</Text>
												)}
											</VStack>
										</Table.Cell>
										<Table.Cell textAlign='right'>
											{isThisGroupSelected ? (
												<Button
													bg='red'
													size='sm'
													leftIcon={<Icon as={FiX} />}
													onClick={() => handleRemoveGroup(group.course_name)}
													isLoading={loadingGroupRemoval === group.id}
													isDisabled={loadingGroupRemoval === group.id}
												>
													Quitar
												</Button>
											) : (
												<Button
													bg={isDisabled ? 'gray.400' : 'green'}
													size='sm'
													onClick={() => handleSelectGroup(group.id)}
													isLoading={loadingGroupSelection === group.id}
													disabled={isDisabled}
												>
													{isGroupFull
														? 'Lleno'
														: courseAlreadySelected
															? 'Ya seleccionado'
															: hasConflict
																? 'Cruce de horario'
																: 'Seleccionar'}
												</Button>
											)}
										</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table.Root>
				</Box>
			)}
		</Box>
	);
};

Step01CourseList.propTypes = {
	courses: PropTypes.array.isRequired,
	mySelections: PropTypes.array,
	selectedCourse: PropTypes.object,
	setSelectedCourse: PropTypes.func.isRequired,
	onRefreshSelections: PropTypes.func.isRequired,
	isSomeRequestPending: PropTypes.bool,
};
