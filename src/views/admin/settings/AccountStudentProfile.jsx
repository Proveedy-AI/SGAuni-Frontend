import { useState, useEffect } from 'react';
import { toaster } from '@/components/ui';
import { Box, Heading, Text } from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router';
import { ChangeProfileControl } from '@/components/forms/acount/ChangeProfileControl';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { uploadToS3 } from '@/utils/uploadToS3';
import { ChangeDataStudentProfileForm } from '@/components/forms/acount/ChangeDataStudentProfileForm';
import { useUpdateProfile } from '@/hooks/users';
import { useUpdateStudent } from '@/hooks/students';

export const AccountStudentProfile = () => {
	const { data: dataUser, isLoading, error, refetch } = useReadUserLogged();
	const [disableUpload, setDisableUpload] = useState(false);
	const { mutate: update, loading: loadingUpdate } = useUpdateProfile();
	const { mutate: updateStudent, loading: loadingUpdateStudent } =
		useUpdateStudent();

	const [profile, setProfile] = useState({
		id: '',
		user: {},
		username: '',
		student_code: '',
		first_name: '',
		password: '',
		personal_email: '',
		confirmPassword: '',
		paternal_surname: '',
		maternal_surname: '',
		document_type: '',
		document_number: '',
		birth_date: '',
		district: '',
		department: '',
		province: '',
		phone: '',
		nationality: null,
		address: '',
		has_one_surname: false,
		birth_country: null,
		residenceCountry: null,
		gender: null,
		birth_ubigeo: null,
		address_ubigeo: null,
		uni_email: '',
		is_uni_graduate: false,
		uni_code: '',
		has_disability: '',
		type_disability: '',
		other_disability: '',
		license_number: '',
		entrant: '',
		orcid_code: '',
		document_path: '',
		student: {},
	});

	const [isChangesMade, setIsChangesMade] = useState(false);
	const [initialProfile, setInitialProfile] = useState(null);

	useEffect(() => {
		if (!isLoading && dataUser) {
			setProfile(dataUser);
			setInitialProfile(dataUser);
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
		e.preventDefault();

		let pathDocUrl = profile?.document_path;
		setDisableUpload(true);

		// 🔹 Subir archivo a S3 solo si es nuevo
		if (profile?.document_path instanceof File) {
			pathDocUrl = await uploadToS3(
				profile.document_path,
				'sga_uni/studentdoc',
				profile.first_name?.replace(/\s+/g, '_') || 'cv'
			);
		}

		// Payload para PERSONA
		const payload = {
			first_name: profile.first_name,
			paternal_surname: profile.paternal_surname,
			maternal_surname: profile.maternal_surname,
			document_type: profile.document_type,
			document_number: profile.document_number,
			department: profile.department?.value,
			province: profile.province,
			birth_date: profile.birth_date,
			district: profile.district?.value,
			address: profile.address,
			has_one_surname: profile.has_one_surname,
			birth_country: profile.birth_country?.value,
			birth_ubigeo: profile.birth_ubigeo?.value,
			address_ubigeo: profile.address_ubigeo?.value,
			phone: profile.phone,
			nationality: profile.nationality?.value,
			uni_email: profile.uni_email || null,
			is_uni_graduate: profile.is_uni_graduate,
			uni_code: profile.uni_code || null,
			has_disability: profile.has_disability,
			type_disability: profile.type_disability?.value || null,
			other_disability: profile.other_disability,
			license_number: profile.license_number,
			orcid_code: profile.orcid_code,
			document_path: pathDocUrl,
			gender: profile.gender,
			personal_email: profile.personal_email,
			residenceCountry: profile.residenceCountry?.value,
		};

		const userPayload = {};
		if (profile.user.username !== initialProfile.user.username) {
			userPayload.username = profile.user.username;
		}
		if (profile.password) {
			userPayload.password = profile.password;
		}
		if (profile.first_name !== initialProfile.first_name) {
			userPayload.first_name = profile.first_name;
		}

		if (Object.keys(userPayload).length > 0) {
			payload.user = userPayload;
		}

		// 1️⃣ Primero actualiza la persona
		update(payload, {
			onSuccess: () => {
				// 2️⃣ Si cambió el student_code, actualiza estudiante
				if (
					profile?.student?.student_code !==
					initialProfile?.student?.student_code
				) {
					updateStudent(
						{
							id: profile.student.id,
							payload: {
								student_code: profile.student.student_code,
							},
						},
						{
							onSuccess: () => {
								toaster.create({
									title: 'Perfil y código de estudiante actualizados.',
									type: 'success',
								});
							},
							onError: () => {
								toaster.create({
									title: 'Error al actualizar el código de estudiante.',
									type: 'error',
								});
							},
						}
					);
				} else {
					toaster.create({
						title: 'Perfil actualizado correctamente.',
						type: 'success',
					});
				}

				setInitialProfile(profile);
				setIsChangesMade(false);
				setDisableUpload(false);
				refetch();
			},
			onError: (error) => {
				const errorData = error.response?.data;
				setDisableUpload(false);
				if (errorData && typeof errorData === 'object') {
					Object.values(errorData).forEach((errorList) => {
						if (Array.isArray(errorList)) {
							errorList.forEach((message) => {
								toaster.create({ title: message, type: 'error' });
							});
						} else if (typeof errorList === 'object' && errorList !== null) {
							// 👇 volver a recorrer si es un objeto (como "user")
							Object.values(errorList).forEach((nested) => {
								if (Array.isArray(nested)) {
									nested.forEach((message) => {
										toaster.create({ title: message, type: 'error' });
									});
								}
							});
						}
					});
				} else {
					toaster.create({
						title: 'Error al Actualizar el perfil',
						type: 'error',
					});
				}
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
						Error al cargar los datos: {error.message}
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
						loadingUpdate={loadingUpdate || loadingUpdateStudent}
						disableUpload={disableUpload}
					/>

					<ChangeDataStudentProfileForm
						profile={profile}
						updateProfileField={updateProfileField}
						setProfile={setProfile}
					/>
				</>
			)}
		</Box>
	);
};
