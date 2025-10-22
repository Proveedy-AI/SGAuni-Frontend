import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Field, Modal, toaster } from '@/components/ui';
import { useCreatePermission } from '@/hooks/permissions';
import { Button, Input, Stack } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

export const AddSettingsPermissionForm = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState('');
	const [guardName, setGuardName] = useState('');

	const { mutateAsync: register, isPending: loading } = useCreatePermission();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name,
			guard_name: guardName,
		};

		try {
			await register(payload);
			toaster.create({
				title: 'Permiso registrado correctamente',
				type: 'success',
			});
			setOpen(false);
			fetchData();
			setName('');
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Modal
			title='Agregar nuevo permiso'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar permiso
				</Button>
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

AddSettingsPermissionForm.propTypes = {
	fetchData: PropTypes.func,
};
