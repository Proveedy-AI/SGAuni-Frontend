import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Box, Stack, Table, Badge, Text } from '@chakra-ui/react';
import { Modal, Tooltip } from '@/components/ui';
import { useReadAdmissionsProgramsReview } from '@/hooks/admissions_review_programs';
import { format } from 'date-fns';

export const HistoryStatusProgramsView = ({ data, statusMap }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const { data: admissionReviews } = useReadAdmissionsProgramsReview({
		program_id: data.id,
	});

	return (
		<Modal
			title='Historial de estados'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Historial de estados'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						{(() => {
							const status = statusMap[data.status_display] || {
								label: data.status_display,
								color: 'default',
							};
							return (
								<Badge variant='solid' cursor='pointer' bg={status.color}>
									{status.label}
								</Badge>
							);
						})()}
					</Tooltip>
				</Box>
			}
			size='6xl'
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4} css={{ '--field-label-width': '150px' }}>
				<Text>
					<strong>{data.program_name}</strong>
				</Text>
				<Box>
					<Table.Root size='sm' striped>
						<Table.Header>
							<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
								<Table.ColumnHeader>N°</Table.ColumnHeader>
								<Table.ColumnHeader>Fecha de Revisión</Table.ColumnHeader>
								<Table.ColumnHeader>Estado</Table.ColumnHeader>
								<Table.ColumnHeader>Observación</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{admissionReviews?.results?.map((item, index) => (
								<Table.Row
									key={item.id}
									bg={{ base: 'white', _dark: 'its.gray.500' }}
								>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell>
										{format(new Date(item.review_at), 'dd/MM/yyyy hh:mm a')}
									</Table.Cell>
									<Table.Cell>
										{(() => {
											const status = statusMap[item.status_display] || {
												label: item.status_display,
												color: 'default',
											};

											return (
												<Badge variant='solid' bg={status.color}>
													{status.label}
												</Badge>
											);
										})()}
									</Table.Cell>

									<Table.Cell>{item.comments}</Table.Cell>
								</Table.Row>
							))}
							{admissionReviews?.results?.length === 0 && (
								<Table.Row>
									<Table.Cell colSpan={7} textAlign='center'>
										Sin datos disponibles
									</Table.Cell>
								</Table.Row>
							)}
						</Table.Body>
					</Table.Root>
				</Box>
			</Stack>
		</Modal>
	);
};

HistoryStatusProgramsView.propTypes = {
	data: PropTypes.object,
	statusMap: PropTypes.object,
};
