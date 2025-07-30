import { useState, useEffect } from 'react';
import { toaster } from '@/components/ui';
import { Box, Heading, Text } from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router';
import { useUpdateProfile } from '@/hooks/users';
import { ChangeDataProfileForm } from '@/components/forms/acount/ChangeDataProfileForm';
import { ChangeProfileControl } from '@/components/forms/acount/ChangeProfileControl';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { uploadToS3 } from '@/utils/uploadToS3';

export const AccountProfile = () => {
	const { data: dataUser, isLoading, error, refetch } = useReadUserLogged();

	const [disableUpload, setDisableUpload] = useState(false);

	const { mutateAsync: updateProfile, loading: loadingProfile } =
		useUpdateProfile();

	const [errors, setErrors] = useState({});

	const [profile, setProfile] = useState({
		id: '',
		user: {
			id: '',
			username: '',
			first_name: '',
			last_name: '',
			password: '',
		},
		full_name: '',
		num_doc: '',
		uni_email: '',
		path_cv: '',
		path_grade: '',
		category: '',
		phone: '',
		roles: [],
		// para el icono
		first_name: '',
		last_name: '',
	});

	const validate = () => {
		const newErrors = {};
		if (!profile.first_name) newErrors.first_name = 'El nombre es obligatorio';
		if (!profile.last_name) newErrors.last_name = 'El apellido es obligatorio';
		if (!profile.num_doc)
			newErrors.num_doc = 'El número de documento es obligatorio';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const [isChangesMade, setIsChangesMade] = useState(false);
	const [initialProfile, setInitialProfile] = useState(null);

	useEffect(() => {
		if (!isLoading && dataUser) {
			const updatedProfile = {
				first_name: dataUser.user.first_name,
				last_name: dataUser.user.last_name,
				user: {
					username: dataUser.user.username,
					...dataUser.user,
				},
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

	const handleUpdateProfile = async (e) => {
		if (!validate()) {
			toaster.create({
				title: 'Por favor, completa todos los campos obligatorios.',
				description: errors,
				type: 'error',
			});
			return;
		}

		e.preventDefault();
		setDisableUpload(true);
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
				is_active: true,
				password: profile.password,
			},
			num_doc: profile.num_doc,
			uni_email: profile.uni_email,
			path_cv: pathCvUrl,
			path_grade: pathGradeUrl,
			category: profile.category,
			phone: profile.phone,
		};

		updateProfile(payload, {
			onSuccess: () => {
				setInitialProfile(profile);
				setIsChangesMade(false);
				toaster.create({
					title: 'Perfil actualizado correctamente.',
					type: 'success',
				});
				refetch();
				setDisableUpload(false);
			},
			onError: (error) => {
				setDisableUpload(false);
				toaster.create({ title: error.message, type: 'error' });
			},
		});
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
				<>
					<ChangeProfileControl
						profile={profile}
						isChangesMade={isChangesMade}
						handleUpdateProfile={handleUpdateProfile}
						loadingUpdate={loadingProfile}
						disableUpload={disableUpload}
					/>

					<ChangeDataProfileForm
						errors={errors}
						profile={profile}
						updateProfileField={updateProfileField}
					/>

					{/*<ChangePasswordForm
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						handleChangePassword={handleChangePassword}
						loadingPassword={loadingPassword}
						passwords={passwords}
						updatePasswordField={updatePasswordField}
					/>*/}
				</>
			)}
		</Box>
	);
};
