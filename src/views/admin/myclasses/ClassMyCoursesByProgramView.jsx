import PropTypes from 'prop-types';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
//import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { useNavigate } from 'react-router';
import {
	Card,
	Stack,
	Heading,
	Text,
	Flex,
	SimpleGrid,
	Badge,
	Box,
	HStack,
	IconButton,
} from '@chakra-ui/react';
import { MdDateRange, MdEventNote, MdListAlt } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { FiArrowLeft } from 'react-icons/fi';

export const CourseCard = ({ course, goTo }) => {
	return (
		<Card.Root
			boxShadow='md'
			borderRadius='lg'
			overflow='hidden'
			onClick={() => goTo(course.id)}
			cursor={'pointer'}
		>
			<Card.Header
				bg='blue.100' // Fondo sólido
				position='relative'
				minH={36}
				overflow='hidden'
			>
				{/* Líneas curvas tipo Nazca */}
				<Box position='absolute' inset={0} zIndex={0}>
					<svg
						width='100%'
						height='100%'
						viewBox='0 0 200 90'
						preserveAspectRatio='none'
					>
						<path
							d='M0 20 Q50 0, 100 20 T200 20'
							stroke='#3182CE' // azul
							strokeWidth='2'
							fill='none'
							opacity='0.3'
						/>
						<path
							d='M0 45 Q50 25, 100 45 T200 45'
							stroke='#2C5282' // azul más oscuro
							strokeWidth='1.5'
							fill='none'
							opacity='0.2'
						/>
						<path
							d='M0 70 Q50 50, 100 70 T200 70'
							stroke='#63B3ED' // celeste
							strokeWidth='1'
							fill='none'
							opacity='0.25'
						/>
					</svg>
				</Box>

				{/* Detalle decorativo geométrico */}
				<Box
					position='absolute'
					top='5px'
					right='10px'
					w='30px'
					h='30px'
					bg='whiteAlpha.500'
					borderRadius='sm'
					transform='rotate(45deg)'
					zIndex={0}
				/>

				{/* Contenido si lo necesitas */}
			</Card.Header>

			<Card.Body px={4} py={3}>
				<Stack gap={2}>
					{/* Nombre y código */}
					<HStack justify='space-between'>
						<Heading size='sm' color='gray.800' noOfLines={1}>
							{course.course_name}
						</Heading>
						<Text fontSize='xs' color='gray.600'>
							Código: <b>{course.course_code}</b>
						</Text>
					</HStack>

					{/* Grupo, ciclo y créditos */}
					<HStack gap={4}>
						<Badge colorPalette='purple' px={2} borderRadius='md'>
							Grupo: {course.group_code}
						</Badge>
						<Badge colorPalette='teal' px={2} borderRadius='md'>
							Ciclo: {course.cycle}
						</Badge>
						<Badge colorPalette='orange' px={2} borderRadius='md'>
							Créditos: {course.course_credits}
						</Badge>
					</HStack>

					{/* Capacidad y estudiantes */}
					<HStack justify='space-between' fontSize='sm' color='gray.700'>
						<Text>
							<b>Capacidad:</b> {course.capacity}
						</Text>
						<Text>
							<b>Inscritos:</b> {course.enrolled_students_count}
						</Text>
					</HStack>

					{/* Evaluación configurada */}
					<Box>
						<Badge
							colorPalette={course.evaluation_configured ? 'green' : 'red'}
							variant='subtle'
							borderRadius='md'
							fontSize='xs'
						>
							{course.evaluation_configured
								? 'Evaluación configurada'
								: 'Evaluación pendiente'}
						</Badge>
					</Box>
				</Stack>
			</Card.Body>
		</Card.Root>
	);
};

CourseCard.propTypes = {
	course: PropTypes.object,
	goTo: PropTypes.func,
};

export const ClassMyCoursesByProgramView = () => {
	const [programItem, setProgramItem] = useState(null);

	useEffect(() => {
		const stored = EncryptedStorage.load('selectedProgramItem');
		setProgramItem(stored);
	}, []);

	const navigate = useNavigate();
	const handleCardClick = (courseId) => {
		const encrypted = Encryptor.encrypt(courseId);
		const encoded = encodeURIComponent(encrypted);
		navigate(`${window.location.pathname}/course/${encoded}`, {
			replace: false,
		});
	};

	const statusDisplay = [
		{ value: false, label: 'Por Empezar', color: 'blue' },
		{ value: true, label: 'En Curso', color: 'green' },
	];

	const status = statusDisplay.find((s) => s.value === programItem?.is_current);
	return (
		<Stack gap={6} mx='auto'>
			<Card.Root>
				<Card.Header>
					<Flex align='center' gap={2}>
						<IconButton
							aria-label='Regresar'
							variant='ghost'
							color='blue.600'
							onClick={() => navigate(-1)} // 👈 retrocede una página
						>
							<FiArrowLeft />
						</IconButton>
						<Heading size='md'>Información del Programa</Heading>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack spacing={3}>
						<Flex align='center' gap={2}>
							<MdEventNote />
							<Text>
								<b>Periodo académico:</b>{' '}
								{programItem?.enrollment_period_name || '-'}
							</Text>
						</Flex>
						<Flex align='center' gap={2}>
							<MdDateRange />
							<Text>
								<b>Inicio:</b> {programItem?.semester_start_date || '-'}
							</Text>
						</Flex>
						<Flex align='center' gap={2}>
							<MdDateRange />
							<Text>
								<b>Estado:</b>{' '}
								<Badge
									colorPalette={status?.color}
									borderRadius='md'
									fontSize='sm'
								>
									{status?.label}
								</Badge>
							</Text>
						</Flex>
						<Flex align='center' gap={2}>
							<MdListAlt />
							<Text>
								<b>Cursos Totales:</b> {programItem?.total_courses || '-'}
							</Text>
						</Flex>
					</Stack>
				</Card.Body>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Flex align='center' gap={2}>
						<MdListAlt size={24} color='#3182ce' />
						<Heading size='md'>Cursos</Heading>
					</Flex>
				</Card.Header>
				<Card.Body>
					<Stack spacing={4}>
						<SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={4}>
							{programItem?.courses?.map((course) => (
								<CourseCard
									key={course.id}
									course={course}
									goTo={handleCardClick}
								/>
							))}
						</SimpleGrid>
					</Stack>
				</Card.Body>
			</Card.Root>
		</Stack>
	);
};
