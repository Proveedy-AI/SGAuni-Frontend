import { FractionateDebt } from '@/components/forms/mypayments';
import { PreviewMypaymentDetailsModal } from '@/components/modals';
import { Alert } from '@/components/ui';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useReadMyApplicants } from '@/hooks';
import { useReadMyDebtsPayment } from '@/hooks/payment_orders';
import {
	Badge,
	Box,
	Button,
	Card,
	Center,
	Flex,
	Heading,
	Icon,
	Spinner,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export const MyPaymentDebt = () => {
	const { data: dataMyApplicants } = useReadMyApplicants();
	const userPrograms = dataMyApplicants?.map((programs) => ({
		label: programs.postgraduate_name,
		value: programs.id,
	}));

	const [selectedProgram, setSelectedProgram] = useState(
		userPrograms?.filter((p) => p.active).length === 1
			? userPrograms?.id
			: 'TODOS'
	);

	const { data: debtsByPurpose, isLoading: isLoadingDebts } =
		useReadMyDebtsPayment();
	console.log(debtsByPurpose);
	const getFilteredDebts = () => {
		if (!debtsByPurpose?.results) return [];
		return debtsByPurpose.results.filter(
			(debt) => debt.programId === selectedProgram
		);
	};

	const activePrograms = userPrograms?.filter((p) => p.active === true);
	const description =
		activePrograms?.length === 1
			? `Mostrando deudas de tu único programa activo: ${activePrograms[0].name}`
			: selectedProgram === 'TODOS'
				? 'Mostrando deudas de todos tus programas activos'
				: `Mostrando deudas de: ${userPrograms?.find((p) => p.id === selectedProgram)?.name ?? 'Todo los programas'}`;

	// Mejorar filtro: solo mostrar programas activos en el selector
	const programOptions = [
		{ value: 'TODOS', label: 'Todos los programas activos' },
		...(activePrograms || []).map((program) => ({
			value: program.id,
			label: program.name,
		})),
	];

	const getConsolidatedDebtsByPurpose = () => {
		const consolidated = {};

		if (!debtsByPurpose?.results) return [];

		debtsByPurpose.results.forEach((debt) => {
			if (!consolidated[debt.purpose]) {
				consolidated[debt.purpose] = {
					purpose: debt.purpose,
					totalAmount: 0,
					items: [],
					pendingCount: 0,
					paidCount: 0,
					inProcessCount: 0,
				};
			}

			consolidated[debt.purpose].totalAmount += debt.amount;
			consolidated[debt.purpose].items.push(debt);

			if (debt.status === 4) consolidated[debt.purpose].pendingCount++;
			else if (debt.status === 'PAGADO') consolidated[debt.purpose].paidCount++;
			else if (debt.status === 'EN_PROCESO')
				consolidated[debt.purpose].inProcessCount++;
		});

		return Object.values(consolidated);
	};
	const getConsolidatedTotals = () => {
		if (!debtsByPurpose?.results) {
			return {
				pendingDebts: 0,
				pendingCount: 0,
			};
		}

		if (selectedProgram === 'TODOS') {
			const pendingDebts = debtsByPurpose.results
				.filter((d) => d.status === 4)
				.reduce((sum, d) => sum + d.amount, 0);

			const pendingCount = debtsByPurpose.results.filter(
				(d) => d.status === 4
			).length;

			return {
				pendingDebts,
				pendingCount,
			};
		} else {
			const filteredDebts = getFilteredDebts();
			const pendingDebts = filteredDebts
				.filter((d) => d.status === 4)
				.reduce((sum, d) => sum + d.amount, 0);

			const pendingCount = filteredDebts.filter((d) => d.status === 4).length;

			return {
				pendingDebts,
				pendingCount,
			};
		}
	};

	const totals = getConsolidatedTotals();

	if (isLoadingDebts) {
		return (
			<Center minH='50vh'>
				<Spinner size='xl' thickness='4px' speed='0.65s' color='uni.primary' />
			</Center>
		);
	}

	const has_debt = totals.pendingDebts > 0;

	const filteredConsolidated = getConsolidatedDebtsByPurpose().filter(
		(consolidated) =>
			// Filtra por programa
			(selectedProgram === 'TODOS' ||
				consolidated.items.some(
					(item) => item.programId === selectedProgram
				)) &&
			// Filtra por propósito fraccionamiento o 8
			consolidated.items.some(
				(item) => item.purpose_id === 3 || item.purpose_id === 4
			)
	);

	// Verifica si hay alguna deuda relevante
	const showDebtsSection = has_debt && filteredConsolidated.length > 0;

	return (
		<Box>
			<Flex
				justify='space-between'
				align='center'
				mb={6}
				flexWrap='wrap'
				gap={4}
			>
				<Text fontSize='2xl' fontWeight='bold'>
					Mis Deudas de Pago
				</Text>

				<Flex align='center' gap={3}>
					{userPrograms?.length > 1 && (
						<CustomSelect
							value={selectedProgram}
							onChange={(val) => setSelectedProgram(val)}
							placeholder='Filtrar por programa'
							w={{ base: '100%', md: '250px' }}
							size='sm'
							items={programOptions}
						></CustomSelect>
					)}
				</Flex>
			</Flex>
			{totals.pendingDebts > 0 && (
				<Alert
					status='error'
					variant='subtle'
					borderRadius='md'
					alignItems='start'
					mb={6}
					icon={<FiAlertTriangle />}
				>
					<Box pl={2}>
						<strong>
							Tienes deudas pendientes por S/ {Number(totals.pendingDebts)}
						</strong>{' '}
					</Box>
				</Alert>
			)}
			<Card.Root borderRadius={'lg'}>
				<Card.Header>
					<Flex justify='space-between' gap={3} align='center'>
						<Box>
							<Card.Title fontSize={'24px'}>
								Deudas Consolidadas por Concepto de pago
							</Card.Title>
							<Card.Description>{description}</Card.Description>
						</Box>
						{showDebtsSection && (
							<FractionateDebt
								dataMyApplicants={dataMyApplicants}
								countDebts={Number(totals.pendingDebts)}
								debtsByPurpose={debtsByPurpose.results}
							/>
						)}
					</Flex>
				</Card.Header>

				<Card.Body>
					<Stack gap={4}>
						{(() => {
							const filteredConsolidated =
								getConsolidatedDebtsByPurpose().filter(
									(consolidated) =>
										selectedProgram === 'TODOS' ||
										consolidated.items.some(
											(item) => item.programId === selectedProgram
										)
								);
							return filteredConsolidated.length > 0 ? (
								filteredConsolidated.map((consolidated, index) => (
									<Card.Root
										key={index}
										borderLeftWidth='4px'
										borderLeftColor='blue.500'
									>
										<Card.Header pb={3}>
											<Flex justify='space-between' align='flex-start'>
												<Box>
													<Heading size='md'>{consolidated.purpose}</Heading>
													<Text fontSize='sm' color='gray.600'>
														{consolidated.pendingCount > 0 && (
															<Text
																as='span'
																color='red.500'
																fontWeight='medium'
															>
																{consolidated.pendingCount} pendiente
																{consolidated.pendingCount > 1 ? 's' : ''}
															</Text>
														)}
														{consolidated.paidCount > 0 && (
															<Text
																as='span'
																color='green.600'
																fontWeight='medium'
																ml={2}
															>
																{consolidated.paidCount} pagado
																{consolidated.paidCount > 1 ? 's' : ''}
															</Text>
														)}
														{consolidated.inProcessCount > 0 && (
															<Text
																as='span'
																color='blue.600'
																fontWeight='medium'
																ml={2}
															>
																{consolidated.inProcessCount} en proceso
															</Text>
														)}
													</Text>
												</Box>
												<Box textAlign='right'>
													<Text fontSize='2xl' fontWeight='bold'>
														S/ {Number(consolidated.totalAmount)}
													</Text>
													<Text fontSize='sm' color='gray.500'>
														Total {consolidated.purpose.toLowerCase()}
													</Text>
												</Box>
											</Flex>
										</Card.Header>
										<Card.Body>
											<Box overflowX='auto'>
												<Table.Root size='sm' variant='striped'>
													<Table.Header>
														<Table.Row>
															<Table.ColumnHeader>N°</Table.ColumnHeader>
															<Table.ColumnHeader>Programa</Table.ColumnHeader>
															<Table.ColumnHeader>
																Descripción
															</Table.ColumnHeader>
															<Table.ColumnHeader>Monto</Table.ColumnHeader>
															<Table.ColumnHeader>Estado</Table.ColumnHeader>
															<Table.ColumnHeader>
																Fecha Vencimiento
															</Table.ColumnHeader>
															<Table.ColumnHeader>Acciones</Table.ColumnHeader>
														</Table.Row>
													</Table.Header>

													<Table.Body>
														{consolidated.items
															.filter(
																(item) =>
																	selectedProgram === 'TODOS' ||
																	item.programId === selectedProgram
															)
															.map((debt, itemIndex) => (
																<Table.Row key={itemIndex}>
																	<Table.Cell>{itemIndex + 1}</Table.Cell>
																	<Table.Cell fontWeight='medium'>
																		{debt.program}
																	</Table.Cell>
																	<Table.Cell>{debt.description}</Table.Cell>
																	<Table.Cell
																		color={
																			debt.status === 4 ? 'red.600' : 'inherit'
																		}
																		fontWeight={
																			debt.status === 4 ? 'semibold' : 'normal'
																		}
																	>
																		S/ {debt.amount}
																	</Table.Cell>
																	<Table.Cell>
																		<Badge
																			colorPalette={
																				debt.status === 4
																					? 'red'
																					: debt.status === 2
																						? 'blue'
																						: 'green'
																			}
																		>
																			{debt.status === 4
																				? 'Expirado'
																				: debt.status === 2
																					? 'En Proceso'
																					: 'Pagado'}
																		</Badge>
																	</Table.Cell>
																	<Table.Cell>{debt.dueDate}</Table.Cell>
																	<Table.Cell>
																		<Flex gap={2}>
																			{debt.status === 4 &&
																				!debt.id_orden && (
																					<Button size='sm'>
																						Solicitar Orden
																					</Button>
																				)}
																			{debt.id_orden && (
																				<PreviewMypaymentDetailsModal
																					data={debt}
																				/>
																			)}
																		</Flex>
																	</Table.Cell>
																</Table.Row>
															))}
													</Table.Body>
												</Table.Root>
											</Box>
										</Card.Body>
									</Card.Root>
								))
							) : (
								<Flex direction='column' align='center' gap={2}>
									<Icon as={FiCheckCircle} w={8} h={8} color='green.400' />
									<Text fontWeight='semibold' color='green.700' fontSize='lg'>
										No hay deudas pendientes
									</Text>
								</Flex>
							);
						})()}
					</Stack>
				</Card.Body>
			</Card.Root>
		</Box>
	);
};
