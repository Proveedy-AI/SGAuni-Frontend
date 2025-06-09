import { useState, useEffect } from 'react';
import { toaster } from '@/components/ui';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router';
import { useChangePassword } from '@/hooks/auth';
import { useReadUsers, useUpdateUser } from '@/hooks/users';
import { ChangePasswordForm } from '@/components/forms/acount/ChangePasswordForm';
import { ChangeDataProfileForm } from '@/components/forms/acount/ChangeDataProfileForm';
import { ChangeProfileControl } from '@/components/forms/acount/ChangeProfileControl';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { uploadToS3 } from '@/utils/uploadToS3';

export const AccountProfile = () => {
	const { data: dataUser, isLoading, error } = useReadUserLogged();
	const { mutate: update, loading: loadingUpdate } = useUpdateUser();
	const { changePassword, loading: loadingPassword } = useChangePassword();
	const { data: dataUsers, refetch, loading: loadingRead } = useReadUsers();

	const [profile, setProfile] = useState({
		id: '',
		user: {},
		username: '',
		first_name: '',
		last_name: '',
		full_name: '',
		num_doc: '',
		uni_email: '',
		path_cv: '',
		path_grade: '',
		category: '',
		phone: '',
		created_at: null,
		updated_at: null,
		deleted_at: null,
		// Campos no devueltos por la API
		roles: [],
		color: '',
		status: null,
		password: '',
		country: {},
		pathContract: '',
		contractExpiresAt: null,
		userId: '',
	});

	const [passwords, setPasswords] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [isOpen, setIsOpen] = useState(false);
	const [isChangesMade, setIsChangesMade] = useState(false);
	const [initialProfile, setInitialProfile] = useState(null);

	useEffect(() => {
		if (!isLoading && dataUser) {
			const updatedProfile = {
				...dataUser,
			};
			setProfile(updatedProfile);
			setInitialProfile(updatedProfile);
		}
	}, [dataUser, isLoading]);

	useEffect(() => {
		if (!initialProfile) return;
		const hasChanges =
			JSON.stringify(profile) !== JSON.stringify(initialProfile);
		setIsChangesMade(hasChanges);
	}, [profile, initialProfile]);

	const updateProfileField = (field, value) => {
		setIsChangesMade(true);
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	const updatePasswordField = (field, value) => {
		setPasswords((prev) => ({ ...prev, [field]: value }));
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		let pathCvUrl = profile?.path_cv;
		let pathGradeUrl = profile?.path_grade;

		// Solo subir a S3 si hay un archivo nuevo
		if (profile?.path_cv instanceof File) {
			pathCvUrl = await uploadToS3(
				profile.path_cv,
				'sga_uni/cvusers',
				profile.first_name?.replace(/\s+/g, '_') || 'cv'
			);
		}

		if (profile?.path_grade instanceof File) {
			pathGradeUrl = await uploadToS3(
				profile.path_grade,
				'sga_uni/gradeusers',
				profile.first_name?.replace(/\s+/g, '_') || 'grado'
			);
		}

		const payload = {
			user: {
				username: profile.username,
				first_name: profile.first_name,
				last_name: profile.last_name,
				is_active: profile.status === null ? true : profile.status, // Por si no viene el campo
				password: profile.password,
			},
			num_doc: profile.num_doc,
			uni_email: profile.uni_email,
			path_cv: pathCvUrl,
			path_grade: pathGradeUrl,
			category: profile.category,
			phone: profile.phoneNumber,
		};

		try {
			update({ id: profile.id, payload });
			setInitialProfile(profile);
			setIsChangesMade(false);
			toaster.create({
				title: 'Perfil actualizado correctamente.',
				type: 'success',
			});
			refetch();
		} catch (error) {
			toaster.create({ title: error.message, type: 'error' });
		}
	};

	const handleChangePassword = async () => {
		if (passwords.newPassword !== passwords.confirmPassword) {
			toaster.create({ title: 'Las contraseñas no coinciden', type: 'error' });
			return;
		}

		const payload = {
			user_id: dataUser?.id,
			current_password: passwords.currentPassword,
			new_password: passwords.newPassword,
		};

		try {
			// problema de las CSRF await changePassword(payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Simulación de validación (no usar en producción)
			if (passwords.currentPassword !== profile.password) {
				throw new Error('La contraseña actual es incorrecta.');
			}

			updateProfileField('password', passwords.newPassword);
			toaster.create({ title: 'Contraseña actualizada', type: 'success' });
			setIsOpen(false);
			setPasswords({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error) {
			toaster.create({ title: error.message, type: 'error' });
		}
	};

	return (
		<Box spaceY='5'>
			<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>
				Propiedades de cuenta
			</Heading>

			{error && (
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					justifyContent='center'
					py={8}
				>
					<Box color='red.500' mb={2}>
						<FiAlertCircle size={24} />
					</Box>
					<Text mb={4} color='red.600' fontWeight='bold'>
						Error al cargar los usuarios: {error.message}
					</Text>
					<Link
						style={{
							background: '#E53E3E',
							color: 'white',
							padding: '8px 16px',
							borderRadius: '4px',
							border: 'none',
							cursor: 'pointer',
						}}
						onClick={() => window.location.reload()}
					>
						Recargar página
					</Link>
				</Box>
			)}

			{isLoading && <Box>Cargando contenido...</Box>}

			{!isLoading && !error && dataUser && (
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
			)}
		</Box>
	);
};
