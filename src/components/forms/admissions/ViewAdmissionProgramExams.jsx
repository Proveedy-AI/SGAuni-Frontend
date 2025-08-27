import { Modal, Tooltip } from '@/components/ui';
import { useReadAdmissionEvaluationsByApplication } from '@/hooks/admissions_evaluations';
import { Box, Group, IconButton, Stack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import {
	UpdateQualificationEvaluationModal,
	ViewEvaluationDetailModal,
} from './evaluations';
import SkeletonTable from '@/components/ui/SkeletonTable';

export const ViewAdmissionProgramExams = ({ item, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const {
		data: dataEvaluationsByApplication,
		refetch: fetchExams,
		isLoading,
	} = useReadAdmissionEvaluationsByApplication(item.id, open);

	const dataEvaluation = dataEvaluationsByApplication?.results
		?.slice() // copiamos para no mutar el original
		.sort((a, b) => a.id - b.id);

	return (
		<Modal
			title='Ver Evaluaciones'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Ver Evaluaciones'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='blue'
							css={{ _icon: { width: '5', height: '5' } }}
              disabled={item?.status === 1}
						>
							<FiCheckCircle />
						</IconButton>
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
				<Table.Root size='sm' striped>
					<Table.Header>
						<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
							<Table.ColumnHeader>N°</Table.ColumnHeader>
							<Table.ColumnHeader>Evaluador</Table.ColumnHeader>
							<Table.ColumnHeader>Fecha</Table.ColumnHeader>
							<Table.ColumnHeader>Tipo de Evaluación</Table.ColumnHeader>
							<Table.ColumnHeader>Calificación</Table.ColumnHeader>
							<Table.ColumnHeader>Acciones</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading ? (
							<SkeletonTable columns={6} />
						) : dataEvaluation?.length > 0 ? (
							dataEvaluation?.map((evaluation, index) => (
								<Table.Row key={evaluation.id}>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell>{evaluation.evaluator_full_name}</Table.Cell>
									<Table.Cell>{evaluation.start_date}</Table.Cell>
									<Table.Cell>
										{evaluation.type_application_display}
										{evaluation.type_application === 2 &&
											evaluation.path_url && (
												<Box as='span' ml={2}>
													<button
														style={{
															color: '#3182ce',
															textDecoration: 'underline',
															background: 'none',
															border: 'none',
															padding: 0,
															cursor: 'pointer',
														}}
														onClick={() =>
															window.open(evaluation.path_url, '_blank')
														}
													>
														Ver ensayo
													</button>
												</Box>
											)}
									</Table.Cell>
									<Table.Cell>{evaluation.qualification ?? '-'}</Table.Cell>
									<Table.Cell>
										<Group gap={2}>
											<ViewEvaluationDetailModal data={evaluation} />
											<UpdateQualificationEvaluationModal
												data={evaluation}
												fetchData={fetchExams}
												fetchDataMain={fetchData}
											/>
										</Group>
									</Table.Cell>
								</Table.Row>
							))
						) : (
							<Table.Row>
								<Table.Cell colSpan={6} textAlign='center'>
									Sin datos disponibles
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Stack>
		</Modal>
	);
};

ViewAdmissionProgramExams.propTypes = {
	item: PropTypes.object.isRequired,
	fetchData: PropTypes.func.isRequired,
};
