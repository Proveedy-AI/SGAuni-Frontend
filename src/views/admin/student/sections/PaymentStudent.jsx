import { useReadEnrollmentPayment } from '@/hooks/person/useReadEnrollmentPayment';
import PropTypes from 'prop-types';
import {
	Badge,
	Box,
	Card,
	Heading,
	HStack,
	Icon,
	Stack,
	Table,
} from '@chakra-ui/react';
import { PreviewMyOrdenDetailsModal } from '@/components/modals';
import { formatDateString } from '@/components/ui/dateHelpers';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { useEffect, useMemo, useState } from 'react';
import { ReactSelect } from '@/components';
import { FiCreditCard } from 'react-icons/fi';

export const PaymentStudent = ({ dataPerson, dataStudent }) => {
	const { data: dataPayment, isLoading: isLoadingPayment } =
		useReadEnrollmentPayment(dataPerson?.id, {}, {});

	const [selectProgram, setSelectProgram] = useState(null);

	const ProgramsOptions = useMemo(
		() =>
			dataStudent?.admission_programs
				?.map((program) => ({
					label: program.program_name,
					value: program.program,
				}))
				.reverse() || [],
		[dataStudent]
	);

	useEffect(() => {
		if (ProgramsOptions.length > 0 && !selectProgram) {
			setSelectProgram(ProgramsOptions[0]);
		}
	}, [ProgramsOptions, selectProgram]);
	const StatusOptions = [
		{ value: 1, label: 'Pendiente' },
		{ value: 2, label: 'Generado' },
		{ value: 3, label: 'Pagado' }, // puedes agregar más si aplica
		{ value: 4, label: 'Expirado' },
		{ value: 5, label: 'Cancelado' },
		{ value: 6, label: 'Devuelto' },
		{ value: 7, label: 'Rectificado' },
	];
	const statusColorMap = {
		1: 'red',
		2: 'blue',
		3: 'green',
		4: 'yellow',
		5: 'red',
		6: 'orange',
		7: 'purple',
	};

	const filteredPayment = useMemo(() => {
		if (!dataPayment) return [];
		if (!selectProgram) return dataPayment; // si no hay selección, muestra todo

		return Array.isArray(dataPayment)
			? dataPayment.filter((enroll) => enroll.program === selectProgram.value)
			: dataPayment.program === selectProgram.value
				? [dataPayment]
				: [];
	}, [dataPayment, selectProgram]);
	
	return (
		<Card.Root>
			<Card.Header pb={0}>
				<Stack
					justify='space-between'
					align={{ base: 'flex-start', md: 'center' }}
					direction={{ base: 'column', md: 'row' }}
					spacing={{ base: 3, md: 6 }}
					w='full'
				>
					{/* Título */}
					<HStack>
						<Icon as={FiCreditCard} boxSize={5} />
						<Heading size='md'>Pagos</Heading>
					</HStack>

					{/* Filtros y acciones */}
					<Stack
						direction={{ base: 'column', sm: 'row' }}
						spacing={{ base: 2, md: 4 }}
						w={{ base: 'full', md: 'auto' }}
					>
						<Box flex='1' minW={{ base: 'full', sm: '200px', md: '550px' }}>
							<ReactSelect
								placeholder='Filtrar por programa...'
								value={selectProgram}
								onChange={(value) => setSelectProgram(value)}
								variant='flushed'
								size='xs'
								isSearchable
								isClearable
								options={ProgramsOptions}
							/>
						</Box>
					</Stack>
				</Stack>
			</Card.Header>
			<Card.Body>
				<Box overflowX='auto'>
					<Table.Root size='sm' striped>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader>N°</Table.ColumnHeader>
								<Table.ColumnHeader w={'20%'}>Programa</Table.ColumnHeader>
								<Table.ColumnHeader w={'15%'}>Proceso</Table.ColumnHeader>
								<Table.ColumnHeader w={'15%'}>
									Concepto de pago
								</Table.ColumnHeader>
								<Table.ColumnHeader w={'10%'}>Monto</Table.ColumnHeader>
								<Table.ColumnHeader>Estado</Table.ColumnHeader>
								<Table.ColumnHeader w={'15%'}>
									Fecha Solicitud
								</Table.ColumnHeader>
								<Table.ColumnHeader>O. de Pago</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{isLoadingPayment ? (
								<SkeletonTable columns={8} />
							) : filteredPayment && filteredPayment.length > 0 ? (
								filteredPayment.map((item, index) => (
									<Table.Row key={item.id}>
										<Table.Cell>{index + 1}</Table.Cell>
										<Table.Cell>{item.program_name}</Table.Cell>
										<Table.Cell>
											{item.admission_process_name ||
												item.enrollment_process_name}
										</Table.Cell>
										<Table.Cell>{item.purpose_display}</Table.Cell>
										<Table.Cell>S/ {item.amount}</Table.Cell>
										<Table.Cell>
											<Badge
												colorPalette={statusColorMap[item.status] || 'gray'}
												variant='solid'
											>
												{
													StatusOptions.find((opt) => opt.value === item.status)
														?.label
												}
											</Badge>
										</Table.Cell>
										<Table.Cell>
											{formatDateString(item.requested_at)}
										</Table.Cell>
										<Table.Cell>
											<PreviewMyOrdenDetailsModal data={item} />
										</Table.Cell>
									</Table.Row>
								))
							) : (
								<Table.Row>
									<Table.Cell colSpan={8} textAlign='center'>
										No hay solicitudes de pago
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table.Root>
				</Box>
			</Card.Body>
		</Card.Root>
	);
};

PaymentStudent.propTypes = {
	dataPerson: PropTypes.object,
	dataStudent: PropTypes.object,
};
