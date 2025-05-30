import { useState, useEffect } from 'react';
import { toaster } from '@/components/ui';
import { Box, Heading, VStack } from '@chakra-ui/react';
import { useChangePassword } from '@/hooks/auth';
import { useReadUsers, useUpdateUser } from '@/hooks/users';
import { ChangePasswordForm } from '@/components/forms/acount/ChangePasswordForm';
import { ChangeDataProfileForm } from '@/components/forms/acount/ChangeDataProfileForm';
import { ChangeProfileControl } from '@/components/forms/acount/ChangeProfileControl';

export const AccountProfile = () => {
	//const user = getUser();

	const user = {
		sub: 'user123',
		username: 'Juan Pérez',
		email: 'juan.perez@example.com',
		phone_number: '+1 234 567 890',
		country: { name: 'España', id: 1 },
		roles: [{ name: 'Administrador' }, { name: 'Usuario' }],
		color: '#FF5733', // Color personalizado
	};
	const { update, loading: loadingUpdate } = useUpdateUser();
	const { changePassword, loading: loadingPassword } = useChangePassword();
	const { data: dataUsers, fetchUsers, loading: loadingRead } = useReadUsers();

	const userInfo = dataUsers.find((u) => u.id === user.sub) || {};

	// Estado el perfil del usuario
	const [profile, setProfile] = useState({
		fullname: user.username,
		email: user.email,
		phoneNumber: user.phone_number,
		country: { label: '', value: 0 },
		roles: user.roles || [],
		color: user.color || '#F2F2F2',
		numDoc: '',
		status: null,
		password: '',
		uniEmail: '',
		pathCv: '',
		pathGrade: '',
		category: '',
		pathContract: '',
		contractExpiresAt: null,
		createdAt: null,
		updatedAt: null,
		userId: user.id,
	});

	// Estados para el cambio de contraseña
	const [passwords, setPasswords] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [isOpen, setIsOpen] = useState(false);

	// Función para manejar el cambio de datos del perfil
	const [isChangesMade, setIsChangesMade] = useState(false);
	const [initialProfile, setInitialProfile] = useState(null);

	useEffect(() => {
		// se comenta el userInfo al no tener la API
		if (!loadingRead /*&& Object.keys(userInfo).length > 0*/) {
			const updatedProfile = {
				...profile,
				numDoc: '12345678',
				status: true,
				password: '123456',
				uniEmail: 'juan.perez01@uni.edu.pe',
				pathCv: 'https://sgauni.sources.com/path/to/cv.pdf',
				pathGrade: '/path/to/grade.pdf',
				category: 'example-category',
				pathContract: '/path/to/contract.pdf',
				contractExpiresAt: new Date('2024-12-31'),
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: user.id,
			};
			setProfile(updatedProfile);
			setInitialProfile(updatedProfile);
		}
	}, [loadingRead]);

	//Si hay cambios en el perfil, actualiza el estado y activar el botón de guardar
	useEffect(() => {
		if (!initialProfile) return;

		const hasChanges =
			JSON.stringify(profile) !== JSON.stringify(initialProfile);
		setIsChangesMade(hasChanges);
	}, [profile, initialProfile]);

	// Función para actualizar un campo específico del perfil
	const updateProfileField = (field, value) => {
		setIsChangesMade(true);
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	// Función para actualizar un campo de contraseña
	const updatePasswordField = (field, value) => {
		setPasswords((prev) => ({ ...prev, [field]: value }));
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		const payload = {
			fullname: profile.fullname,
			email: profile.email,
			country_id: profile.country.value,
			phone_number: profile.phoneNumber,
			num_doc: profile.numDoc,
		};

		try {
			//await update(payload, userInfo.id);
			// Simulación de actualización del perfil
			setInitialProfile(profile);
			setIsChangesMade(false);
			toaster.create({
				title: 'Perfil actualizado correctamente.',
				type: 'success',
			});
			fetchUsers();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	const handleChangePassword = async () => {
		if (passwords.newPassword !== passwords.confirmPassword) {
			toaster.create({
				title: 'Las contraseñas no coinciden',
				type: 'error',
			});
			return;
		}

		const payload = {
			user_id: user.id,
			current_password: passwords.currentPassword,
			new_password: passwords.newPassword,
		};

		try {
			//await changePassword(payload);
			// Simulación de cambio de contraseña
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una llamada a la API
			if (passwords.currentPassword !== profile.password) {
				throw new Error('La contraseña actual es incorrecta.');
			}

			// Actualizar el perfil con la nueva contraseña
			updateProfileField('password', passwords.newPassword);

			toaster.create({
				title: 'Contraseña actualizada',
				type: 'success',
			});
			setIsOpen(false);
			setPasswords({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	return (
		<Box spaceY='5'>
			<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>
				Propiedades de cuenta
			</Heading>

			<VStack
				bg={{ base: 'white', _dark: 'uni.gray.500' }}
				p='6'
				align='start'
				borderRadius='10px'
				overflow='hidden'
				boxShadow='md'
				gap='6'
			>
				<ChangeProfileControl
					profile={profile}
					isChangesMade={isChangesMade}
					handleUpdateProfile={handleUpdateProfile}
					loadingUpdate={loadingUpdate}
				/>

				<ChangeDataProfileForm
					user={user}
					profile={profile}
					updateProfileField={updateProfileField}
				/>

				<ChangePasswordForm
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					handleChangePassword={handleChangePassword}
					loadingPassword={loadingPassword}
					passwords={passwords}
					updatePasswordField={updatePasswordField}
				/>
			</VStack>
		</Box>
	);
};
