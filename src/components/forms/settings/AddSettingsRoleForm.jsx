import PropTypes from 'prop-types';
import { useState } from 'react';
import { Field, Modal, toaster } from '@/components/ui';
import { Button, Input, Stack } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useCreateRole } from '@/hooks/roles';

export const AddSettingsRoleForm = ({ fetchData, onRoleCreated }) => {

	const [open, setOpen] = useState(false);

	const [name, setName] = useState('');

	const { mutate: register, isPending: loading } = useCreateRole();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name,
		};

		register(payload, {
			onSuccess: (data) => {
				toaster.create({
					title: 'Rol creado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setName('');
				onRoleCreated?.(data);
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Agregar nuevo rol'
			placement='center'
			// size='lg'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar rol
				</Button>
			}
			onSave={handleSubmitData}
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
		>
			<Stack css={{ '--field-label-width': '120px' }}>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Nombre del rol:'
				>
					<Input
						value={name}
						onChange={(event) => setName(event.target.value)}
						size='xs'
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddSettingsRoleForm.propTypes = {
	fetchData: PropTypes.func,
	onRoleCreated: PropTypes.func,
};
