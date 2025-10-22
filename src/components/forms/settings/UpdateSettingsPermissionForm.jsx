import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Field, Modal, toaster } from '@/components/ui';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdatePermission } from '@/hooks/permissions';

export const UpdateSettingsPermissionForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(data?.name);
	const [guardName, setGuardName] = useState(data?.guard_name);

	const { mutateAsync: update, loading } = useUpdatePermission();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name,
			guard_name: guardName,
			id: data.id
		};

		try {
			await update(payload);
			toaster.create({
				title: 'Permiso editado correctamente',
				type: 'success',
			});
			setOpen(false);
			fetchData();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Modal
			title='Editar propiedades'
			placement='center'
			trigger={
				<IconButton colorPalette='cyan' size='xs'>
					<FiEdit2 />
				</IconButton>
			}
			onSave={handleSubmitData}
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Nombre del permiso:'
				>
					<Input
						value={name}
						onChange={(event) => setName(event.target.value)}
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Permiso:'
				>
					<Input
						value={guardName}
						onChange={(event) => setGuardName(event.target.value)}
						size='xs'
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateSettingsPermissionForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};
