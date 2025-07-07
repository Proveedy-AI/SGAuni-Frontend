import { ReactSelect } from '@/components/select';
import { Field, Modal, toaster, Tooltip } from '@/components/ui';
import {
	useReadAdmissionEvaluators,
	useCreateAdmissionEvaluator,
	useUpdateAdmissionEvaluator,
	useDeleteAdmissionEvaluator,
} from '@/hooks/admissions_evaluators';
import { useReadUsers } from '@/hooks/users';
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Grid,
	IconButton,
	SimpleGrid,
	Stack,
	Table,
	Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import {
	FiCheckSquare,
	FiEye,
	FiMessageSquare,
	FiPlus,
	FiTrash2,
	FiUserCheck,
	FiUsers,
} from 'react-icons/fi';
import { LuClipboardCheck } from 'react-icons/lu';

export const AssignEvaluatorProgramModal = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [evaluatorRequest, setEvaluatorRequest] = useState({
		coordinator: null,
		role: null,
	});

	const { data: dataUsers } = useReadUsers(
		{},
		{
			enabled: open,
		}
	);

	const { data: dataAdmissionEvaluators, refetch: fetchAdmissionEvaluators } =
		useReadAdmissionEvaluators({ program_id: data.id }, { enabled: open });

	const coordinatorOptions = dataUsers?.results
		?.filter(
			(c) =>
				c?.is_active === true &&
				Array.isArray(c?.roles) &&
				c.roles.some((role) => role?.name === 'Docente')
		)
		?.map((c) => ({
			value: c.id.toString(),
			label: c.full_name,
		}));
	const roleOptions = [
		{ label: 'Ensayo', value: '1' },
		{ label: 'Examen', value: '2' },
		{ label: 'Entrevista personal', value: '3' },
	];
	const getRoleInfo = (roleValue) => {
		const roles = {
			1: {
				label: 'Ensayo',
				color: 'bg-blue-100 text-blue-800 border-blue-300',
				icon: FiMessageSquare,
			},
			2: {
				label: 'Examen',
				color: 'bg-green-100 text-green-800 border-green-300',
				icon: LuClipboardCheck,
			},
			3: {
				label: 'Entrevista Personal',
				color: 'bg-purple-100 text-purple-800 border-purple-300',
				icon: FiUsers,
			},
		};
		return (
			roles[roleValue] || {
				label: 'Desconocido',
				color: 'bg-gray-100 text-gray-800 border-gray-300',
				icon: FiEye,
			}
		);
	};

	const evaluatorsAssigned = dataAdmissionEvaluators?.results;

	const { mutateAsync: assignEvaluator, isPending: isSaving } =
		useCreateAdmissionEvaluator();
	const { mutateAsync: updateAssignment } = useUpdateAdmissionEvaluator();
	const { mutate: deleteAssignment } = useDeleteAdmissionEvaluator();

	const handleResetForm = () => {
		setEvaluatorRequest({
			coordinator: null,
			role: null,
		});
		setEditingId(null);
	};

	const handleSubmit = async () => {
		if (!evaluatorRequest.coordinator || !evaluatorRequest.role) {
			toaster.create({
				title: 'Completa todos los campos obligatorios',
				type: 'warning',
			});
			return;
		}

		const payload = {
			admission_program: data.id,
			evaluator: Number(evaluatorRequest.coordinator.value),
			role: Number(evaluatorRequest.role.value),
		};

		const onSuccess = () => {
			toaster.create({
				title: editingId ? 'Asignación actualizada' : 'Asignación creada',
				type: 'success',
			});
			handleResetForm();
			fetchAdmissionEvaluators();
			fetchData();
		};

		const onError = (error) => {
			toaster.create({
				title: error.response?.data?.[0] || 'Error en la asignación',
				type: 'error',
			});
		};

		if (editingId) {
			updateAssignment({ id: editingId, payload }, { onSuccess, onError });
		} else {
			assignEvaluator(payload, { onSuccess, onError });
		}
	};

	const handleDelete = (id) => {
		deleteAssignment(id, {
			onSuccess: () => {
				toaster.create({ title: 'Asignación eliminada', type: 'info' });
				handleResetForm();
				fetchAdmissionEvaluators();
				fetchData();
			},
			onError: (error) => {
				toaster.create({
					title: error.response?.data?.[0] || 'Error al eliminar',
					type: 'error',
				});
			},
		});
	};

	const roleStats =
		evaluatorsAssigned?.reduce((acc, evaluator) => {
			const roleInfo = getRoleInfo(evaluator.role);
			acc[roleInfo.label] = (acc[roleInfo.label] || 0) + 1;
			return acc;
		}, {}) || {};

	return (
		<Modal
			title='Asignar/Quitar Evaluadores'
			placement='center'
			trigger={
				<Box>
					<Tooltip
						content='Asignar Evaluador'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='orange' size='xs'>
							<FiCheckSquare />
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
					<Card.Header>
						<Card.Title display='flex' alignItems='center' gap={2}>
							<FiPlus className='h-5 w-5' color='orange' />
							Asignar Nuevo Evaluador
						</Card.Title>
					</Card.Header>

					<Card.Body>
						<Grid
							templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
							gap={4}
							alignItems='end'
						>
							{/* Evaluador */}
							<Field label='Evaluador'>
								<ReactSelect
									options={coordinatorOptions}
									value={evaluatorRequest.coordinator}
									onChange={(value) =>
										setEvaluatorRequest((prev) => ({
											...prev,
											coordinator: value,
										}))
									}
								/>
							</Field>
							<Field label='Rol del evaluador'>
								<ReactSelect
									options={roleOptions}
									value={evaluatorRequest.role}
									onChange={(value) =>
										setEvaluatorRequest((prev) => ({ ...prev, role: value }))
									}
								/>
							</Field>

							{/* Botón de Asignar */}
							<Button
								onClick={handleSubmit}
								disabled={
									!evaluatorRequest.coordinator ||
									!evaluatorRequest.role ||
									data.status === 4
								}
								colorPalette='orange'
								loading={isSaving}
								loadingText='Asignando...'
							>
								<FiPlus className='h-4 w-4' /> Asignar
							</Button>
						</Grid>
					</Card.Body>
				</Card.Root>
				{Object.keys(roleStats).length > 0 && (
					<Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
						{Object.entries(roleStats).map(([roleType, count]) => {
							const roleOption = roleOptions.find((r) => r.label === roleType);
							const roleInfo = getRoleInfo(
								roleOption?.value ? Number(roleOption.value) : 1
							);
							const RoleIcon = roleInfo.icon;

							return (
								<Card.Root key={roleType} textAlign='center'>
									<Card.Body pt={4}>
										<Flex justify='center' mb={2}>
											<RoleIcon className='h-6 w-6' color='orange' />
										</Flex>
										<Text fontSize='2xl' fontWeight='bold' color='orange.600'>
											{count}
										</Text>
										<Text fontSize='sm' color='gray.600'>
											{roleType}
										</Text>
									</Card.Body>
								</Card.Root>
							);
						})}
					</Grid>
				)}

				<Card.Root>
					<Card.Header>
						<Card.Title>
							<Flex align='center' justify='space-between' gap={2}>
								<Flex align='center' gap={2}>
									<FiUserCheck className='h-5 w-5 text-green-600' />
									<Text fontWeight='medium'>Evaluadores Asignados</Text>
									<Badge
										variant='outline'
										bg='green.50'
										color='green.700'
										borderColor='green.200'
									>
										{evaluatorsAssigned?.length || 0} evaluadores
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
									<Table.ColumnHeader>Evaluador</Table.ColumnHeader>
									<Table.ColumnHeader>Tipo de Evaluación</Table.ColumnHeader>
									<Table.ColumnHeader>Acciones</Table.ColumnHeader>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{evaluatorsAssigned?.map((item, index) => (
									<Table.Row
										key={item.id}
										bg={{ base: 'white', _dark: 'its.gray.500' }}
									>
										<Table.Cell>{index + 1}</Table.Cell>
										<Table.Cell>
											{item.evaluator_display || item.evaluator}
										</Table.Cell>
										<Table.Cell>
											{roleOptions.find(
												(opt) => opt.value === String(item.role)
											)?.label || item.role}
										</Table.Cell>

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
								{evaluatorsAssigned?.length === 0 && (
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
				{evaluatorsAssigned && evaluatorsAssigned.length > 0 && (
					<Card.Root
						bgGradient='linear(to-r, orange.50, yellow.50)'
						border='1px solid'
						borderColor='orange.200'
					>
						<Card.Body pt={6}>
							<SimpleGrid
								columns={{ base: 1, md: 3 }}
								gap={4}
								textAlign='center'
							>
								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='orange.600'>
										{evaluatorsAssigned.length}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Total Evaluadores
									</Text>
								</Box>

								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='green.600'>
										{Object.keys(roleStats).length}
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Tipos de Evaluación
									</Text>
								</Box>

								<Box>
									<Text fontSize='2xl' fontWeight='bold' color='blue.600'>
										{Math.min(
											100,
											Math.round(
												(Object.keys(roleStats).length / roleOptions.length) *
													100
											)
										)}
										%
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Cobertura
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

AssignEvaluatorProgramModal.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};
