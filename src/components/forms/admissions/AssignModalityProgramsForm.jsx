import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	Box,
	IconButton,
	Stack,
	Table,
	Flex,
	Text,
	Input,
} from '@chakra-ui/react';
import { Field, Modal, Tooltip, toaster } from '@/components/ui';
import { ReactSelect } from '@/components/select';
import { FiTrash2, FiSettings } from 'react-icons/fi';
import {
	useCreateModalityAssignment,
	useDeleteModalityAssignment,
	useListAssignedModalities,
	useReadModalities,
	useUpdateModalityAssignment,
} from '@/hooks';
import { FaSave } from 'react-icons/fa';

export const AssignModalityToProgramForm = ({ data }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [selectedModality, setSelectedModality] = useState(null);
	const [vacancies, setVacancies] = useState('');
	const [editingId, setEditingId] = useState(null);

	const { data: modalityAssignList, refetch } = useListAssignedModalities();
	const { mutate: createAssignment, isPending } = useCreateModalityAssignment();
	const { mutate: deleteAssignment } = useDeleteModalityAssignment();
	const { mutate: updateAssignment } = useUpdateModalityAssignment();
	const { data: modalityList } = useReadModalities();

	const filteredModality = modalityAssignList?.results?.filter(
		(item) => item?.admission_process_program === data?.id
	);
	const modalityOptions = modalityList?.results
		?.filter((modality) => modality.enabled)
		?.map((modality) => ({
			label: modality.name,
			value: modality.id,
		}));

	const handleResetForm = () => {
		setSelectedModality(null);
		setVacancies('');
		setEditingId(null);
	};

	const handleSubmit = () => {
		if (!selectedModality || !vacancies) {
			toaster.create({
				title: 'Completa todos los campos obligatorios',
				type: 'warning',
			});
			return;
		}

		const payload = {
			admission_process_program: data.id,
			vacancies: Number(vacancies),
			modality: selectedModality.value,
		};
		const onSuccess = () => {
			toaster.create({
				title: editingId ? 'Asignación actualizada' : 'Asignación creada',
				type: 'success',
			});
			handleResetForm();
			refetch();
		};

		const onError = (error) => {
			console.error(error);
			toaster.create({
				title: error.response?.data?.[0] || 'Error en la asignación',
				type: 'error',
			});
		};

		if (editingId) {
			updateAssignment({ id: editingId, payload }, { onSuccess, onError });
		} else {
			createAssignment(payload, { onSuccess, onError });
		}
	};

	const handleDelete = (id) => {
		deleteAssignment(id, {
			onSuccess: () => {
				toaster.create({ title: 'Asignación eliminada', type: 'info' });
				refetch();
			},
			onError: (error) => {
				toaster.create({
					title: error.response?.data?.[0] || 'Error al eliminar',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Asignar Modalidad a Programa'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Asignar Modalidad'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							size='xs'
							colorPalette='purple'
							css={{ _icon: { width: '5', height: '5' } }}
						>
							<FiSettings />
						</IconButton>
					</Tooltip>
				</Box>
			}
			size='4xl'
			open={open}
			hiddenFooter={true}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4} css={{ '--field-label-width': '150px' }}>
				<Flex
					direction={{ base: 'column', md: 'row' }}
					justify='flex-start'
					align={'end'}
					gap={2}
					mt={2}
				>
					<Field label='Modalidad:'>
						<ReactSelect
							value={selectedModality}
							onChange={setSelectedModality}
							options={modalityOptions}
							variant='flushed'
							size='xs'
							isSearchable
						/>
					</Field>

					<Field label='Vacantes:'>
						<Input
							value={vacancies}
							onChange={(e) => setVacancies(e.target.value)}
							size='sm'
							min={1}
						></Input>
					</Field>
					<IconButton
						size='sm'
						bg='uni.secondary'
						loading={isPending}
						disabled={!vacancies || !selectedModality || data.status === 4}
						onClick={handleSubmit}
						css={{ _icon: { width: '5', height: '5' } }}
					>
						<FaSave />
					</IconButton>
				</Flex>
				<Box mt={6}>
					<Text fontWeight='semibold' mb={2}>
						Modalidades Asignadas:
					</Text>
					<Table.Root size='sm' striped>
						<Table.Header>
							<Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
								<Table.ColumnHeader>N°</Table.ColumnHeader>
								<Table.ColumnHeader>Modalidad</Table.ColumnHeader>
								<Table.ColumnHeader>Vacantes</Table.ColumnHeader>
								<Table.ColumnHeader>Acciones</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{filteredModality?.map((item, index) => (
								<Table.Row
									key={item.id}
									bg={{ base: 'white', _dark: 'its.gray.500' }}
								>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell>{item.modality_name}</Table.Cell>
									<Table.Cell>{item.vacancies}</Table.Cell>

									<Table.Cell>
										<Flex gap={2}>
											<IconButton
												size='xs'
												disabled={data.status === 4}
												colorPalette='red'
												onClick={() => handleDelete(item.id)}
												aria-label='Eliminar'
											>
												<FiTrash2 />
											</IconButton>
										</Flex>
									</Table.Cell>
								</Table.Row>
							))}
							{filteredModality?.length === 0 && (
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

AssignModalityToProgramForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};
