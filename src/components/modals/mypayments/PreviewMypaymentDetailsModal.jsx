import PropTypes from 'prop-types';
import {
	Badge,
	Box,
	Card,
	Flex,
	Icon,
	IconButton,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import { Modal, Tooltip } from '@/components/ui';
import {
	FiAlertCircle,
	FiBookOpen,
	FiCreditCard,
	FiDollarSign,
	FiEye,
	FiFileText,
} from 'react-icons/fi';
import { useState } from 'react';

export const PreviewMypaymentDetailsModal = ({ data, statusMap }) => {
	const [open, setOpen] = useState(false);

	const debtStatusUI = {
		PENDIENTE: {
			label: 'Pendiente',
			color: 'red.600',
			bg: 'red.100',
		},
		EN_PROCESO: {
			label: 'En Proceso',
			color: 'blue.600',
			bg: 'blue.100',
		},
		PAGADO: {
			label: 'Pagado',
			color: 'green.600',
			bg: 'green.100',
		},
	};

	const status = debtStatusUI[data.status] || {
		label: data.status_display,
		color: 'gray.600',
		bg: 'gray.100',
	};
	console.log(statusMap);
	return (
		<Modal
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
							colorPalette='gray'
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
			onOpenChange={(e) => setOpen(e.open)}
			size='4xl'
			hiddenFooter={true}
		>
			<Stack
				gap={2}
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
				<Box
					top='0'
					bg='white'
					borderBottom='1px solid'
					borderColor='gray.200'
					px={6}
					pb={4}
					zIndex={1}
				>
					<Flex justify='space-between' align='flex-start'>
						<Box>
							<Text fontSize='2xl' fontWeight='bold'>
								Detalle de Deuda
							</Text>
							<Flex align='center' gap={2} mt={2}>
								<Icon as={FiAlertCircle} color='blue.600' boxSize={4} />
								<Text fontSize='md' color='gray.600'>
									Información completa del concepto seleccionado
								</Text>
							</Flex>
						</Box>

						<Flex align='center' gap={3}>
							{(() => {
								return (
									<Badge variant='solid' bg={status.color}>
										{status.label}
									</Badge>
								);
							})()}
						</Flex>
					</Flex>
				</Box>

				<Card.Root borderLeft='4px solid' borderLeftColor='blue.500'>
					
					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiDollarSign} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Proposito de pago:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{data.purpose}
								</Text>
							</Box>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiBookOpen} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Programa:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{data.program}
								</Text>
							</Box>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiCreditCard} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Monto:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									S/.{data.amount}
								</Text>
							</Box>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiFileText} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Orden Asociada:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{data.orderId}
								</Text>
							</Box>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

PreviewMypaymentDetailsModal.propTypes = {
	data: PropTypes.object.isRequired,
	statusMap: PropTypes.object.isRequired,
};
