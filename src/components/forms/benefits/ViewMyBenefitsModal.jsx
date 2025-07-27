import { Modal, Tooltip } from '@/components/ui';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Icon,
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
	FiCalendar,
	FiCheckCircle,
	FiExternalLink,
	FiFileText,
	FiMessageSquare,
	FiUser,
	FiX,
} from 'react-icons/fi';

export const ViewMyBenefitsModal = ({ item }) => {
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
										ID Estudiante
									</Text>
									<Text fontSize='sm'>{item.student}</Text>
								</Box>
								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										Tiene Beneficio Activo
									</Text>
									<Flex align='center' gap={1}>
										{item.has_benefit ? (
											<FiCheckCircle boxSize={4} color='green.500' />
										) : (
											<FiX boxSize={4} colorPalette='red.500' />
										)}
										<Text fontSize='sm'>{item.has_benefit ? 'Sí' : 'No'}</Text>
									</Flex>
								</Box>
							</SimpleGrid>
						</Card.Body>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Flex align='center' gap={2}>
								<FiCalendar boxSize={4} />
								<Heading size='lg'>Información Académica</Heading>
							</Flex>
						</Card.Header>
						<Card.Body>
							<Box mb={3}>
								<Text fontSize='sm' fontWeight='medium' color='gray.600'>
									Programa
								</Text>
								<Text fontSize='sm'>{item.enrollment_period_program}</Text>
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='medium' color='gray.600'>
									Período de Inscripción
								</Text>
								<Text fontSize='sm'>{item.enrollment_period}</Text>
							</Box>
						</Card.Body>
					</Card.Root>
				</SimpleGrid>
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
				{item.studentbenefit && (
					<Card.Root border='1px solid' borderColor='green.200' bg='green.50'>
						<Card.Header pb={3}>
							<Box display='flex' alignItems='center' gap={2} color='green.800'>
								<Icon as={FiCheckCircle} boxSize={4} />
								<Heading size='sm'>Beneficio Otorgado</Heading>
							</Box>
						</Card.Header>
						<Card.Body pt={0}>
							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										ID del Beneficio
									</Text>
									<Text fontSize='sm' fontWeight='semibold'>
										{item.id}
									</Text>
								</Box>
								<Box>
									<Text fontSize='sm' fontWeight='medium' color='gray.600'>
										Porcentaje de Descuento
									</Text>
									<Badge
										bg='green.100'
										color='green.800'
										fontSize='sm'
										px={2}
										py={1}
									>
										{item.discount_percentage}%
									</Badge>
								</Box>
							</SimpleGrid>

							<Separator mb={4} />

							<Box mb={4}>
								<Text fontSize='sm' fontWeight='medium' color='gray.600' mb={2}>
									Fuente de Financiamiento
								</Text>
								<Box
									bg='white'
									p={3}
									rounded='md'
									border='1px solid'
									borderColor='gray.200'
								>
									<Text fontSize='sm' fontWeight='medium'>
										{item.founding_source_display}
									</Text>
									<Text fontSize='xs' color='gray.500'>
										Código: {item.founding_source}
									</Text>
								</Box>
							</Box>

							{item.other_founding_source && (
								<Box>
									<Text
										fontSize='sm'
										fontWeight='medium'
										color='gray.600'
										mb={2}
									>
										Otra Fuente de Financiamiento
									</Text>
									<Box
										bg='white'
										p={3}
										rounded='md'
										border='1px solid'
										borderColor='gray.200'
									>
										<Text fontSize='sm'>{item.other_founding_source}</Text>
									</Box>
								</Box>
							)}
						</Card.Body>
					</Card.Root>
				)}
			</Stack>
		</Modal>
	);
};

ViewMyBenefitsModal.propTypes = {
	item: PropTypes.object,
	fetchPaymentOrders: PropTypes.func,
};
