import PropTypes from 'prop-types';
import {
	GenerateRegistrationPdfModal,
	GenerateSchudelePdfModal,
} from '@/components/modals/procedures';
import { Box, Card, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { useReadEnrollmentReceipt } from '@/hooks/students/enrollment';
import { HiSparkles } from 'react-icons/hi2';
import { FaGraduationCap, FaStar } from 'react-icons/fa';
import { FiCalendar, FiCheckCircle, FiHome } from 'react-icons/fi';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router';

export const Step04EndEnrollmentProcess = ({ step, id, mySelections }) => {
	const { data: dataRegistrationInfo, isLoading: loadingRegistrationInfo } =
		useReadEnrollmentReceipt(id, {}, { enabled: !!id && step === 4 });

	const courses_groups = dataRegistrationInfo?.data?.map((course_group) => {
		return {
			cycle: course_group.cycle,
			group_code: course_group.group_code,
			course_name: course_group.course_name,
			credits: course_group.credits,
		};
	});

	const total_credits = dataRegistrationInfo?.data?.reduce(
		(acc, group) => acc + group.credits,
		0
	);

	const registration_info = {
		program_enrollment: dataRegistrationInfo?.program,
		period_enrollment: dataRegistrationInfo?.period_enrollment,
		student_full_name: dataRegistrationInfo?.student_name,
		courses_groups,
		total_courses: courses_groups?.length,
		total_credits,
	};

	const navigate = useNavigate();

	return (
		<VStack gap={6} align='stretch'>
			<Card.Root
				position='relative'
				bg='green.50'
				border='1px solid'
				borderColor='green.200'
				rounded='2xl'
				p={8}
				overflow='hidden'
			>
				{/* Elementos decorativos */}
				<Box position='absolute' top={4} right={4}>
					<Icon
						as={HiSparkles}
						w={8}
						h={8}
						color='green.400'
						className='animate-pulse'
					/>
				</Box>
				<Box position='absolute' top={8} left={8}>
					<Icon
						as={FaStar}
						w={6}
						h={6}
						color='green.300'
						className='animate-pulse delay-500'
					/>
				</Box>
				<Box position='absolute' bottom={4} right={12}>
					<Icon
						as={FaStar}
						w={4}
						h={4}
						color='green.300'
						className='animate-pulse delay-1000'
					/>
				</Box>

				<Card.Body textAlign='center' gap={4}>
					{/* Icono central */}
					<Box w={'full'}>
						<Box
							display='inline-flex'
							alignItems='center'
							justifyContent='center'
							w={20}
							h={20}
							bg='green.500'
							rounded='full'
							shadow='lg'
							mb={4}
						>
							<Icon as={FiCheckCircle} w={10} h={10} color='white' />
						</Box>
					</Box>
					{/* Título */}
					<Box>
						<Heading
							as='h1'
							size='lg'
							display='flex'
							alignItems='center'
							justifyContent='center'
							gap={3}
							color='gray.800'
						>
							<Icon as={FaGraduationCap} w={8} h={8} color='green.600' />
							¡Matrícula Completada!
						</Heading>
						<Box w={24} h={1} bg='green.500' rounded='full' mx='auto' mt={2} />
					</Box>

					{/* Mensaje */}
					<Text
						fontSize='lg'
						color='gray.600'
						maxW='2xl'
						mx='auto'
						textAlign='center'
					>
						Felicitaciones{' '}
						<Box as='span' fontWeight='semibold' color='green.700'>
							{registration_info.student_full_name}
						</Box>
						, has completado exitosamente tu proceso de matrícula.
						<Box
							as='span'
							display='block'
							mt={2}
							color='red.600'
							fontWeight='medium'
						>
							Recuerda que si tienes órdenes de pago pendientes, debes
							completarlas lo antes posible; de lo contrario, tus accesos serán
							bloqueados.
						</Box>
					</Text>
				</Card.Body>
			</Card.Root>
			<Card.Root boxShadow='lg' border='none' bg='blue.50'>
				<Card.Body p={8}>
					<VStack gap={6} textAlign='center'>
						<Box>
							<Card.Title
								fontSize='xl'
								fontWeight='bold'
								color='gray.800'
								mb={2}
							>
								Documentos Disponibles
							</Card.Title>
							<Text color='gray.600'>Descarga tus documentos de matrícula</Text>
						</Box>

						<Flex
							direction={{ base: 'column', sm: 'row' }}
							gap={4}
							justify='center'
							maxW='md'
							mx='auto'
						>
							<GenerateRegistrationPdfModal
								loading={loadingRegistrationInfo}
								registration_info={registration_info}
							/>

							<GenerateSchudelePdfModal
								loading={loadingRegistrationInfo}
								registration_info={registration_info}
								mySelections={mySelections}
							/>
						</Flex>

						<Text fontSize='xs' color='gray.500' maxW='sm' mx='auto'>
							Los documentos se generarán en formato PDF y se descargarán
							automáticamente
						</Text>
					</VStack>
				</Card.Body>
			</Card.Root>

			{/* Mensaje Final */}
			<Box
				textAlign='center'
				p={6}
				bgGradient='linear(to-r, green.50, emerald.50)'
				rounded='xl'
				border='1px'
				borderColor='green.200'
			>
				<Text color='gray.600'>
					¡Bienvenido a tu nuevo período académico! 🎉
				</Text>
				<Text fontSize='sm' color='gray.500' mt={1}>
					Revisa tu correo electrónico para más información sobre el inicio de
					clases.
				</Text>
				<Button
					mt={5}
					onClick={() => navigate('/myprocedures/enrollment-process')}
					leftIcon={<Icon as={FiCalendar} />}
					colorPalette={'blue'}
					transition='all 0.2s'
				>
					<FiHome />
					Ir a Inicio
				</Button>
			</Box>
		</VStack>
	);
};

Step04EndEnrollmentProcess.propTypes = {
	step: PropTypes.number,
	id: PropTypes.number,
	mySelections: PropTypes.array,
};
