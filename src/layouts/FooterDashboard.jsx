// components/ContactInfoCard.jsx
import {
	Card,
	Heading,
	SimpleGrid,
	Flex,
	Box,
	Text,
	Link,
	Icon,
	Separator,
} from '@chakra-ui/react';
import { FiGlobe, FiMail, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';

export const FooterDashboard = () => {
	return (
		<Card.Root bg='blue.50' borderWidth='1px' borderColor='blue.50'>
			<Card.Header>
				<Heading as='h3' size='md' color='gray.800'>
					Información de contacto
				</Heading>
			</Card.Header>

			<Card.Body>
				<SimpleGrid columns={{ base: 1, md: 4 }} gap={4} fontSize='sm'>
					{/* Correo */}
					<Flex align='flex-start' gap={2}>
						<Icon as={FiMail} boxSize={4} color='blue.600' mt={1} />
						<Box>
							<Text fontWeight='medium' color='gray.700'>
								Correo:
							</Text>
							<Link
								href='mailto:info.posgrado.fieecs@uni.edu.pe'
								color='blue.600'
							>
								info.posgrado.fieecs@uni.edu.pe
							</Link>
						</Box>
					</Flex>

					{/* Números */}
					<Flex align='flex-start' gap={2}>
						<Icon as={FiPhone} boxSize={4} color='blue.600' mt={1} />
						<Box>
							<Text fontWeight='medium' color='gray.700'>
								Números de contacto:
							</Text>
							<Text color='gray.600'>(01) 481 1070 anexo 5408</Text>
						</Box>
					</Flex>

					{/* WhatsApp */}
					<Flex align='flex-start' gap={2}>
						<Icon as={FaWhatsapp} boxSize={4} color='#25D366' mt={1} />
						<Box>
							<Text fontWeight='medium' color='gray.700'>
								WhatsApp:
							</Text>
							<Link
								href='https://wa.me/51986699381'
								color='blue.600'
								isExternal
							>
								+51 986 699 381
							</Link>
						</Box>
					</Flex>

					{/* Web */}
					<Flex align='flex-start' gap={2}>
						<Icon as={FiGlobe} boxSize={4} color='blue.600' mt={1} />
						<Box>
							<Text fontWeight='medium' color='gray.700'>
								Web:
							</Text>
							<Link
								href='https://fieecs.uni.edu.pe/'
								color='blue.600'
								isExternal
							>
								https://fieecs.uni.edu.pe/
							</Link>
						</Box>
					</Flex>
				</SimpleGrid>

				<Separator my={6} />

				<Text fontSize='xs' color='gray.500' textAlign='center'>
					Facultad de Ingeniería Económica, Estadística y Ciencias Sociales |
					Universidad Nacional de Ingeniería © Todos los derechos reservados.
				</Text>
			</Card.Body>
		</Card.Root>
	);
};
