import { Button, Modal, Tooltip } from '@/components/ui';
import { useReadUserById } from '@/hooks/users/useReadUserById';
import {
	Box,
	Card,
	Flex,
	Heading,
	Icon,
	IconButton,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
	FiDownload,
	FiExternalLink,
	FiEye,
	FiFileText,
	FiMail,
	FiPhone,
	FiTag,
	FiUser,
} from 'react-icons/fi';
import { HiIdentification } from 'react-icons/hi';
import { Link } from 'react-router';
import { LuGraduationCap } from 'react-icons/lu';

export const ViewUserModal = ({ selectedUser }) => {
	const [open, setOpen] = useState(false);
	const { data: dataUser } = useReadUserById({
		id: selectedUser?.id,
		enabled: open,
	});

	return (
		<Modal
			title='Detalle de Usuario'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Mas información'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='blue'
							css={{
								_icon: {
									width: '5',
									height: '5',
								},
							}}
						>
							<FiEye />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			size='2xl'
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '75vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<Card.Root>
					<Card.Header pb={0}>
						<Flex align='center' gap={2}>
							<Icon as={FiUser} w={5} h={5} color='blue.600' />
							<Heading fontSize='20px'>Información Personal</Heading>
						</Flex>
					</Card.Header>
					<Card.Body pt={4}>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							<Box>
								<Flex align='center' gap={2} fontSize='sm' color='gray.600'>
									<Icon as={FiUser} w={4} h={4} />
									<Text>Nombre completo</Text>
								</Flex>
								<Text fontWeight='semibold' color='gray.900' ml={6}>
									{dataUser?.full_name || 'No disponible'}
								</Text>
							</Box>
							{/* Nombre de Usuario */}
							<Box>
								<Flex align='center' gap={2} fontSize='sm' color='gray.600'>
									<Icon as={FiUser} w={4} h={4} />
									<Text>Usuario</Text>
								</Flex>
								<Text fontWeight='semibold' color='gray.900' ml={6}>
									{dataUser?.user?.username || 'No disponible'}
								</Text>
							</Box>

							{/* Número de Documento */}
							<Box>
								<Flex align='center' gap={2} fontSize='sm' color='gray.600'>
									<Icon as={HiIdentification} w={4} h={4} />
									<Text>Número de Documento</Text>
								</Flex>
								<Text fontWeight='semibold' color='gray.900' ml={6}>
									{dataUser?.num_doc || 'No disponible'}
								</Text>
							</Box>

							{/* Categoría */}
							<Box>
								<Flex align='center' gap={2} fontSize='sm' color='gray.600'>
									<Icon as={FiTag} w={4} h={4} />
									<Text>Categoría</Text>
								</Flex>
								<Text fontWeight='semibold' color='gray.900' ml={6}>
									{dataUser?.category || 'No especificada'}
								</Text>
							</Box>

							{/* Departamento */}
						</SimpleGrid>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header pb={0}>
						<Flex align='center' gap={2}>
							<Icon as={FiMail} w={5} h={5} color='green.600' />
							<Heading fontSize='20px'>Información de Contacto</Heading>
						</Flex>
					</Card.Header>
					<Card.Body pt={4}>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							{/* Correo Personal */}
							<Box>
								<Flex align='center' gap={2} fontSize='sm' color='gray.600'>
									<Icon as={FiMail} w={4} h={4} />
									<Text>Correo Personal</Text>
								</Flex>
								<Text fontWeight='semibold' color='gray.900' ml={6}>
									{dataUser?.user?.username || 'No disponible'}
								</Text>
							</Box>

							{/* Correo Institucional */}
							<Box>
								<Flex align='center' gap={2} fontSize='sm' color='gray.600'>
									<Icon as={FiMail} w={4} h={4} color='blue.500' />
									<Text>Correo Institucional</Text>
								</Flex>
								<Text fontWeight='semibold' color='gray.900' ml={6}>
									{dataUser?.uni_email || 'No disponible'}
								</Text>
							</Box>

							{/* Teléfono */}
							<Box>
								<Flex align='center' gap={2} fontSize='sm' color='gray.600'>
									<Icon as={FiPhone} w={4} h={4} />
									<Text>Teléfono</Text>
								</Flex>
								<Text fontWeight='semibold' color='gray.900' ml={6}>
									{dataUser?.phone || 'No disponible'}
								</Text>
							</Box>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header pb={0}>
						<Flex align='center' gap={2}>
							<Icon as={FiFileText} w={5} h={5} color='green.600' />
							<Heading fontSize='20px'>Curriculum Vitae</Heading>
						</Flex>
					</Card.Header>

					<Card.Body pt={4}>
						{dataUser?.path_cv ? (
							<Button
								as={Link}
								href={dataUser.path_cv}
								isExternal
								variant='outline'
								color='green.700'
								borderColor='green.200'
								bg='green.50'
								_hover={{ bg: 'green.100' }}
							>
								<FiDownload /> Descargar CV <FiExternalLink />
							</Button>
						) : (
							<Text color='gray.500'>No disponible</Text>
						)}
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header pb={0}>
						<Flex align='center' gap={2}>
							<Icon as={LuGraduationCap} w={5} h={5} color='blue.600' />
							<Heading fontSize='20px'>Formación Académica</Heading>
						</Flex>
					</Card.Header>

					<Card.Body pt={4}>
						{dataUser?.path_grade ? (
							<Button
								as={Link}
								href={dataUser.path_grade}
								isExternal
								variant='outline'
								color='blue.700'
								borderColor='blue.200'
								bg='blue.50'
								_hover={{ bg: 'blue.100' }}
							>
								<FiDownload /> Descargar Título <FiExternalLink />
							</Button>
						) : (
							<Text color='gray.500'>No disponible</Text>
						)}
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

ViewUserModal.propTypes = {
	selectedUser: PropTypes.object,
};
