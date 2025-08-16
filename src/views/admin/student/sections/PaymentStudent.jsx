import { useReadEnrollmentPayment } from '@/hooks/person/useReadEnrollmentPayment';
import PropTypes from 'prop-types';
import { Badge, Box, Card, Table } from '@chakra-ui/react';
import { PreviewMyOrdenDetailsModal } from '@/components/modals';
import { formatDateString } from '@/components/ui/dateHelpers';
import SkeletonTable from '@/components/ui/SkeletonTable';

export const PaymentStudent = ({ dataPerson }) => {
	const { data: dataPayment, isLoading: isLoadingPayment } =
		useReadEnrollmentPayment(dataPerson?.id, {}, {});
	const StatusOptions = [
		{ value: 1, label: 'Pendiente' },
		{ value: 2, label: 'Generado' },
		{ value: 3, label: 'Pagado' }, // puedes agregar más si aplica
		{ value: 4, label: 'Expirado' },
	];
	const statusColorMap = {
		1: 'red',
		2: 'blue',
		3: 'green',
		4: 'yellow',
	};
	return (
		<Card.Root>
			<Card.Body>
				<Box overflowX='auto'>
					<Table.Root size='sm' striped>
						<Table.Header></Table.Header>
						<Table.Row>
							<Table.ColumnHeader>N°</Table.ColumnHeader>
							<Table.ColumnHeader w={'20%'}>Programa</Table.ColumnHeader>
							<Table.ColumnHeader w={'15%'}>Proceso</Table.ColumnHeader>
							<Table.ColumnHeader w={'15%'}>Concepto de pago</Table.ColumnHeader>
							<Table.ColumnHeader w={'10%'}>Monto</Table.ColumnHeader>
							<Table.ColumnHeader>Estado</Table.ColumnHeader>
							<Table.ColumnHeader w={'15%'}>Fecha Solicitud</Table.ColumnHeader>
							<Table.ColumnHeader>O. de Pago</Table.ColumnHeader>
						</Table.Row>

						<Table.Body>
							{isLoadingPayment ? (
								<SkeletonTable columns={8} />
							) : dataPayment && dataPayment.length > 0 ? (
								dataPayment.map((item, index) => (
									<Table.Row key={item.id}>
										<Table.Cell>{index + 1}</Table.Cell>
										<Table.Cell>
											{item.admission_process_program_name ||
												item.enrollment_process_program_name}
										</Table.Cell>
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
	dataPerson: PropTypes.object.isRequired,
};
