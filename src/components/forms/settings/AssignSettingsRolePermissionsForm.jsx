import PropTypes from 'prop-types';
import { Checkbox, Modal, toaster, Tooltip } from '@/components/ui';
import {
	CheckboxGroup,
	Fieldset,
	Grid,
	Separator,
	Stack,
	VStack,
	Flex,
	IconButton,
	Spinner,
	Box,
} from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { useAssignPermission, useReadPermissionHasRole } from '@/hooks';

export const AssignSettingsRolePermissionsForm = ({
	data,
	fetchData,
	dataPermissions,
}) => {
	const contentRef = useRef();
	const roleId = data?.id;
	const [open, setOpen] = useState(false);
	const { data: permissionsInRole, isLoading: loadingAssigned } =
		useReadPermissionHasRole(roleId, {}, { enabled: open && !!roleId });
	const { mutateAsync: assignPermissionsBulk, isPending: isSaving } =
		useAssignPermission();

	const [selectedPermissions, setSelectedPermissions] = useState([]);

	// Cargar permisos actuales al abrir modal
	useEffect(() => {
		if (permissionsInRole) {
			const assigned = permissionsInRole?.map((p) => p.id);
			setSelectedPermissions(assigned);
		}
	}, [permissionsInRole]);

	const handlePermissionToggle = (id) => {
		setSelectedPermissions((prev) =>
			prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
		);
	};

	const handleSavePermissions = async () => {
		try {
			await assignPermissionsBulk({
				role_id: roleId,
				permission_ids: selectedPermissions,
			});
			toaster.create({
				title: 'Permisos actualizados correctamente',
				type: 'success',
			});
			fetchData();
			setOpen(false);
		} catch (error) {
			toaster.create({
				title: error?.message || 'Error al actualizar permisos',
				type: 'error',
			});
		}
	};

	// Agrupar permisos
	const groupedPermissions = dataPermissions?.reduce((acc, permission) => {
		const [category, subcategory] = permission.guard_name.split('.');
		if (!acc[category]) acc[category] = {};
		if (!acc[category][subcategory]) acc[category][subcategory] = [];
		acc[category][subcategory].push(permission);
		return acc;
	}, {});

	return (
		<Modal
			title='Asignar permisos'
			placement='center'
			size='4xl'
			trigger={
				<Box>
					<Tooltip
						content='Asignar permiso'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='green' size='xs'>
							<FiCheckSquare />
						</IconButton>
					</Tooltip>
				</Box>
			}
			contentRef={contentRef}
			onSave={handleSavePermissions}
			loading={isSaving}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
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
				{loadingAssigned ? (
					<Flex justify='center' align='center' minH='200px'>
						<Spinner size='xl' />
					</Flex>
				) : (
					groupedPermissions &&
					Object.entries(groupedPermissions).map(
						([category, subcategories], idx) => (
							<Stack key={category} gap={4}>
								<Fieldset.Root>
									<Fieldset.Legend
										fontSize='md'
										textTransform='capitalize'
										color={{ base: 'its.primary', _dark: 'its.secondary' }}
									>
										{groupTitles.category[category] || category}
									</Fieldset.Legend>

									<Grid
										w='full'
										templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
										gap={4}
									>
										{Object.entries(subcategories).map(
											([subcategory, perms]) => (
												<VStack key={subcategory} align='start' gap='4'>
													<Fieldset.Legend
														fontSize='sm'
														textTransform='capitalize'
													>
														{groupTitles.subCategory[subcategory] ||
															subcategory}
													</Fieldset.Legend>
													<CheckboxGroup>
														{perms.map((permission) => (
															<Checkbox
																key={permission.id}
																defaultValue={permission.id}
																checked={
																	Array.isArray(selectedPermissions) &&
																	selectedPermissions.includes(permission.id)
																}
																onChange={() =>
																	handlePermissionToggle(permission.id)
																}
															>
																{permission.name}
															</Checkbox>
														))}
													</CheckboxGroup>
												</VStack>
											)
										)}
									</Grid>
								</Fieldset.Root>
								{idx < Object.keys(groupedPermissions).length - 1 && (
									<Separator mb={4} />
								)}
							</Stack>
						)
					)
				)}
			</Stack>
		</Modal>
	);
};

AssignSettingsRolePermissionsForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
	dataPermissions: PropTypes.array,
};

const groupTitles = {
	category: {
		panel: 'Panel de Control',
		settings: 'Configuración',
		users: 'Usuarios',
		admissions: 'Admisiones',
		contracts: 'Contratos',
		tuition: 'Matrícula',
		enrollments: 'Matriculas',
		applicants: 'Postulantes',
		payment: 'Pagos y deudas',
		commitment: 'Fraccionamientos',
		courses: 'Cursos',
		
	},
	subCategory: {
		program: 'Programas',
		coord: 'Coordinador Académico',
		admin: 'Administrador',
		users: 'Usuarios',
		modalities: 'Modalidades',
		countries: 'Regiones - Paises',
		proccess: 'Procesos Admisión (P. A.)',
		properties: 'Propiedades de producto',
		list: 'Lista General',
		mylist: 'Lista Personal',
		myprograms: 'Mis Programas de Admisión',
		programs: 'Programas de Admisión ',
		proccessEnrollments: 'Procesos de Matricula (P. M.)',
		myprogramsEnrollments: 'Mis Programas de Matricula',
		evaluators: 'Evaluaciones',
		studenprofile: 'Perfil de Estudiante',
		myapplicants: 'Mis Postulaciones',
		applicants: 'Postulantes',
		applicant: 'Postulante',
		debt: 'Cobranzas',
		adminprofile: 'Perfil de Administrador',
		student: 'Postulante/Estudiante/Egresado',
		orders: 'Órdenes de Pago',
		vouchers: 'Comprobantes de Pago',
		requests: 'Solicitudes de Pago',
		commitment: 'Fraccionamientos',
		letters: 'Cartas de Compromiso',
		schedules: 'Cursos',
		mypaymentsdebts: 'Mis Pagos y Deudas',
	},
};
