import PropTypes from 'prop-types';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Icon,
	IconButton,
	SimpleGrid,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import { Modal, Tooltip } from '@/components/ui';
import {
	FiAlertCircle,
	FiArrowRight,
	FiCreditCard,
	FiDollarSign,
	FiFile,
	FiHash,
	FiTag,
	FiTrendingUp,
} from 'react-icons/fi';
import { useState } from 'react';
import { useReadPaymentOrders } from '@/hooks/payment_orders';
import { formatDateString } from '@/components/ui/dateHelpers';
import { useNavigate } from 'react-router';

export const PreviewMyOrdenDetailsModal = ({ data }) => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { data: PaymentOrder } = useReadPaymentOrders(
		{ request: data.id },
		{
			enabled: open,
		}
	);

	const allPaymentRequests =
		PaymentOrder?.pages?.flatMap((page) => page.results) ?? [];

	const totalPayments =
		allPaymentRequests?.reduce((sum, item) => sum + item.vacancies, 0) || 0;

	const StatusOptions = [
		{ value: 1, label: 'Pendiente' },
		{ value: 2, label: 'Generado' },
		{ value: 3, label: 'Verificado' }, // puedes agregar más si aplica
		{ value: 4, label: 'Expirado' },
		{ value: 5, label: 'Cancelado' },
	];
	const statusColorMap = {
		1: 'yellow',
		2: 'blue',
		3: 'green',
		4: 'red',
		5: 'red',
	};

	const handleRowClick = () => {
		navigate(`/mypaymentsdebts/uploadsvouchers`);
	};

	return (
		<Modal
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Orden de Pago'
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
							<FiFile />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='8xl'
			hiddenFooter={true}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '90vh' }}
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
								Detalles de la Orden de Pago
							</Text>
							<Flex align='center' gap={2} mt={2}>
								<Icon as={FiAlertCircle} color='blue.600' boxSize={4} />
								<Text fontSize='md' color='gray.600'>
									Información completa del concepto seleccionado
								</Text>
							</Flex>
						</Box>
					</Flex>
				</Box>

				<Card.Root borderLeft='4px solid' borderLeftColor='blue.500'>
					<Card.Body>
						<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiDollarSign} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Concepto de pago:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{data.purpose_display}
								</Text>
							</Box>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiCreditCard} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Método de Pago:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{data.payment_method_display}
								</Text>
							</Box>
							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiTrendingUp} boxSize={4} color='green.600' />
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
									<Icon as={FiHash} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Número de Documento:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{data.num_document}
								</Text>
							</Box>

							<Box>
								<Flex align='center' gap={2} mb={1}>
									<Icon as={FiHash} boxSize={4} color='green.600' />
									<Text fontSize='sm' fontWeight='medium' color='gray.700'>
										Comprobante:
									</Text>
								</Flex>
								<Text
									ml={6}
									fontSize='lg'
									fontWeight='semibold'
									color='gray.900'
								>
									{data.document_type_display}
								</Text>
							</Box>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
				<Card.Root>
					<Card.Header pb={0}>
						<Flex justify='space-between' align='center'>
							<Flex align='center' gap={2}>
								<Icon as={FiTag} w={5} h={5} color='blue.600' />
								<Heading size='sm'>Ordenes Generadas</Heading>
								<Badge
									variant='subtle'
									colorScheme='blue'
									bg='blue.50'
									color='blue.700'
									border='1px solid'
									borderColor='blue.200'
								>
									{PaymentOrder?.results?.length} órdenes
								</Badge>
							</Flex>

							{totalPayments > 0 && (
								<Box textAlign='right'>
									<Text fontSize='2xl' fontWeight='bold' color='blue.600'>
										{totalPayments}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Total de Vacantes
									</Text>
								</Box>
							)}
						</Flex>
					</Card.Header>

					<Card.Body pt={4}>
						<Box overflowX='auto'>
							<Table.Root size='sm' striped>
								<Table.Header>
									<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
										<Table.ColumnHeader>N°</Table.ColumnHeader>
										<Table.ColumnHeader>N° de Orden</Table.ColumnHeader>
										<Table.ColumnHeader>Tipo de Documento</Table.ColumnHeader>

										<Table.ColumnHeader>Sub Total (S/.)</Table.ColumnHeader>
										<Table.ColumnHeader>Descuento (%)</Table.ColumnHeader>
										<Table.ColumnHeader>Total (S/.)</Table.ColumnHeader>
										<Table.ColumnHeader>Estado</Table.ColumnHeader>
										<Table.ColumnHeader>Expira</Table.ColumnHeader>

										<Table.ColumnHeader>Acciones</Table.ColumnHeader>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{allPaymentRequests?.map((item, index) => (
										<Table.Row
											key={item.id}
											bg={{ base: 'white', _dark: 'its.gray.500' }}
										>
											<Table.Cell>{index + 1}</Table.Cell>
											<Table.Cell>{item.id_orden}</Table.Cell>
											<Table.Cell>{item.document_type_display}</Table.Cell>
											<Table.Cell>{item.sub_amount}</Table.Cell>
											<Table.Cell>{item.discount_value * 100}%</Table.Cell>
											<Table.Cell>{item.total_amount}</Table.Cell>
											<Table.Cell>
												<Badge
													colorPalette={statusColorMap[item.status] || 'gray'}
													variant='solid'
												>
													{
														StatusOptions.find(
															(opt) => opt.value === item.status
														)?.label
													}
												</Badge>
											</Table.Cell>
											<Table.Cell>{formatDateString(item.due_date)}</Table.Cell>
											<Table.Cell>
												<Button
													size='sm'
													colorScheme='blue'
													disabled={item.status === 3 || item.status === 4}
													onClick={() => {
														handleRowClick(item);
													}}
												>
													<FiArrowRight />
													Ir a pagar
												</Button>
											</Table.Cell>
										</Table.Row>
									))}
									{allPaymentRequests?.length === 0 && (
										<Table.Row>
											<Table.Cell colSpan={9} textAlign='center'>
												Sin datos disponibles
											</Table.Cell>
										</Table.Row>
									)}
								</Table.Body>
							</Table.Root>
						</Box>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

PreviewMyOrdenDetailsModal.propTypes = {
	data: PropTypes.object.isRequired,
};
