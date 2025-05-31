import PropTypes from 'prop-types';
import { Checkbox, Modal, toaster } from '@/components/ui';
import {
	CheckboxGroup,
	Fieldset,
	Grid,
	IconButton,
	Separator,
	Stack,
	VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { useReadPermissions } from '@/hooks/permissions';
import { useAssignPermission, useReadPermissionHasRole, useUnassignPermission } from '@/hooks';

export const AssignSettingsRolePermissionsForm = ({ data, fetchData }) => {
	const contentRef = useRef();

	const roleId = data?.id;

	const {
		data: permissionsInRole,
	} = useReadPermissionHasRole(roleId);

	const assignedPermissionIds =
		permissionsInRole?.map((permission) => permission.permission.id) || [];

	const [selectedPermissions, setSelectedPermissions] = useState(
		assignedPermissionIds
	);
	const { mutateAsync: assignPermission } = useAssignPermission();
	const { mutateAsync: unassignPermission } = useUnassignPermission();

	const handleCheckboxChange = async (permissionId, isChecked) => {
		const payload = {
			role_id: data.id,
			permission_id: permissionId, 
		};

		try {
			if (isChecked) {
				await assignPermission(payload);
				toaster.create({
					title: 'Permiso asignado correctamente',
					type: 'success',
				});
				fetchData();

				setSelectedPermissions((prev) => [...prev, permissionId]);
			} else {
				await unassignPermission(payload);
				toaster.create({
					title: 'Permiso quitado correctamente',
					type: 'success',
				});
				fetchData();

				setSelectedPermissions((prev) =>
					prev.filter((id) => id !== permissionId)
				);
			}
		} catch (error) {
			toaster.create({
				title: error.message || 'Error al actualizar el permiso',
				type: 'error',
			});
		}
	};
	const { data: dataPermissions } = useReadPermissions();

	const groupedPermissions = dataPermissions?.results?.reduce((acc, permission) => {
		const [category, subcategory] = permission.guard_name.split('.');

		if (!acc[category]) {
			acc[category] = {};
		}
		if (!acc[category][subcategory]) {
			acc[category][subcategory] = [];
		}
		acc[category][subcategory].push(permission);

		return acc;
	}, {});

	return (
		<Modal
			title='Asignar permisos'
			placement='center'
			size='4xl'
			trigger={
				<IconButton colorPalette='green' size='xs'>
					<FiCheckSquare />
				</IconButton>
			}
			contentRef={contentRef}
			hiddenFooter
		>
			{groupedPermissions &&
				Object?.entries(groupedPermissions)?.map(
					([category, subcategories], idx) => (
						<Stack key={category} gap={4}>
							<Fieldset.Root key={category}>
								<Fieldset.Legend
									fontSize='md'
									textTransform='capitalize'
									color={{
										base: 'its.primary',
										_dark: 'its.secondary',
									}}
								>
									{groupTitles.category[category] || category}
								</Fieldset.Legend>
								<Grid
									w='full'
									templateColumns={{
										base: '1fr',
										md: 'repeat(3, 1fr)',
									}}
									gap={4}
								>
									{Object.entries(subcategories).map(([subcategory, perms]) => (
										<VStack key={subcategory} align='start' gap='4'>
											<Fieldset.Legend fontSize='md' textTransform='capitalize'>
												{groupTitles.subCategory[subcategory] || subcategory}
											</Fieldset.Legend>
											<CheckboxGroup>
												{perms.map((permission) => (
													<Checkbox
														key={permission.id}
														defaultValue={permission.id}
														checked={selectedPermissions.includes(
															permission.id
														)}
														onChange={(e) =>
															handleCheckboxChange(
																permission.id,
																e.target.checked
															)
														}
													>
														{permission.name}
													</Checkbox>
												))}
											</CheckboxGroup>
										</VStack>
									))}
								</Grid>
							</Fieldset.Root>
							{idx < Object.keys(groupedPermissions)?.length - 1 && (
								<Separator mb={4} />
							)}
						</Stack>
					)
				)}
		</Modal>
	);
};

AssignSettingsRolePermissionsForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};

const groupTitles = {
	category: {
		panel: 'Panel de Control',
		settings: 'Configuración',
	},
	subCategory: {
		benefits: 'Beneficios',
		products: 'Productos',
		accreditations: 'Acreditaciones',
		properties: 'Propiedades de producto',
	},
};
