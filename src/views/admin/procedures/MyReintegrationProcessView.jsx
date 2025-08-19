import PropTypes from 'prop-types';
import { useColorModeValue } from '@/components/ui';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import {
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Spinner,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FiBook } from 'react-icons/fi';
import { StartReintegrationProcessModal } from '@/components/modals/procedures';
import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { EncryptedStorage } from '@/components/CrytoJS/EncryptedStorage';
import { useNavigate } from 'react-router';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

const EnrollmentCard = ({ program, onStartEnrollment }) => {
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	return (
		<Card.Root
			bg={cardBg}
			border='1px solid'
			borderColor={borderColor}
			borderRadius='lg'
			p={0}
			overflow='hidden'
		>
			<Card.Body p={6}>
				<Flex justify='space-between' align='flex-start' mb={4}>
					<Flex align='center' flex='1'>
						<Box
							p={3}
							borderRadius='md'
							bg='blue.100'
							mr={4}
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<Icon as={FiBook} boxSize={6} color='blue.600' />
						</Box>
						<VStack align='start' spacing={1} flex='1'>
							<Heading
								as='h3'
								size='md'
								color='gray.800'
								lineHeight='shorter'
								noOfLines={2}
							>
								{program.program_name}
							</Heading>
						</VStack>
					</Flex>
					<StartReintegrationProcessModal
						program={program}
						onStartEnrollment={onStartEnrollment}
					/>
				</Flex>
			</Card.Body>
		</Card.Root>
	);
};

EnrollmentCard.propTypes = {
	program: PropTypes.object.isRequired,
	onStartEnrollment: PropTypes.func.isRequired,
};

export const MyReintegrationProcessView = () => {
	const navigate = useNavigate();

  const { data: dataUser, isLoading: isLoadingUser } = useReadUserLogged();
  const filteredPrograms =  dataUser?.student?.admission_programs.filter(
    (program) => program.academic_status === 4
  );


	const bgColor = useColorModeValue('blue.50', 'blue.900');

	const handleStartEnrollment = (program) => {
		const encrypted = Encryptor.encrypt(program?.program_id); // id program
		const encoded = encodeURIComponent(encrypted);
		EncryptedStorage.save('selectedEnrollmentProccess', program);
		navigate(`/myprocedures/reintegration-process/${encoded}`);
	};

	return (
		<Box spaceY='5' p={{ base: 4, md: 6 }} maxW='8xl' mx='auto'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Trámites', to: '/myprocedures' },
					{ label: 'Reintegrar matrícula' },
				]}
			/>
			<Box bg={bgColor} borderRadius='xl' p={{ base: 6, md: 8 }} mb={8}>
				<Heading as='h1' size='xl' color='blue.800' mb={2} fontWeight='bold'>
					Reintegrar Matrícula
				</Heading>
				<Text color='blue.600' fontSize='lg'>
					Gestiona tu solicitud de reintegración de matrícula académica
				</Text>
			</Box>

			{isLoadingUser ? (
				<Flex justify='center' align='center' py={12}>
					<Spinner size='lg' color='blue.500' />
					<Text ml={4} color='gray.600'>
						Cargando inscripciones...
					</Text>
				</Flex>
			) : (
				<>
					{filteredPrograms && filteredPrograms.length > 0 ? (
						<>
							<Text fontSize='sm' color='gray.600' mb={6}>
								{filteredPrograms.length} proceso
								{filteredPrograms.length !== 1 ? 's' : ''} encontrado
								{filteredPrograms.length !== 1 ? 's' : ''}
							</Text>

							<SimpleGrid columns={{ base: 1, lg: 2 }} mx='auto'>
								{filteredPrograms?.map((program) => (
									<EnrollmentCard
										key={program.program}
										program={program}
										onStartEnrollment={handleStartEnrollment}
									/>
								))}
							</SimpleGrid>
						</>
					) : (
						<Box
							textAlign='center'
							py={12}
							px={6}
							bg='gray.50'
							borderRadius='lg'
							border='2px dashed'
							borderColor='gray.300'
						>
							<Icon as={FiBook} boxSize={12} color='gray.400' mb={4} />
							<Heading as='h3' size='md' color='gray.600' mb={2}>
								No hay inscripciones disponibles
							</Heading>
							<Text color='gray.500'>
								No tienes inscripciones pendientes en este momento.
							</Text>
						</Box>
					)}
				</>
			)}
		</Box>
	);
};
