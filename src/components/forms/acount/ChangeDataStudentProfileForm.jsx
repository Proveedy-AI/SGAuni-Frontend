import { Box, Grid, Input, Stack, Switch, Text } from '@chakra-ui/react';
import { Field } from '@/components/ui';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import {
	useReadCountries,
	useReadDistrict,
	useReadNacionalities,
} from '@/hooks';
import { useEffect } from 'react';
import { useReadUbigeos } from '@/hooks/ubigeos';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';
import { useReadDisabilities } from '@/hooks/disabilities';

const FieldWithInputText = ({
	placeholder,
	label,
	field,
	value,
	updateProfileField,
}) => {
	return (
		<Field
			orientation={{
				base: 'vertical',
				sm: 'horizontal',
			}}
			label={label}
		>
			<Input
				value={value}
				onChange={(e) => updateProfileField(field, e.target.value)}
				variant='flushed'
				placeholder={placeholder}
				flex='1'
				size='sm'
			/>
		</Field>
	);
};

FieldWithInputText.propTypes = {
	label: PropTypes.string,
	field: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	updateProfileField: PropTypes.func,
	placeholder: PropTypes.string,
};

export const ChangeDataStudentProfileForm = ({
	profile,
	updateProfileField,
}) => {
	const documentTypeOptions = [
		{ value: 1, label: 'DNI' },
		{ value: 2, label: 'Pasaporte' },
		{ value: 3, label: 'Carné de Extranjería' },
		{ value: 4, label: 'Cédula de Identidad' },
	];
	const { data: dataCountries, isLoading: isLoadingCountries } =
		useReadCountries();
	const countryOptions =
		dataCountries?.results?.map((country) => ({
			value: country.id,
			label: country.name,
		})) || [];

	const { data: dataNacionalities, isLoading: loadingNationalities } =
		useReadNacionalities();
	const nationalityOptions =
		dataNacionalities?.results?.map((nationality) => ({
			value: nationality.id,
			label: nationality.name,
		})) || [];

	const { data: dataUbigeo, isLoading: loadingUbigeo } = useReadUbigeos();
	const UbigeosOptions =
		dataUbigeo?.results?.map((ubigeo) => ({
			value: ubigeo.id,
			label: ubigeo.code,
		})) || [];

	const { data: dataDisabilites, isLoading: loadingDisabilites } =
		useReadDisabilities();
	const DisabilitesOptions =
		dataDisabilites?.results?.map((disability) => ({
			value: disability.id,
			label: disability.name,
		})) || [];

	const { data: dataDistrict, isLoading: loadingDisctrict } = useReadDistrict();

	const DistrictOptions =
		dataDistrict?.results?.map((district) => ({
			value: district.id,
			label: district.name,
		})) || [];
	const preloadSelectValue = (data, profileValue, options, fieldName) => {
		if (data && profileValue && typeof profileValue === 'number') {
			const selected = options.find((opt) => opt.value === profileValue);
			if (selected) updateProfileField(fieldName, selected);
		}
	};

	useEffect(() => {
		preloadSelectValue(
			dataCountries,
			profile.country,
			countryOptions,
			'country'
		);
	}, [dataCountries, profile]);

	useEffect(() => {
		preloadSelectValue(
			dataNacionalities,
			profile.nationality,
			nationalityOptions,
			'nationality'
		);
	}, [dataNacionalities, profile]);

	useEffect(() => {
		preloadSelectValue(
			dataUbigeo,
			profile.birth_ubigeo,
			UbigeosOptions,
			'birth_ubigeo'
		);
	}, [dataUbigeo, profile]);

	useEffect(() => {
		preloadSelectValue(
			dataDisabilites,
			profile.type_disability,
			DisabilitesOptions,
			'type_disability'
		);
	}, [dataDisabilites, profile]);

	useEffect(() => {
		preloadSelectValue(
			dataDistrict,
			profile.district,
			DistrictOptions,
			'district'
		);
	}, [dataDistrict, profile]);

	return (
		<>
			<Grid
				w='full'
				templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
				gap='6'
			>
				<Box minW='50%'>
					<Text color='uni.secondary' mb={5}>
						Datos Personales:
					</Text>
					<Stack css={{ '--field-label-width': '140px' }}>
						<FieldWithInputText
							label='Nombres:'
							field='first_name'
							value={profile.first_name}
							updateProfileField={updateProfileField}
						/>

						<Field label='¿Cuenta solo con un apellido?'>
							<Switch.Root
								checked={profile.has_one_surname}
								onCheckedChange={(checked) =>
									updateProfileField('has_one_surname', checked.checked)
								}
								display='flex'
								justifyContent='space-between'
							>
								<Switch.Label>
									{profile.has_one_surname ? 'Sí' : 'No'}
								</Switch.Label>
								<Switch.HiddenInput />
								<Switch.Control
									_checked={{ bg: 'uni.secondary' }}
									bg='uni.gray.400'
								/>
							</Switch.Root>
						</Field>

						<FieldWithInputText
							label='Apelido Paterno:'
							field='paternal_surname'
							value={profile.paternal_surname}
							updateProfileField={updateProfileField}
						/>
						{!profile.has_one_surname && (
							<FieldWithInputText
								label='Apellido Materno:'
								field='maternal_surname'
								value={profile.maternal_surname}
								updateProfileField={updateProfileField}
							/>
						)}
						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Tipo de Documento:'
						>
							<ReactSelect
								options={documentTypeOptions}
								value={documentTypeOptions.find(
									(opt) => opt.value === profile.document_type
								)}
								onChange={(option) =>
									updateProfileField('document_type', option?.value)
								}
								placeholder='Seleccione un tipo de documento'
							/>
						</Field>
						<FieldWithInputText
							label='Num Identidad:'
							field='document_number'
							value={profile.document_number}
							updateProfileField={updateProfileField}
						/>
						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Fecha de nacimiento:'
						>
							<Box w={'full'}>
								<CustomDatePicker
									selectedDate={profile.birth_date ? profile.birth_date : null}
									onDateChange={(date) =>
										updateProfileField('birth_date', format(date, 'yyyy-MM-dd'))
									}
									buttonSize='md'
									size={{ base: '240px', md: '410px' }}
								/>
							</Box>
						</Field>
						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='País de Nacimiento:'
						>
							<ReactSelect
								label='País'
								options={countryOptions}
								value={profile.country}
								onChange={(value) => updateProfileField('country', value)}
								isLoading={isLoadingCountries}
								placeholder='Seleccione un país'
							/>
						</Field>
						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Nacionalidad:'
						>
							<ReactSelect
								label='Nacionalidad'
								options={nationalityOptions}
								value={profile.nationality}
								onChange={(value) => updateProfileField('nationality', value)}
								isLoading={loadingNationalities}
								placeholder='Seleccione una nacionalidad'
							/>
						</Field>
					</Stack>
				</Box>

				<Box minW='50%' mt={10}>
					<Stack css={{ '--field-label-width': '140px' }}>
						<FieldWithInputText
							label='Teléfono:'
							field='phone'
							value={profile.phone}
							updateProfileField={updateProfileField}
						/>

						<FieldWithInputText
							label='Dirección:'
							field='address'
							value={profile.address}
							updateProfileField={updateProfileField}
						/>

						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Ubigeo Nacimiento:'
						>
							<ReactSelect
								label='Ubigeo'
								options={UbigeosOptions}
								value={profile.birth_ubigeo}
								onChange={(value) => updateProfileField('birth_ubigeo', value)}
								isLoading={loadingUbigeo}
								placeholder='Seleccione Ubigeo'
							/>
						</Field>

						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Ubigeo Domicilio:'
						>
							<ReactSelect
								label='Ubigeo Domicilio'
								options={UbigeosOptions}
								value={profile.address_ubigeo}
								onChange={(value) =>
									updateProfileField('address_ubigeo', value)
								}
								isLoading={loadingUbigeo}
								placeholder='Seleccione Ubigeo'
							/>
						</Field>

						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Distrito:'
						>
							<ReactSelect
								label='Distrito'
								options={DistrictOptions}
								value={profile.district}
								onChange={(value) => updateProfileField('district', value)}
								isLoading={loadingDisctrict}
								placeholder='Seleccione Distrito'
							/>
						</Field>
						<FieldWithInputText
							label='Colegiatura:'
							placeholder='Numero de colegiatura'
							field='license_number'
							value={profile.license_number}
							updateProfileField={updateProfileField}
						/>

						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Foto de Documento:'
							mt={4}
						>
							<CompactFileUpload
								name='document_path'
								onChange={(file) => updateProfileField('document_path', file)}
								defaultFile={
									typeof profile.document_path === 'string'
										? profile.document_path
										: undefined
								}
								onClear={() => updateProfileField('document_path', null)}
							/>
						</Field>
					</Stack>
				</Box>
			</Grid>
			<Grid
				w='full'
				templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
				gap='6'
			>
				<Box minW='50%'>
					<Text color='uni.secondary' mb={5}>
						Datos Institucionales:
					</Text>
					<Stack css={{ '--field-label-width': '140px' }}>
						<Field label='¿Eres graduado de la UNI?'>
							<Switch.Root
								checked={profile.is_uni_graduate}
								onCheckedChange={(checked) =>
									updateProfileField('is_uni_graduate', checked.checked)
								}
								display='flex'
								justifyContent='space-between'
							>
								<Switch.Label>
									{profile.is_uni_graduate ? 'Sí' : 'No'}
								</Switch.Label>
								<Switch.HiddenInput />
								<Switch.Control
									_checked={{ bg: 'uni.secondary' }}
									bg='uni.gray.400'
								/>
							</Switch.Root>
						</Field>
						{profile.is_uni_graduate && (
							<FieldWithInputText
								label='Correo institucional:'
								field='uni_email'
								placeholder='Ingresar correo'
								value={profile.uni_email}
								updateProfileField={updateProfileField}
							/>
						)}
					</Stack>
				</Box>
				<Box minW='50%' mt={{ base: 0, md: '24' }}>
					{profile.is_uni_graduate && (
						<FieldWithInputText
							label='Código UNI:'
							field='uni_code'
							placeholder='Ingresar código'
							value={profile.uni_code}
							updateProfileField={updateProfileField}
						/>
					)}
				</Box>
			</Grid>

			<Grid
				w='full'
				templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
				gap='6'
			>
				<Box minW='50%'>
					<Text color='uni.secondary' mb={5}>
						Datos adicionales:
					</Text>
					<Stack css={{ '--field-label-width': '140px' }}>
						<Field label='¿Tienes alguna discapacidad?'>
							<Switch.Root
								checked={profile.has_disability}
								onCheckedChange={(checked) =>
									updateProfileField('has_disability', checked.checked)
								}
								display='flex'
								justifyContent='space-between'
							>
								<Switch.Label>
									{profile.has_disability ? 'Sí' : 'No'}
								</Switch.Label>
								<Switch.HiddenInput />
								<Switch.Control
									_checked={{ bg: 'uni.secondary' }}
									bg='uni.gray.400'
								/>
							</Switch.Root>
						</Field>
						{profile.has_disability && (
							<Field
								orientation={{ base: 'vertical', sm: 'horizontal' }}
								label='Tipo de Discapacidad:'
							>
								<ReactSelect
									label='Discapacidad'
									options={DisabilitesOptions}
									value={profile.type_disability}
									onChange={(value) =>
										updateProfileField('type_disability', value)
									}
									isLoading={loadingDisabilites}
									placeholder='Seleccione Discapacidad'
								/>
							</Field>
						)}
					</Stack>
				</Box>
				<Box minW='50%' mt={{ base: 0, md: '24' }}>
					{profile.has_disability && (
						<FieldWithInputText
							label='Otros:'
							field='other_disability'
							placeholder='Ingresar discapacidad'
							value={profile.other_disability}
							updateProfileField={updateProfileField}
						/>
					)}
				</Box>
			</Grid>

			<Grid
				w='full'
				templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
				gap='6'
			>
				<Box minW='50%'>
					<Text color='uni.secondary' mb={5}>
						Datos de Cuenta:
					</Text>
					<Stack css={{ '--field-label-width': '140px' }}>
						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Contraseña'
						>
							<Input
								type='password'
								value={profile.password}
								onChange={(e) => updateProfileField('password', e.target.value)}
								variant='flushed'
								flex='1'
								size='sm'
							/>
						</Field>

						<Field
							orientation={{ base: 'vertical', sm: 'horizontal' }}
							label='Confirmar Contraseña'
						>
							<Input
								type='password'
								value={profile.confirmPassword}
								onChange={(e) =>
									updateProfileField('confirmPassword', e.target.value)
								}
								variant='flushed'
								flex='1'
								size='sm'
							/>
						</Field>

						{profile.password &&
							profile.confirmPassword &&
							profile.password !== profile.confirmPassword && (
								<Text color='red.500' fontSize='sm' mt={1}>
									Las contraseñas no coinciden
								</Text>
							)}
					</Stack>
				</Box>
			</Grid>
		</>
	);
};

ChangeDataStudentProfileForm.propTypes = {
	profile: PropTypes.object,
	updateProfileField: PropTypes.func,
};
