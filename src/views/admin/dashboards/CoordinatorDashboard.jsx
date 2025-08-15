// dashboard/AdminDashboard.jsx
import { useReadDataDashCoord } from '@/hooks/users/useReadDataDashCoord';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import {
	Box,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Text,
} from '@chakra-ui/react';
import { FiEdit3, FiFolder } from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import { useNavigate } from 'react-router';

export const CoordinatorDashboard = () => {
	const { data: profile } = useReadUserLogged();
	const navigate = useNavigate();
	const { data: dataInfo } = useReadDataDashCoord();

	const otherLinks = [
		{
			title: 'Contratos:',
			subtitle: 'Recopilación de contratos.',
			icon: FiFolder,
			bg: 'yellow.100',
			borderColor: 'yellow.200',
			iconColor: 'yellow.600',
			link: 'contracts/mylist',
		},
		{
			title: 'Solicitudes de Beneficios:',
			subtitle: 'Solicitudes de beneficios estudiantiles.',
			icon: FiEdit3,
			bg: 'purple.100',
			borderColor: 'purple.200',
			iconColor: 'purple.600',
			link: '/benefits/request',
		},
	];

	return (
		<Flex direction='column' minH='70vh' justify='space-between'>
			<Box>
				<Box
					p={6}
					mb={4}
					borderRadius='xl'
					bgImage="url('/img/dashboar-coord.png')"
					bgSize='cover'
					bgPosition='center'
					mx='auto'
					color='white'
					boxShadow='md'
					position='relative'
				>
					<SimpleGrid
						columns={{ base: 1, md: 2 }}
						spacing={6}
						alignItems='center'
					>
						{/* Texto y botón */}
						<Box p={4}>
							<Flex alignItems='center' gap={3}>
								<Heading
									color='black'
									fontSize={{ base: '2xl', md: '3xl' }}
									lineHeight='short'
								>
									¡Te damos la bienvenida!
								</Heading>
							</Flex>

							<Text
								fontSize={{ base: 'md', md: 'lg' }}
								color={'black'}
								lineHeight={1}
							>
								👋 ¡Hola, {profile?.full_name} !{' '}
							</Text>
						</Box>

						{/* GIF grande con efecto */}
						<Box
							p={4}
							borderRadius='xl'
							mb={{ base: 0, md: 10 }}
							display='flex'
							alignItems='center'
							justifyContent='center'
							maxH={{ base: '200px', md: '100px' }}
							transform='rotateX(5deg) rotateY(5deg)'
							transition='transform 0.3s ease-in-out'
							_hover={{
								transform: 'rotateX(0deg) rotateY(0deg) scale(1.03)',
							}}
						></Box>
					</SimpleGrid>
				</Box>
				<Card.Root bg={'blue.50'} mt={10} borderColor={'blue.50'} shadow='none'>
					<Card.Header pb={0}>
						<HStack gap={2}>
							<Heading size='lg'>Principales resultados</Heading>
						</HStack>
					</Card.Header>

					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
							{dataInfo?.data?.map((item, index) => (
								<Card.Root
									key={index}
									borderWidth='2px'
									_hover={{ boxShadow: 'md', cursor: 'pointer' }}
									transition='box-shadow 0.2s'
								>
									<Card.Body p={4}>
										<Flex justify='space-between' align='flex-start'>
											<Flex align='flex-start' gap={3}>
												<Box
													p={2}
													rounded='lg'
													bg={item.bg || 'whiteAlpha.300'}
												>
													<Icon
														as={FiIcons[item.icon]} // convierte el string en el componente real
														boxSize={5}
														color={item.iconColor}
													/>
												</Box>
												<Box>
													<Text
														fontWeight='medium'
														fontSize='sm'
														lineHeight='short'
														color='gray.800'
													>
														{item.title}
													</Text>
													<Text fontSize='xs' color='gray.600'>
														{item.subtitle}
													</Text>
												</Box>
											</Flex>
											<Text
												fontSize='2xl'
												fontWeight='bold'
												color={item.textColor}
											>
												{item.count || '00'}
											</Text>
										</Flex>
									</Card.Body>
								</Card.Root>
							))}
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
				<Box mt={10} mb={4}>
					<Heading as='h2' size='md' color='gray.800' mb={4}>
						Otros enlaces:
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
						{otherLinks.map((item, index) => (
							<Card.Root
								key={index}
								p={4}
								borderWidth='2px'
								borderColor={'blue.50'}
								_hover={{ boxShadow: 'md', cursor: 'pointer' }}
								bg={'blue.50'}
								transition='box-shadow 0.2s'
								onClick={() => {
									if (item.link) {
										navigate(item.link);
									}
								}}
							>
								<Card.Body p={2}>
									<Flex align='flex-start' gap={3}>
										<Box p={2} rounded='lg' bg={item.bg || 'whiteAlpha.300'}>
											<Icon as={item.icon} boxSize={8} color={item.iconColor} />
										</Box>
										<Box>
											<Text fontWeight='medium' fontSize='sm' color='black.800'>
												{item.title}
											</Text>
											<Text fontSize='xs' color='gray.600' lineHeight='tall'>
												{item.subtitle}
											</Text>
										</Box>
									</Flex>
								</Card.Body>
							</Card.Root>
						))}
					</SimpleGrid>
				</Box>
			</Box>
		</Flex>
	);
};
