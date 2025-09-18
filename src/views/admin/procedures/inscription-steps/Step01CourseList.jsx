import PropTypes from 'prop-types';
import { Button, Modal, toaster, Tooltip, useColorModeValue } from '@/components/ui';
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

const ViewCourseGroupSchedulesModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef();
  console.log(item)

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
              bg="yellow.300"
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
      <Box p={4}>
        <Heading mb={4} gap={2}>
          <Text fontWeight="bold" fontSize="lg">{item.course_name}</Text>
          <Badge colorPalette="blue" variant="subtle" fontSize="md">
            Sección: {item.group_code}
          </Badge>
        </Heading>
        <Table.Root variant="simple" size="sm" w="100%">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.Cell w="20%">Día</Table.Cell>
              <Table.Cell w="30%">Horas de clase</Table.Cell>
              <Table.Cell w="20%">Tipo</Table.Cell>
              <Table.Cell w="30%">Docente</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Array.isArray(item?.schedule_info) && item.schedule_info.length > 0 ? (
              item.schedule_info.map((s, idx) => (
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
                  <Text color="gray.400" textAlign="center">
                    Sin horarios registrados
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Modal>
  )
}

ViewCourseGroupSchedulesModal.propTypes = {
  item: PropTypes.object,
}

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
	isSomeRequestPending,
	loadingGroupSelection,
	loadingGroupRemoval,
	handleSelectGroup,
	handleRemoveGroup,
}) {
	// Este hook se ejecuta en el top-level del subcomponente (✅ regla de hooks)
	// Montamos este subcomponente SOLO cuando el Accordion está expandido (ver padre),
	// así que ya es "on demand".
	const { data: courseGroups, isLoading: isLoadingGroups } =
		useReadCourseGroupsById(
			course.course_id,
			currentEnrollment?.uuid,
			{},
			{ enabled: true }
		);

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
						<Table.Cell>Horario</Table.Cell>
						<Table.Cell>Docente</Table.Cell>
						<Table.Cell>Capacidad</Table.Cell>
						<Table.Cell>Estado</Table.Cell>
						<Table.Cell textAlign='right'>Acciones</Table.Cell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{courseGroups?.map((group) => {
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
									<VStack align='start' gap={1}>
										<Badge
											colorPalette={isGroupFull ? 'red' : 'green'}
											variant='subtle'
											size='sm'
										>
											{isGroupFull ? 'Lleno' : 'Disponible'}
										</Badge>

										{!isThisGroupSelected && courseAlreadySel && (
											<Text fontSize='xs' color='orange.500'>
												Ya tienes un grupo de este curso
											</Text>
										)}
										{!isThisGroupSelected && hasConflict && (
											<Text fontSize='xs' color='red.500'>
												Conflicto de horario
											</Text>
										)}
										{course.status === 'blocked' && (
											<Text fontSize='xs' color='red.500'>
												Curso bloqueado
											</Text>
										)}
                    {course.status === 'completed' && (
											<Text fontSize='xs' color='blue.500'>
												Curso aprobado
											</Text>
										)}
									</VStack>
								</Table.Cell>

								<Table.Cell textAlign='right'>
									<Group>
                    {isThisGroupSelected ? (
                      <Button
                        bg='red'
                        size='sm'
                        onClick={() => handleRemoveGroup(group.course_name)}
                        loading={loadingGroupRemoval === group.id}
                        isDisabled={
                          loadingGroupRemoval === group.id || isSomeRequestPending
                        }
                      >
                        Quitar
                      </Button>
                    ) : (
                      <Button
                        bg={isDisabled ? 'gray.400' : 'green'}
                        size='sm'
                        onClick={() => handleSelectGroup(group.id)}
                        loading={loadingGroupSelection === group.id}
                        disabled={isDisabled}
                      >
                        {isGroupFull
                          ? 'Lleno'
                          : courseAlreadySel
                            ? 'Ya seleccionado'
                            : hasConflict
                              ? 'Cruce de horario'
                              : (course.status === 'blocked' || course.status === 'completed')
                                ? 'Bloqueado'
                                : 'Seleccionar'}
                      </Button>
                    )}
                    <ViewCourseGroupSchedulesModal item={group} />
                  </Group>
								</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
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
	loadingGroupSelection: PropTypes.any,
	loadingGroupRemoval: PropTypes.any,
	handleSelectGroup: PropTypes.func.isRequired,
	handleRemoveGroup: PropTypes.func.isRequired,
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

	const { mutateAsync: createSelection, isPending: loadingGroupSelection } =
		useCreateCourseSelection();
	const { mutateAsync: removeSelection, isPending: loadingGroupRemoval } =
		useDeleteCourseSelection();

	const handleSelectGroup = async (groupId) => {
		await createSelection(
			{ courseGroupId: groupId, uuid: currentEnrollment?.uuid },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Grupo añadido a la matrícula',
						type: 'success',
					});
					onRefreshSelections();
				},
				onError: (error) => {
					toaster.create({
						title: error?.message || 'Error al añadir el grupo',
						type: 'error',
					});
				},
			}
		);
	};

	const handleRemoveGroup = async (groupName) => {
		const selection = mySelections?.find((s) => s.course_name === groupName);
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
					title: error?.message || 'Error al eliminar el grupo',
					type: 'error',
				});
			},
		});
	};

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
										templateColumns={{ base: '1fr', md: '2fr 1fr' }} // 1 columna en móvil, 2 en desktop
										gap={4}
										alignItems='center'
										w='100%'
									>
										{/* Columna izquierda: info del curso */}
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

										{/* Columna derecha: estado / badges */}
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
									loadingGroupSelection={loadingGroupSelection}
									loadingGroupRemoval={loadingGroupRemoval}
									handleSelectGroup={handleSelectGroup}
									handleRemoveGroup={handleRemoveGroup}
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
