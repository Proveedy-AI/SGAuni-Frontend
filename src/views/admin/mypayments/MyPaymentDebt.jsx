import { PreviewMypaymentDetailsModal } from '@/components/modals';
import { Alert } from '@/components/ui';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Heading,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export const MyPaymentDebt = () => {
	// Datos de ejemplo - Usuario con múltiples programas
	const userPrograms = [
		{ id: 'ING-SIS', name: 'Ingeniería de Sistemas', active: true },
		{ id: 'ING-IND', name: 'Ingeniería Industrial', active: true },
		{ id: 'ADM-EMP', name: 'Administración de Empresas', active: false },
	];

	const [selectedProgram, setSelectedProgram] = useState(
		userPrograms.filter((p) => p.active).length === 1
			? userPrograms.id
			: 'TODOS'
	);

	const debtsByPurpose = [
		{
			purpose: 'MATRICULA',
			description: 'Matrícula Semestre 2024-I',
			amount: 1200,
			status: 'PENDIENTE',
			dueDate: '2024-02-15',
			program: 'Ingeniería de Sistemas',
			programId: 'ING-SIS',
			orderId: 'OP-2024-001',
		},
		{
			purpose: 'MATRICULA',
			description: 'Matrícula Semestre 2024-I',
			amount: 1100,
			status: 'PENDIENTE',
			dueDate: '2024-02-15',
			program: 'Ingeniería Industrial',
			programId: 'ING-IND',
			orderId: 'OP-2024-003',
		},
		{
			purpose: 'PENSION',
			description: 'Pensión Enero 2024',
			amount: 800,
			status: 'PENDIENTE',
			dueDate: '2024-01-31',
			program: 'Ingeniería de Sistemas',
			programId: 'ING-SIS',
			orderId: null,
		},
		{
			purpose: 'CERTIFICADOS',
			description: 'Certificados de Estudios',
			amount: 150,
			status: 'EN_PROCESO',
			dueDate: '-',
			program: 'Ingeniería de Sistemas',
			programId: 'ING-SIS',
			orderId: 'SOL-2024-001',
		},
		{
			purpose: 'CARPETAS',
			description: 'Carpetas Académicas',
			amount: 80,
			status: 'PAGADO',
			dueDate: '2024-01-25',
			program: 'Ingeniería Industrial',
			programId: 'ING-IND',
			orderId: 'OP-2024-002',
		},
	];
	const getFilteredDebts = () => {
		return debtsByPurpose.filter((debt) => debt.programId === selectedProgram);
	};

	const activePrograms = userPrograms.filter((p) => p.active === true);
	const description =
		activePrograms.length === 1
			? 'Vista automática de tu único programa académico'
			: selectedProgram === 'TODOS'
				? 'Resumen de todos tus programas académicos'
				: `Filtrado por: ${userPrograms.find((p) => p.id === selectedProgram)?.name}`;

	const getConsolidatedDebtsByPurpose = () => {
		const consolidated = {};

		debtsByPurpose.forEach((debt) => {
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

			if (debt.status === 'PENDIENTE')
				consolidated[debt.purpose].pendingCount++;
			else if (debt.status === 'PAGADO') consolidated[debt.purpose].paidCount++;
			else if (debt.status === 'EN_PROCESO')
				consolidated[debt.purpose].inProcessCount++;
		});

		return Object.values(consolidated);
	};
	const getConsolidatedTotals = () => {
		if (selectedProgram === 'TODOS') {
			return {
				pendingDebts: debtsByPurpose
					.filter((d) => d.status === 'PENDIENTE')
					.reduce((sum, d) => sum + d.amount, 0),
				pendingCount: debtsByPurpose.filter((d) => d.status === 'PENDIENTE')
					.length,
			};
		} else {
			return {
				pendingDebts: getFilteredDebts()
					.filter((d) => d.status === 'PENDIENTE')
					.reduce((sum, d) => sum + d.amount, 0),
				pendingCount: getFilteredDebts().filter((d) => d.status === 'PENDIENTE')
					.length,
			};
		}
	};

	const totals = getConsolidatedTotals();

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
					{userPrograms.length > 1 && (
						<CustomSelect
							value={selectedProgram}
							onChange={(val) => setSelectedProgram(val)}
							placeholder='Filtrar por programa'
							w={{ base: '100%', md: '250px' }}
							size='sm'
							items={[
								{ value: 'TODOS', label: 'Todos los programas' },
								...userPrograms.map((program) => ({
									value: program.id,
									label: program.name,
								})),
							]}
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
							Tienes deudas pendientes por S/ {totals.pendingDebts}
						</strong>{' '}
					</Box>
				</Alert>
			)}
			<Card.Root borderRadius={'lg'}>
				<Card.Header>
					<Card.Title fontSize={'24px'}>
						Deudas Consolidadas por Propósito
					</Card.Title>
					<Card.Description>{description}</Card.Description>
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
														S/ {consolidated.totalAmount}
													</Text>
													<Text fontSize='sm' color='gray.500'>
														Total {consolidated.purpose.toLowerCase()}
													</Text>
												</Box>
											</Flex>
										</Card.Header>
										<Card.Body>
											<Table.Root size='sm'>
												<Table.Header></Table.Header>
												<Table.Row>
													<Table.ColumnHeader>N°</Table.ColumnHeader>
													<Table.ColumnHeader>Programa</Table.ColumnHeader>
													<Table.ColumnHeader>Descripción</Table.ColumnHeader>
													<Table.ColumnHeader>Monto</Table.ColumnHeader>
													<Table.ColumnHeader>Estado</Table.ColumnHeader>
													<Table.ColumnHeader>
														Fecha Vencimiento
													</Table.ColumnHeader>
													<Table.ColumnHeader>Acciones</Table.ColumnHeader>
												</Table.Row>

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
																		debt.status === 'PENDIENTE'
																			? 'red.600'
																			: 'inherit'
																	}
																	fontWeight={
																		debt.status === 'PENDIENTE'
																			? 'semibold'
																			: 'normal'
																	}
																>
																	S/ {debt.amount}
																</Table.Cell>
																<Table.Cell>
																	<Badge
																		colorPalette={
																			debt.status === 'PENDIENTE'
																				? 'red'
																				: debt.status === 'EN_PROCESO'
																					? 'blue'
																					: 'green'
																		}
																	>
																		{debt.status === 'PENDIENTE'
																			? 'Pendiente'
																			: debt.status === 'EN_PROCESO'
																				? 'En Proceso'
																				: 'Pagado'}
																	</Badge>
																</Table.Cell>
																<Table.Cell>{debt.dueDate}</Table.Cell>
																<Table.Cell>
																	<Flex gap={2}>
																		{debt.status === 'PENDIENTE' &&
																			!debt.orderId && (
																				<Button size='sm'>
																					Solicitar Orden
																				</Button>
																			)}
																		{debt.orderId && (
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
										</Card.Body>
									</Card.Root>
								))
							) : (
								<Text>No hay deudas pendientes</Text>
							);
						})()}
					</Stack>
				</Card.Body>
			</Card.Root>
		</Box>
	);
};
