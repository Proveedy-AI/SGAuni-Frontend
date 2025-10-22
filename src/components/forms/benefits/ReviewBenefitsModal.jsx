import { Modal, Tooltip } from '@/components/ui';
import {
	Box,
	Button,
	Card,
	Flex,
	Heading,
	IconButton,
	Separator,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { HiEye } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import {
	FiExternalLink,
	FiFileText,
	FiMessageSquare,
	FiUser,
} from 'react-icons/fi';

export const ReviewBenefitsModal = ({ item }) => {
	const [open, setOpen] = useState(false);

	return (
		<Modal
			trigger={
				<Box>
					<Tooltip
						content='Mas Información'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='blue' size='xs'>
							<HiEye />
						</IconButton>
					</Tooltip>
				</Box>
			}
			title='Detalles del beneficio'
			placement='center'
			size='5xl'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			hiddenFooter={true}
		>
			<Stack
				gap={4}
				pb={6}
				maxH={{ base: 'full', md: '65vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
					<Card.Root>
						<Card.Header>
							<Flex align='center' gap={2}>
								<Box as={FiUser} boxSize={4} />
								<Heading size='lg'>Información del Estudiante</Heading>
							</Flex>
						</Card.Header>
						<Card.Body>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										Nombre
									</Text>
									<Text fontSize='sm'>{item.student_name}</Text>
								</Box>
								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										Tipo de Solicitud
									</Text>
									<Text fontSize='sm'>{item.type_display}</Text>
								</Box>
							</SimpleGrid>
						</Card.Body>
					</Card.Root>
					<Card.Root>
						<Card.Header>
							<Flex align='center' gap={2}>
								<FiMessageSquare size={16} />
								<Heading size='sm'>Justificación</Heading>
							</Flex>
						</Card.Header>
						<Card.Body>
							<Text fontSize='sm' bg='gray.100' p={3} borderRadius='md'>
								{item.justification}
							</Text>
						</Card.Body>
					</Card.Root>
				</SimpleGrid>

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
					<Card.Root>
						<Card.Header pb={3}>
							<Flex align='center' gap={2}>
								<FiFileText size={16} />
								<Heading size='sm'>Documentos</Heading>
							</Flex>
						</Card.Header>

						<Card.Body>
							<Flex direction='column' gap={5}>
								{/* Documento de Solicitud */}
								<Box>
									<Text
										fontSize='sm'
										fontWeight='medium'
										color='gray.600'
										mb={2}
									>
										Documento de Solicitud
									</Text>
									{item.document_url ? (
										<Button
											variant='outline'
											size='sm'
											width='full'
											justifyContent='start'
											bg='transparent'
											onClick={() => window.open(item.document_url, '_blank')}
										>
											<FiExternalLink size={16} /> Ver Documento PDF
										</Button>
									) : (
										<Text fontSize='sm' color='gray.500'>
											No disponible
										</Text>
									)}
								</Box>

								<Separator />

								{/* Documento de Revisión */}
								<Box>
									<Text
										fontSize='sm'
										fontWeight='medium'
										color='gray.600'
										mb={2}
									>
										Documento de Revisión
									</Text>
									{item.review_document_url ? (
										<Button
											variant='outline'
											size='sm'
											width='full'
											justifyContent='start'
											bg='transparent'
											onClick={() =>
												window.open(item.review_document_url, '_blank')
											}
										>
											<FiExternalLink size={16} /> Ver Documento de Revisión
										</Button>
									) : (
										<Text fontSize='sm' color='gray.500'>
											No disponible
										</Text>
									)}
								</Box>
							</Flex>
						</Card.Body>
					</Card.Root>
					<Card.Root>
						<Card.Header pb={3}>
							<Heading size='sm'>Comentarios Adicionales</Heading>
						</Card.Header>
						<Card.Body>
							{item.comments ? (
								<Box bg='gray.100' p={3} rounded='md'>
									<Text fontSize='sm'>{item.comments}</Text>
								</Box>
							) : (
								<Text fontSize='sm' color='gray.500'>
									No hay comentarios adicionales
								</Text>
							)}
						</Card.Body>
					</Card.Root>
				</SimpleGrid>
			</Stack>
		</Modal>
	);
};

ReviewBenefitsModal.propTypes = {
	item: PropTypes.object,
	fetchPaymentOrders: PropTypes.func,
};
