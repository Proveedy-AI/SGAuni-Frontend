import PropTypes from 'prop-types';
import {
	Button,
	Modal,
	toaster,
	Tooltip,
	useColorModeValue,
} from '@/components/ui';
import {
	Accordion,
	Badge,
	Box,
	Grid,
	Group,
	Heading,
	HStack,
	IconButton,
	Table,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	useCreateCourseSelection,
	useDeleteCourseSelection,
	useReadCourseGroupsById,
} from '@/hooks/course-selections';
import { FiCalendar } from 'react-icons/fi';
import { useRef, useState } from 'react';

const ViewCourseGroupSchedulesModal = ({ item, courseGroups }) => {
	const [open, setOpen] = useState(false);
	const contentRef = useRef();

	// Filtrar todos los grupos con el mismo group_code
	const sameGroupCode = Array.isArray(courseGroups)
		? courseGroups.filter((g) => g.group_code === item.group_code)
		: [item];

	// Unir todos los horarios de los grupos con el mismo group_code
	const allSchedules = sameGroupCode.flatMap((g) => {
		// Si schedule_info es un array, mapear cada uno, si no, devolver array vacío
		if (Array.isArray(g.schedule_info)) {
			return g.schedule_info.map((s) => ({
				day: s.day,
				duration: s.duration,
				type_schedule: g.type_schedule || s.type_schedule || '-',
				teacher_name: g.teacher_name || s.teacher_name || '-',
			}));
		}
		return [];
	});

	return (
		<Modal
			trigger={
				<Box>
					<Tooltip
						content='Ver horarios del grupo'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							variant='outline'
							aria-label='Ver horarios del grupo'
							size='sm'
							bg='yellow.300'
							_hover={{ bg: 'yellow.400' }}
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiCalendar />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='3xl'
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Box>
				<Heading mb={4} gap={2}>
					<Text fontWeight='semibold' fontSize='lg'>
						Curso: <strong>{item.course_name}</strong>
					</Text>
					<Text fontWeight='semibold' fontSize='lg'>
						Sección:{' '}
						<Badge colorPalette='blue' variant='subtle' fontSize='md'>
							{item.group_code}
						</Badge>
					</Text>
				</Heading>
				<Table.Root variant='simple' size='sm' w='100%'>
					<Table.Header bg='gray.50'>
						<Table.Row>
							<Table.Cell w='20%'>Día</Table.Cell>
							<Table.Cell w='30%'>Horas de clase</Table.Cell>
							<Table.Cell w='20%'>Tipo</Table.Cell>
							<Table.Cell w='30%'>Docente</Table.Cell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{allSchedules.length > 0 ? (
							allSchedules.map((s, idx) => (
								<Table.Row key={idx}>
									<Table.Cell>{s.day}</Table.Cell>
									<Table.Cell>{s.duration}</Table.Cell>
									<Table.Cell>{s.type_schedule || '-'}</Table.Cell>
									<Table.Cell>{s.teacher_name || '-'}</Table.Cell>
								</Table.Row>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={5}>
									<Text color='gray.400' textAlign='center'>
										Sin horarios registrados
									</Text>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Box>
		</Modal>
	);
};

ViewCourseGroupSchedulesModal.propTypes = {
	item: PropTypes.object,
	courseGroups: PropTypes.array,
};

// ---------- Utils compartidos ----------
const timeToMinutes = (timeString) => {
	const [hours, minutes] = timeString.split(':').map(Number);
	return hours * 60 + minutes;
};

const isCourseSelected = (mySelections, courseCode) =>
	mySelections?.some((sel) => sel.course_code === courseCode);

const isCourseAlreadySelected = (mySelections, courseName) =>
	mySelections?.some((sel) => sel.course_name === courseName) || false;

// ---------- Subcomponente: Panel de grupos por curso ----------
function CourseGroupsPanel({
	course,
	currentEnrollment,
	mySelections,
  onRefreshSelections,
	isSomeRequestPending,
}) {
	const { data: courseGroups, isLoading: isLoadingGroups } =
		useReadCourseGroupsById(
			course.course_id,
			currentEnrollment?.uuid,
			{},
			{ enabled: true }
		);

	const { mutateAsync: createSelection, isPending: loadingGroupSelection } =
		useCreateCourseSelection();
	const { mutateAsync: removeSelection, isPending: loadingGroupRemoval } =
		useDeleteCourseSelection();

	const handleAddCourseGroup = async (groupCode, courseGroups) => {
		try {
			const groups = courseGroups.filter(g => g.group_code === groupCode);
			await Promise.all(
				groups.map((g) =>
					createSelection({ courseGroupId: g.id, uuid: currentEnrollment?.uuid })
				)
			);
			toaster.create({
				title: 'Se agregó el grupo a su selección',
				type: 'success'
			});
		} catch {
			toaster.create({
				title: 'Error al agregar grupo de curso',
				type: 'error'
			});
		} finally {
			await onRefreshSelections();
		}
	}

	const handleRemoveCourseGroup = async (groupCode, mySelections) => {
		try {
			const groups = mySelections.filter(g => g.group_code === groupCode);
			await Promise.all(
				groups.map((g) => removeSelection(g.id))
			);
			toaster.create({
				title: 'Se eliminó el grupo de su selección',
				type: 'success'
			});
		} catch {
			toaster.create({
				title: 'Error al eliminar grupo de curso',
				type: 'error'
			});
		} finally {
			await onRefreshSelections();
		}
	}
  
	const uniqueGroups = courseGroups
		? Object.values(
				courseGroups.reduce((acc, group) => {
					if (!acc[group.group_code]) {
						acc[group.group_code] = group;
					}
					return acc;
				}, {})
			)
		: [];

	if (isLoadingGroups) {
		return (
			<Box textAlign='center' py={6}>
				<Text>Cargando grupos...</Text>
			</Box>
		);
	}

	return (
		<Box
			bg='white'
			borderRadius='lg'
			border='1px solid'
			borderColor='gray.200'
			overflowX='auto'
		>
			<Table.Root variant='simple' size='sm'>
				<Table.Header bg='gray.50'>
					<Table.Row>
						<Table.Cell>Sección</Table.Cell>
						{/* <Table.Cell>Horario</Table.Cell>
						<Table.Cell>Docente</Table.Cell> */}
						<Table.Cell>Capacidad</Table.Cell>
						<Table.Cell>Estado</Table.Cell>
						<Table.Cell textAlign='right'>Acciones</Table.Cell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{uniqueGroups?.map((group) => {
						const isThisGroupSelected =
							mySelections?.some(
								(selection) =>
									selection.course_name === group.course_name &&
									selection.group_code === group.group_code
							) || false;

						const courseAlreadySel = isCourseAlreadySelected(
							mySelections,
							group.course_name
						);

						const groupSlots = Array.isArray(group.schedule_info)
							? group.schedule_info
							: group.schedule_info
								? [group.schedule_info]
								: [];

						const hasConflict =
							mySelections?.some((selection) => {
								if (!Array.isArray(selection.schedule)) return false;
								return groupSlots.some((groupSlot) =>
									selection.schedule.some((selectionSlot) => {
										if (groupSlot.day !== selectionSlot.day) return false;
										const gS = timeToMinutes(groupSlot.start_time);
										const gE = timeToMinutes(groupSlot.end_time);
										const sS = timeToMinutes(selectionSlot.start_time);
										const sE = timeToMinutes(selectionSlot.end_time);
										return gS < sE && gE > sS;
									})
								);
							}) || false;

						const isGroupFull = group.enrolled_count >= group.capacity;

						const isDisabled =
							isSomeRequestPending ||
							isGroupFull ||
							(!isThisGroupSelected && courseAlreadySel) ||
							(!isThisGroupSelected && hasConflict) ||
							course.status === 'blocked' ||
							course.status === 'completed';

						// Nueva lógica de badges de estado
						let badgeLabel = '';
						let badgeColor = 'gray';
						if (isThisGroupSelected) {
							badgeLabel = 'Curso seleccionado';
							badgeColor = 'blue';
						} else if (isGroupFull) {
							badgeLabel = 'Lleno';
							badgeColor = 'red';
						} else if (
							isSomeRequestPending ||
							(!isThisGroupSelected && courseAlreadySel) ||
							(!isThisGroupSelected && hasConflict) ||
							course.status === 'blocked' ||
							course.status === 'completed'
						) {
							badgeLabel = 'No disponible';
							badgeColor = 'gray';
						} else {
							badgeLabel = 'Disponible';
							badgeColor = 'green';
						}

						return (
							<Table.Row key={group.id} _hover={{ bg: 'gray.50' }}>
								<Table.Cell>
									<Text fontWeight='medium'>{group.group_code}</Text>
								</Table.Cell>

								<Table.Cell>
									<VStack align='start' gap={1}>
										{groupSlots.length > 0 ? (
											groupSlots.map((s, idx) => (
												<Text key={idx} fontSize='sm'>
													{s.day}: {s.duration}
												</Text>
											))
										) : (
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
									<Text fontSize='sm'>
										{group.enrolled_count}/{group.capacity}
									</Text>
								</Table.Cell>

								<Table.Cell>
									<Badge colorPalette={badgeColor} variant='subtle' size='sm'>
										{badgeLabel}
									</Badge>
								</Table.Cell>

								<Table.Cell textAlign='right'>
									<Group>
										{isThisGroupSelected ? (
											<Button
												bg='red'
												size='sm'
												//onClick={() => handleRemoveGroup(group.course_name)}
												onClick={() => handleRemoveCourseGroup(group.group_code, mySelections)}
                        loading={loadingGroupRemoval === group.id}
												isDisabled={
													loadingGroupRemoval === group.id ||
													isSomeRequestPending
												}
											>
												Quitar
											</Button>
										) : (
											<Button
												bg={isDisabled ? 'gray.400' : 'green'}
												size='sm'
												//onClick={() => handleSelectGroup(group.id)}
                        onClick={() => handleAddCourseGroup(group.group_code, courseGroups)}
												loading={loadingGroupSelection === group.id}
												disabled={isDisabled}
											>
												{isGroupFull
													? 'Lleno'
													: courseAlreadySel
														? 'Ya seleccionado'
														: hasConflict
															? 'Cruce de horario'
															: course.status === 'blocked' ||
																  course.status === 'completed'
																? 'Bloqueado'
																: 'Seleccionar'}
											</Button>
										)}
										<ViewCourseGroupSchedulesModal
											item={group}
											courseGroups={courseGroups}
										/>
									</Group>
								</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
				;
			</Table.Root>
		</Box>
	);
}

CourseGroupsPanel.propTypes = {
	course: PropTypes.object.isRequired,
	currentEnrollment: PropTypes.object,
	mySelections: PropTypes.array,
	onRefreshSelections: PropTypes.func.isRequired,
	isSomeRequestPending: PropTypes.bool,
};

// ---------- Componente principal con Accordion ----------
export const Step01CourseList = ({
	currentEnrollment,
	courses,
	mySelections,
	onRefreshSelections,
	isSomeRequestPending,
}) => {
	const bgColor = useColorModeValue('white', 'gray.800');

  const uniqueMySelections = mySelections?.filter(
    (sel, idx, arr) =>
      arr.findIndex(
        (s) =>
          s.course_code === sel.course_code && s.group_code === sel.group_code
      ) === idx
  );

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
          {uniqueMySelections?.length || 0}{' '}
          cursos seleccionados
        </Badge>
      </HStack>

      <Accordion.Root multiple>
        {courses?.map((course, index) => (
          <Accordion.Item
            key={course.course_id}
            value={String(index)}
            border='1px solid'
            borderColor='gray.200'
            borderRadius='lg'
            mb={3}
            bg={bgColor}
          >
            <>
              <h2>
                <Accordion.ItemTrigger _expanded={{ bg: 'blue.50' }} p={4}>
                  <Grid
                    templateColumns={{ base: '1fr', md: '2fr 1fr' }}
                    gap={4}
                    alignItems='center'
                    w='100%'
                  >
                    <VStack align='start' gap={0}>
                      <Text fontWeight='semibold'>{course.course_name}</Text>
                      <Text fontSize='sm' color='gray.500'>
                        {course.course_code} · Ciclo {course.cycle} ·{' '}
                        {course.credits} créditos
                      </Text>

                      {course.status === 'blocked' &&
                        course.reasons?.length > 0 && (
                          <Text fontSize='xs' color='red.500' mt={1}>
                            {course.reasons[0]}
                          </Text>
                        )}
                    </VStack>

                    <HStack justify={{ base: 'start', md: 'end' }} gap={2}>
                      {course.status === 'blocked' && (
                        <Badge colorPalette='red' variant='subtle'>
                          Bloqueado
                        </Badge>
                      )}
                      {isCourseSelected(mySelections, course.course_code) && (
                        <Badge colorPalette='green' variant='subtle'>
                          Seleccionado
                        </Badge>
                      )}
                    </HStack>
                  </Grid>

                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </h2>

              <Accordion.ItemContent pb={4}>
                <CourseGroupsPanel
                  course={course}
                  currentEnrollment={currentEnrollment}
                  mySelections={mySelections}
                  onRefreshSelections={onRefreshSelections}
                  isSomeRequestPending={isSomeRequestPending}
                />
              </Accordion.ItemContent>
            </>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Box>
  );
};

Step01CourseList.propTypes = {
	currentEnrollment: PropTypes.object,
	courses: PropTypes.array.isRequired,
	mySelections: PropTypes.array,
	onRefreshSelections: PropTypes.func.isRequired,
	isSomeRequestPending: PropTypes.bool,
};
