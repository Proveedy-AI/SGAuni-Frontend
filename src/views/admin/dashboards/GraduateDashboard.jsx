import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Heading,
	Stack,
	Text,
	Card,
	Flex,
	Box,
	Icon,
	Badge,
	Button,
	SimpleGrid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';

export const GraduateDashboard = () => {
	const { data: dataUser } = useReadUserLogged();
	const admissionPrograms = dataUser?.student?.admission_programs || [];
	console.log(admissionPrograms);

	const filteredGraduatePrograms = admissionPrograms
		? admissionPrograms.filter(
				(program) => program.academic_status === 2 //academic_type: graduated
			)
		: [];

	console.log(filteredGraduatePrograms);

	const navigate = useNavigate();

	const handleGoToThesisProcess = (program) => {
		navigate('/myprocedures/thesis-process', {
			state: {
				program: program,
			},
		});
	};

	return (
		<Stack mx='auto' gap={6}>
			<Heading size='md' mb={4}>
				Mis Programas Egresados ({filteredGraduatePrograms.length})
			</Heading>

			{filteredGraduatePrograms.length === 0 ? (
				<Card.Root>
					<Card.Body p={8} textAlign='center'>
						<Box mb={4}>
							<Icon as={LuGraduationCap} boxSize={12} color='gray.400' />
						</Box>
						<Text fontSize='lg' fontWeight='medium' color='gray.600' mb={2}>
							No tienes programas egresados
						</Text>
						<Text fontSize='sm' color='gray.500'>
							Cuando completes un programa, aparecerá aquí para gestionar tu
							proceso de tesis
						</Text>
					</Card.Body>
				</Card.Root>
			) : (
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
					{filteredGraduatePrograms.map((program) => (
						<Card.Root
							key={program.program}
							_hover={{
								shadow: 'xl',
								transform: 'translateY(-4px)',
							}}
							transition='all 0.3s'
							borderLeft='4px solid'
							borderLeftColor='green.400'
						>
							{/* Header */}
							<Card.Header pb={4}>
								<Flex align='center' gap={3}>
									<Box p={3} bg='green.50' rounded='lg'>
										<Icon as={LuGraduationCap} boxSize={6} color='green.600' />
									</Box>
									<Box flex={1}>
										<Card.Title
											fontWeight='bold'
											fontSize='lg'
											lineHeight='tight'
										>
											{program.program_name}
										</Card.Title>
										<Flex align='center' gap={2} mt={1}>
											<Badge
												colorPalette='green'
												display='flex'
												alignItems='center'
												gap={1}
												px={2}
												py={0.5}
												rounded='md'
												fontSize='xs'
											>
												<Icon as={FiCheckCircle} boxSize={3} />
												{program.academic_status_display}
											</Badge>
										</Flex>
									</Box>
								</Flex>
							</Card.Header>

							{/* Body */}
							<Card.Body pt={0}>
								<Stack gap={4}>
									{/* Botón de acción */}
									<Button
										bg='green.500'
										color='white'
										_hover={{ bg: 'green.600' }}
										rightIcon={<Icon as={FiArrowRight} />}
										onClick={() => handleGoToThesisProcess(program)}
										size='sm'
										mt={2}
									>
										Gestionar Proceso de Tesis
									</Button>
								</Stack>
							</Card.Body>
						</Card.Root>
					))}
				</SimpleGrid>
			)}
		</Stack>
	);
};
