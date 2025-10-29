import PropTypes from 'prop-types';
import { Box, Heading, Text, Grid } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui';

export const Step02ShowSchedule = ({ selectedGroups }) => {
	const timeSlots = [
		'07:00',
		'08:00',
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
		'21:00',
		'22:00',
		'23:00',
	];
	const daysOfWeek = [
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado',
		'Domingo',
	];

	const headerBg = useColorModeValue('gray.50', 'gray.700');
	const courseBg = useColorModeValue('blue.100', 'blue.800');
	const courseBorderColor = useColorModeValue('blue.400', 'blue.300');
	const courseHoverBg = useColorModeValue('blue.200', 'blue.700');

	// Función para obtener cursos para un slot de tiempo específico
	const getCourseForTimeSlot = (day, time) => {
		const coursesInSlot = [];

		selectedGroups?.forEach((course) => {
			// Verificar que el curso tenga horarios definidos
			if (
				!course?.schedule ||
				!Array.isArray(course.schedule) ||
				course.schedule.length === 0
			) {
				return; // Saltar cursos sin horarios
			}

			// Verificar cada horario del curso
			course.schedule.forEach((scheduleItem) => {
				if (scheduleItem.day === day) {
					const courseStart = Number.parseInt(
						scheduleItem.start_time.split(':')[0]
					);
					const courseEnd = Number.parseInt(
						scheduleItem.end_time.split(':')[0]
					);
					const slotTime = Number.parseInt(time.split(':')[0]);

					if (slotTime >= courseStart && slotTime < courseEnd) {
						// Crear un objeto que incluya el horario específico
						coursesInSlot.push({
							...course,
							currentSchedule: scheduleItem,
						});
					}
				}
			});
		});

		return coursesInSlot;
	};

	// Función para calcular la altura del curso
	const getCourseHeight = (course) => {
		const start = Number.parseInt(
			course?.currentSchedule?.start_time?.split(':')[0]
		);
		const end = Number.parseInt(
			course?.currentSchedule?.end_time?.split(':')[0]
		);
		return (end - start) * 48; // 48px por hora
	};

	return (
		<Box>
			<Heading as='h2' size='lg' mb={6}>
				Horario de Clases
			</Heading>

			<Box overflowX='auto'>
				<Box minW='800px'>
					{/* Header con días */}
					<Grid templateColumns='auto repeat(7, 1fr)' gap={1} mb={2}>
						<Box p={2} textAlign='center' fontWeight='medium' fontSize='sm'>
							Hora
						</Box>
						{daysOfWeek.map((day) => (
							<Box
								key={day}
								p={2}
								textAlign='center'
								fontWeight='medium'
								fontSize='sm'
								bg={headerBg}
								rounded='md'
							>
								{day}
							</Box>
						))}
					</Grid>

					{/* Grid del calendario */}
					{timeSlots.map((time) => (
						<Grid key={time} templateColumns='auto repeat(7, 1fr)' gap={1}>
							<Box
								p={2}
								fontSize='xs'
								color='gray.500'
								textAlign='center'
								borderRight='1px'
								borderColor='gray.200'
							>
								{time}
							</Box>

							{daysOfWeek.map((day) => {
								const courses = getCourseForTimeSlot(day, time);

								return (
									<Box
										key={`${day}-${time}`}
										position='relative'
										h='48px'
										border='1px solid'
										borderColor='gray.50'
									>
										{courses.map((course, index) => {
											const isFirstSlotOfCourse =
												course?.currentSchedule.start_time.startsWith(
													time.split(':')[0]
												);
											if (!isFirstSlotOfCourse) return null;

											const totalCourses = courses.length;
											const width = `${100 / totalCourses}%`;
											const left = `${(100 / totalCourses) * index}%`;

											return (
												<Box
													key={`${course.id}-${course.currentSchedule.day}-${course.currentSchedule.start_time}`}
													position='absolute'
													top={0}
													left={left}
													width={width}
													p={1}
													rounded='md'
													overflow='hidden'
													bg={courseBg}
													borderLeftColor={courseBorderColor}
													borderLeft='4px solid'
													height={`${getCourseHeight(course)}px`}
													transition='all 0.2s ease-in-out'
													cursor='pointer'
													_hover={{
														zIndex: 10,
														transform: 'scale(1.1)',
														boxShadow: 'xl',
														width: '100%',
														left: index === totalCourses - 1 ? 'auto' : left,
														right: index === totalCourses - 1 ? '0' : 'auto',
														bg: courseHoverBg,
													}}
												>
													<Text fontWeight='medium' fontSize='xs' noOfLines={1}>
														{course.course_name}
													</Text>
													<Text fontSize='xs' color='gray.600' noOfLines={1}>
														{course.group_code}
													</Text>
													<Text fontSize='xs' color='gray.500' noOfLines={1}>
														{course.teacher_name}
													</Text>
													<Text fontSize='xs' color='gray.500' noOfLines={1}>
														{course?.currentSchedule?.start_time?.slice(0, 5)} -{' '}
														{course?.currentSchedule?.end_time?.slice(0, 5)}
													</Text>
												</Box>
											);
										})}
									</Box>
								);
							})}
						</Grid>
					))}
				</Box>
			</Box>
		</Box>
	);
};

Step02ShowSchedule.propTypes = {
	selectedGroups: PropTypes.array.isRequired,
};
