import { ReactSelect } from '@/components/select';
import { Field, Radio, RadioGroup, toaster } from '@/components/ui';
import { useUpdatePerson } from '@/hooks';
import { useReadDisabilities } from '@/hooks/disabilities';
import { useReadUbigeos } from '@/hooks/ubigeos';
import { uploadToS3 } from '@/utils/uploadToS3';
import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Input,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

export const PersonalDataApplicants = ({ data, loading, fetchUser }) => {
	const { mutate: update } = useUpdatePerson();
	const [loadingUpdate, setloadingUpdate] = useState(false);
	const [filePDF, setFilePDF] = useState(null);
	const { data: dataUbigeo, isLoading: loadingUbigeo } = useReadUbigeos();
	const { data: dataDisabilities, isLoading: loadingDisabilities } =
		useReadDisabilities();
	const [isUni, setIsUni] = useState(false);
	const [isDisable, setIsDisable] = useState(false);

	const [formData, setFormData] = useState({
		id: '',
		birth_ubigeo: null,
		address_ubigeo: null,
		uni_email: '',
		is_uni_graduate: false,
		uni_code: '',
		has_disability: '',
		type_disability: '',
		other_disability: '',
		license_number: '',
		orcid_code: '',
		document_path: '',
	});

	useEffect(() => {
		if (!loading && data) {
			setFormData(data);
		}
	}, [data, loading]);

	const updateProfileField = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const UbigeosOptions =
		dataUbigeo?.results?.map((ubigeo) => ({
			value: ubigeo.id,
			label: ubigeo.code,
		})) || [];

	const DiscapacityOptions =
		dataDisabilities?.results?.map((disability) => ({
			value: disability.id,
			label: disability.name,
		})) || [];

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setloadingUpdate(true);
		let pathDocUrl = formData?.document_path;

		// Solo subir a S3 si hay un archivo nuevo
		if (formData?.document_path instanceof File) {
			pathDocUrl = await uploadToS3(
				formData.document_path,
				'sga_uni/studentdoc',
				formData.first_name?.replace(/\s+/g, '_') || 'cv'
			);
		}

		const payload = {
			birth_ubigeo: formData.birth_ubigeo?.value,
			address_ubigeo: formData.address_ubigeo?.value,
			uni_email: formData.uni_email,
			is_uni_graduate: formData.is_uni_graduate,
			uni_code: formData.uni_code,
			has_disability: formData.has_disability,
			type_disability: formData.type_disability,
			other_disability: formData.other_disability,
			license_number: formData.license_number,
			orcid_code: formData.orcid_code,
			document_path: pathDocUrl,
		};

		update(
			{ id: formData.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Perfil actualizado correctamente.',
						type: 'success',
					});
					setloadingUpdate(false);
					fetchUser();
				},
				onError: (error) => {
					const errorData = error.response?.data;
					setloadingUpdate(false);
					if (errorData && typeof errorData === 'object') {
						Object.values(errorData).forEach((errorList) => {
							if (Array.isArray(errorList)) {
								errorList.forEach((message) => {
									toaster.create({
										title: message,
										type: 'error',
									});
								});
							}
						});
					} else {
						setloadingUpdate(false);
						toaster.create({
							title: 'Error al registrar el Programa',
							type: 'error',
						});
					}
				},
			}
		);
	};

	const preloadSelectValue = (data, profileValue, options, fieldName) => {
		if (data && profileValue && typeof profileValue === 'number') {
			const selected = options.find((opt) => opt.value === profileValue);
			if (selected) updateProfileField(fieldName, selected);
		}
	};

	useEffect(() => {
		preloadSelectValue(
			dataUbigeo,
			data?.birth_ubigeo,
			UbigeosOptions,
			'birth_ubigeo'
		);
	}, [dataUbigeo, data]);

	useEffect(() => {
		preloadSelectValue(
			dataUbigeo,
			data?.address_ubigeo,
			UbigeosOptions,
			'address_ubigeo'
		);
	}, [dataUbigeo, data]);

	return (
		<Box
			bg={{ base: 'white', _dark: 'its.gray.500' }}
			p='4'
			borderRadius='10px'
			overflow='hidden'
			boxShadow='md'
		>
			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
				mb={5}
			>
				<Heading
					size={{
						xs: 'xs',
						sm: 'sm',
						md: 'md',
					}}
					color={'gray.500'}
				>
					Inscripción: Datos Generales
				</Heading>
			</Stack>
			<Text fontWeight='semibold' color={'uni.secondary'} mb={2}>
				1. Subir foto de documento:
			</Text>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
				{!formData?.document_path || formData?.document_path === '' ? (
					<Field label='Archivo'>
						<Box
							as='label'
							htmlFor='pdf-upload'
							borderWidth='2px'
							borderStyle='dashed'
							borderColor={'uni.secondary'}
							borderRadius='lg'
							bg='gray.50'
							_hover={{
								borderColor: 'uni.secondary',
								bg: 'gray.10',
							}}
							p={4}
							w='100%'
							cursor='pointer'
							textAlign='center'
						>
							<Flex direction='column' align='center' justify='center' gap={2}>
								<Icon as={FiUploadCloud} boxSize={6} color='teal.400' />
								<Text fontSize='sm' color='gray.600'>
									{filePDF
										? filePDF.name
										: 'Haz clic para subir un archivo PDF'}
								</Text>
								<Input
									id='pdf-upload'
									type='file'
									accept='application/pdf'
									hidden
									onChange={(e) => {
										const file = e.target.files[0];
										if (file?.type === 'application/pdf') {
											setFilePDF(file);
											updateProfileField('document_path', file);
										} else {
											toaster.create({
												title: 'Solo se permiten archivos PDF.',
												type: 'error',
											});
										}
									}}
								/>
							</Flex>
						</Box>
					</Field>
				) : (
					<Flex gap={2} justify='flex-start'>
						<Button
							size='xs'
							colorScheme='blue'
							as='a'
							href={formData?.document_path}
							target='_blank'
							rel='noopener noreferrer'
						>
							Ver documento
						</Button>
						<Button
							size='xs'
							colorScheme='red'
							onClick={() => {
								setFilePDF(null);
								updateProfileField('document_path', '');
								setFormData((prev) => ({
									...prev,
									document_path: '',
								}));
							}}
						>
							Quitar documento
						</Button>
					</Flex>
				)}
			</SimpleGrid>

			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={4}>
				<Box>
					<Text fontWeight='semibold' color={'uni.secondary'} mb={2}>
						2. Ubigeo Nacimiento:
					</Text>
					<ReactSelect
						label='Ubigeo Nacimiento'
						options={UbigeosOptions}
						value={formData.birth_ubigeo}
						onChange={(value) => updateProfileField('birth_ubigeo', value)}
						isLoading={loadingUbigeo}
						isClearable={true}
						placeholder='Seleccione Ubigeo'
					/>
				</Box>
				<Box>
					{' '}
					<Text fontWeight='semibold' color={'uni.secondary'} mb={2}>
						3. Ubigeo Domicilio:
					</Text>
					<ReactSelect
						label='Ubigeo Domicilio'
						options={UbigeosOptions}
						value={formData.address_ubigeo}
						onChange={(value) => updateProfileField('address_ubigeo', value)}
						isLoading={loadingUbigeo}
						isClearable={true}
						placeholder='Seleccione Ubigeo'
					/>
				</Box>
			</SimpleGrid>
			<Text fontWeight='semibold' color={'uni.secondary'} mt={4}>
				4. Datos Institucionales:
			</Text>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={4}>
				<Field label='¿Egresado UNI?'>
					<RadioGroup
						value={isUni ? 'yes' : 'no'}
						onChange={(e) => {
							const selected = e.target.value === 'yes';
							setIsUni(e.target.defaultValue === 'yes');
							updateProfileField('is_uni_graduate', selected);
						}}
						direction='row'
						spaceX={4}
					>
						<Radio value='yes'>Sí</Radio>
						<Radio value='no'>No</Radio>
					</RadioGroup>
				</Field>
				{formData.is_uni_graduate && (
					<>
						<Field label='Correo Institucional'>
							<Input
								type='text'
								value={formData.uni_email || ''}
								onChange={(e) =>
									updateProfileField('uni_email', e.target.value)
								}
								variant='flushed'
								placeholder='Ingrese correo Institucional'
							/>
						</Field>
						<Field label='Código UNI'>
							<Input
								type='text'
								value={formData.uni_code || ''}
								onChange={(e) => updateProfileField('uni_code', e.target.value)}
								variant='flushed'
								placeholder='Ingrese código universitario'
							/>
						</Field>
					</>
				)}
			</SimpleGrid>
			<Text fontWeight='semibold' color={'uni.secondary'} mt={4}>
				5. Otros Datos:
			</Text>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={4}>
				<Field label='¿Tiene alguna discapacidad?'>
					<RadioGroup
						value={isDisable ? 'yes' : 'no'}
						onChange={(e) => {
							const selected = e.target.value === 'yes';
							setIsDisable(e.target.defaultValue === 'yes');
							updateProfileField('has_disability', selected);
						}}
						direction='row'
						spaceX={4}
					>
						<Radio value='yes'>Sí</Radio>
						<Radio value='no'>No</Radio>
					</RadioGroup>
				</Field>
				{formData.has_disability && (
					<>
						<Field label='Tipo de Discapacidad'>
							<ReactSelect
								label='Discapacidad'
								options={DiscapacityOptions}
								value={data.type_disability}
								isLoading={loadingDisabilities}
								onChange={(value) =>
									updateProfileField('type_disability', value)
								}
								isClearable={true}
								placeholder='Seleccione Discapacidad'
							/>
						</Field>
						<Field label='Otros:'>
							<Input
								type='text'
								value={formData.other_disability || ''}
								onChange={(e) =>
									updateProfileField('other_disability', e.target.value)
								}
								variant='flushed'
								placeholder='Otros ...'
							/>
						</Field>
					</>
				)}
			</SimpleGrid>
			<Text fontWeight='semibold' color={'uni.secondary'} mt={6}>
				6. Numero de colegiatura:
			</Text>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={4}>
				<Input
					type='text'
					value={formData.license_number || ''}
					onChange={(e) => updateProfileField('license_number', e.target.value)}
					variant='flushed'
					placeholder='Ingresar número (Opcional'
				/>
			</SimpleGrid>

			<Flex justify='flex-end' mt={6}>
				<Button
					bg={'uni.secondary'}
					disabled={!formData.document_path || loadingUpdate}
					loading={loadingUpdate}
					onClick={handleUpdateProfile}
				>
					Guardar cambios
				</Button>
			</Flex>
		</Box>
	);
};

PersonalDataApplicants.propTypes = {
	data: PropTypes.object,
	loading: PropTypes.bool,
	fetchUser: PropTypes.func,
};
