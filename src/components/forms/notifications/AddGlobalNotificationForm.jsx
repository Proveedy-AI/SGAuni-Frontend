import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Modal, Field, toaster } from '@/components/ui';
import {
	HStack,
	Stack,
	VStack,
	Input,
	Textarea,
	RadioGroupItem,
	RadioGroupRoot,
	RadioGroupItemHiddenInput,
	RadioGroupItemIndicator,
	RadioGroupItemText,
} from '@chakra-ui/react';
import { useAuth } from '@/hooks/auth';
import { useCreateGlobalNotification } from '@/hooks/notifications';

export const AddGlobalNotificationForm = ({ fetchData, open, setOpen }) => {
	const contentRef = useRef();
	const { getUser } = useAuth();
	const user = getUser();
	const { register, loading } = useCreateGlobalNotification();

	const [title, setTitle] = useState('');
	const [message, setMessage] = useState('');
	const [role, setRole] = useState('');

	const roleOptions = [
		{ label: 'Todos', value: 'Todos' },
		{ label: 'Asesores', value: 'Asesor' },
		{ label: 'Marketing', value: 'Marketing' },
		{ label: 'Asignadores', value: 'Asignador' },
	];

	const handleCreateGlobalNotification = async (e) => {
		e.preventDefault();

		const payload = {
			title: title,
			message: message,
			create_uid: user.sub,
			role: role,
		};
		try {
			await register(payload);
			toaster.create({
				title: 'Notificación creada correctamente',
				type: 'success',
			});
			setOpen(false);
			fetchData({ user_id: user.sub });
			setTitle('');
			setMessage('');
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Modal
			title='Crear nuevo anuncio'
			subtitle='Envía un anuncio a todos los usuarios'
			placement='center'
			trigger={<></>}
			onSave={handleCreateGlobalNotification}
			saveLabel='Publicar'
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack gap='5'>
				<VStack align='start'>
					<Field fontWeight='semibold'>Título</Field>
					<Input
						placeholder='Agregar título'
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</VStack>
				<VStack align='start'>
					<Field fontWeight='semibold'>Mensaje</Field>
					<Textarea
						placeholder='Agregar una descripción'
						resize='none'
						h='100px'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</VStack>
				<VStack align='start'>
					<Field fontWeight='semibold'>Rol</Field>
					<RadioGroupRoot value={role} onValueChange={(e) => setRole(e.value)}>
						<HStack gap='5'>
							{roleOptions.map((option) => (
								<RadioGroupItem
									key={option.value}
									value={option.value}
									id={option.value}
								>
									<RadioGroupItemHiddenInput />
									<RadioGroupItemIndicator />
									<RadioGroupItemText>{option.label}</RadioGroupItemText>
								</RadioGroupItem>
							))}
						</HStack>
					</RadioGroupRoot>
				</VStack>
			</Stack>
		</Modal>
	);
};

AddGlobalNotificationForm.propTypes = {
	fetchData: PropTypes.func,
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
