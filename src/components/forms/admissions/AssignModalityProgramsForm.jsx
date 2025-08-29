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
	Card,
	Icon,
	Heading,
	Badge,
	SimpleGrid,
} from '@chakra-ui/react';
import { Button, Field, Modal, Tooltip, toaster } from '@/components/ui';
import { ReactSelect } from '@/components/select';
import { FiTrash2, FiSettings, FiPlus, FiTag } from 'react-icons/fi';
import {
	useCreateModalityAssignment,
	useDeleteModalityAssignment,
	useListAssignedModalities,
	useReadModalities,
	useUpdateModalityAssignment,
} from '@/hooks';

export const AssignModalityToProgramForm = ({ data, permissions }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [selectedModality, setSelectedModality] = useState(null);
	const [vacancies, setVacancies] = useState('');
	const [editingId, setEditingId] = useState(null);

	const { data: modalityAssignList, refetch } = useListAssignedModalities(
		{},
		{
			enabled: open,
		}
	);
	const { mutate: createAssignment, isPending } = useCreateModalityAssignment();
	const { mutate: deleteAssignment } = useDeleteModalityAssignment();
	const { mutate: updateAssignment } = useUpdateModalityAssignment();
	const { data: modalityList } = useReadModalities(
		{ postgraduate_type: data?.program_type },
		{
			enabled: open,
		}
	);

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

	const totalVacancies =
		filteredModality?.reduce((sum, item) => sum + item.vacancies, 0) || 0;
	const average =
		filteredModality?.length > 0
			? Math.round(totalVacancies / filteredModality.length)
			: 0;

	return (
		<Modal
			title='Asignar Modalidad a Admisión'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Asignar Modalidad de Admisión'
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
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '75vh' }}
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
					<Card.Header pb={0}>
						<Flex align='center' gap={2}>
							<Icon as={FiPlus} w={5} h={5} color='purple.600' />
							<Heading size='sm'>Nueva Modalidad de Admisión</Heading>
						</Flex>
					</Card.Header>

					<Card.Body pt={4}>
						<Flex direction={{ base: 'column', md: 'row' }} gap={4} align='end'>
							<Field label='Modalidad de Admisión:'>
								<ReactSelect
									value={selectedModality}
									onChange={setSelectedModality}
									options={modalityOptions}
									variant='flushed'
									size='xs'
									isClearable
									isSearchable
								/>
							</Field>

							<Field label='Numero de vacantes:'>
								<Input
									value={vacancies}
									onChange={(e) => setVacancies(e.target.value)}
									size='sm'
									min={1}
								></Input>
							</Field>

							<Button
								onClick={handleSubmit}
								disabled={
									!selectedModality ||
									!vacancies ||
									isPending ||
									(!permissions?.includes('admissions.programs.admin') &&
										data?.status === 4)
								}
								loading={isPending}
								colorPalette='purple'
								minW='150px'
							>
								<>
									<Icon as={FiPlus} boxSize={4} mr={2} />
									Asignar
								</>
							</Button>
						</Flex>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header pb={0}>
						<Flex justify='space-between' align='center'>
							<Flex align='center' gap={2}>
								<Icon as={FiTag} w={5} h={5} color='blue.600' />
								<Heading size='sm'>Modalidades Asignadas</Heading>
								<Badge
									variant='subtle'
									colorScheme='blue'
									bg='blue.50'
									color='blue.700'
									border='1px solid'
									borderColor='blue.200'
								>
									{filteredModality?.length} modalidades
								</Badge>
							</Flex>

							{totalVacancies > 0 && (
								<Box textAlign='right'>
									<Text fontSize='2xl' fontWeight='bold' color='blue.600'>
										{totalVacancies}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Total de Vacantes
									</Text>
								</Box>
							)}
						</Flex>
					</Card.Header>

					<Card.Body pt={4}>
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
													disabled={
														!permissions?.includes(
															'admissions.programs.admin'
														) && data?.status === 4
													}
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
					</Card.Body>
				</Card.Root>

				{filteredModality && filteredModality.length > 0 && (
					<Card.Root
						bgGradient='linear(to-r, purple.50, blue.50)'
						border='1px solid'
						borderColor='purple.200'
					>
						<Card.Body pt={6}>
							<SimpleGrid
								columns={{ base: 1, md: 3 }}
								spacing={4}
								textAlign='center'
							>
								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='purple.600'>
										{filteredModality.length}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Modalidades
									</Text>
								</Box>

								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='blue.600'>
										{totalVacancies}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Total Vacantes
									</Text>
								</Box>

								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='green.600'>
										{average}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Promedio por Modalidad
									</Text>
								</Box>
							</SimpleGrid>
						</Card.Body>
					</Card.Root>
				)}
			</Stack>
		</Modal>
	);
};

AssignModalityToProgramForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
	permissions: PropTypes.array,
};
