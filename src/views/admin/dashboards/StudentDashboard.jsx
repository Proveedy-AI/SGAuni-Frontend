import { useUpdateNotifications } from '@/hooks';
import { useProvideAuth } from '@/hooks/auth';
import {
	Box,
	Heading,
	Text,
	SimpleGrid,
	Flex,
	IconButton,
	Button,
	Collapsible,
	Image,
} from '@chakra-ui/react';
import { LuCheckCheck } from 'react-icons/lu';

export const StudentDashboard = () => {
	const { getProfile } = useProvideAuth();
	const profile = getProfile();
	console.log('Perfil del usuario:', profile);
	const { mutate: updateNotifications } = useUpdateNotifications();

	const handleMarkAsSeen = () => {
		if (profile && profile.admission_notification_uuid) {
			updateNotifications({
				id: profile.admission_notification_uuid,
			});
		}
	};

	return (
		<>
			{profile && profile.admission_notification_uuid && (
				<Collapsible.Root unmountOnExit defaultOpen={true}>
					<Collapsible.Content>
						<Box
							p={6}
							mb={4}
							borderRadius='xl'
							bgImage="url('/img/congratulation.png')"
							bgSize='cover'
							bgPosition='center'
							mx='auto'
							w={{ base: '100%', md: '95%' }}
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
										<Text fontSize={{ base: '4xl', md: '5xl' }} lineHeight={1}>
											🎉
										</Text>
										<Heading
											color='black'
											fontSize={{ base: '2xl', md: '3xl' }}
											lineHeight='short'
										>
											¡Felicidades, Ingresaste!
										</Heading>
									</Flex>

									<Box mt={5}>
										<Button
											colorPalette='green'
											size='md'
											borderRadius='lg'
											onClick={() => {}}
										>
											Ver resultados
										</Button>
									</Box>
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
								>
									<Image
										src='/img/congratulations.gif'
										alt='Celebración'
										maxW={{ base: '80%', md: '100%' }}
										maxH={{ base: '200px', md: '250px' }}
										objectFit='contain'
									/>
								</Box>
							</SimpleGrid>
						</Box>
					</Collapsible.Content>

					{/* Botón fuera del box, parte inferior */}
					<Collapsible.Trigger asChild>
						<Flex
							justify='end'
							w={{ base: 'full', md: '95%' }}
							mx='auto'
							mb={4}
						>
							<IconButton
								size='sm'
								variant='ghost'
								onClick={handleMarkAsSeen}
								aria-label='Cerrar panel'
								_hover={{ color: 'blue.500' }}
							>
								<LuCheckCheck /> Marcar como visto
							</IconButton>
						</Flex>
					</Collapsible.Trigger>
				</Collapsible.Root>
			)}
		</>
	);
};
