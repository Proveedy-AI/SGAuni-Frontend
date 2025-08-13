import PropTypes from 'prop-types';
import { ModalSimple } from '@/components/ui';
import { useRef, useState } from 'react';
import {
	Badge,
	Button,
	Card,
	Flex,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';

import { formatDateString } from '@/components/ui/dateHelpers';
import { useReadInstallmentsStudents } from '@/hooks/students/useReadInstallmentsStudents';
import { FiCalendar } from 'react-icons/fi';

export const ViewInstallmentsPaymentsModal = ({ item }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const { data: Installments } = useReadInstallmentsStudents(item.uuid, {
		enabled: open,
	});

	const getStatusBadgeProps = (status) => {
		switch (status) {
			case 'Pendiente':
			case 1:
				return { colorScheme: 'yellow', label: 'Pendiente' };
			case 'Pagado':
			case 2:
				return { colorScheme: 'green', label: 'Pagado' };
			case 'Vencido':
			case 3:
				return { colorScheme: 'red', label: 'Vencido' };
			default:
				return { colorScheme: 'gray', label: String(status) };
		}
	};
	return (
		<ModalSimple
			title='Cuotas del plan de fraccionamiento'
			placement='center'
			size='5xl'
			trigger={
				<Button disabled={!Installments?.results?.length} colorPalette='green' size='xs'>
					<FiCalendar /> Cronograma
				</Button>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
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
				<Card.Root>
					<Card.Header>
						<Card.Title>
							<Flex align='center' justify='space-between' gap={2}>
								<Flex align='center' gap={2}>
									<FiCalendar className='h-5 w-5 text-green-600' />
									<Text fontWeight='medium'>Cuotas para pagar</Text>
									<Badge
										variant='outline'
										bg='green.50'
										color='green.700'
										borderColor='green.200'
									>
										{Installments?.results?.length || 0} Cuotas
									</Badge>
								</Flex>
							</Flex>
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Table.Root size='sm' striped>
							<Table.Header>
								<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
									<Table.ColumnHeader>N°</Table.ColumnHeader>
									<Table.ColumnHeader>Monto (S/.)</Table.ColumnHeader>
									<Table.ColumnHeader>Estado</Table.ColumnHeader>
									<Table.ColumnHeader>Fecha de vencimiento</Table.ColumnHeader>
									<Table.ColumnHeader>Fecha de Pago</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{Installments?.results?.map((item, index) => {
									const { colorScheme, label } = getStatusBadgeProps(
										item.status
									);

									return (
										<Table.Row
											key={item.id}
											bg={{ base: 'white', _dark: 'its.gray.500' }}
										>
											<Table.Cell>{index + 1}</Table.Cell>
											<Table.Cell>{item.amount}</Table.Cell>
											<Table.Cell>
												<Badge colorPalette={colorScheme}>{label}</Badge>
											</Table.Cell>
											<Table.Cell>{formatDateString(item.due_date)}</Table.Cell>
											<Table.Cell>{formatDateString(item.paid_at)}</Table.Cell>
										</Table.Row>
									);
								})}
								{Installments?.results?.length === 0 && (
									<Table.Row>
										<Table.Cell colSpan={5} textAlign='center'>
											Sin datos disponibles
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table.Root>
					</Card.Body>
				</Card.Root>
			</Stack>
		</ModalSimple>
	);
};

ViewInstallmentsPaymentsModal.propTypes = {
	item: PropTypes.object,
	matchStatus: PropTypes.object,
};
