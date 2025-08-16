import {
	Box,
	Card,
	Grid,
	Heading,
	HStack,
	Icon,
	Input,
	Separator,
	Switch,
	Text,
	VStack,
} from '@chakra-ui/react';
import { Field, PasswordInput, Radio, RadioGroup } from '@/components/ui';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import {
	useReadCountries,
	useReadDepartments,
	useReadDistrict,
	useReadNacionalities,
	useReadProvince,
} from '@/hooks';
import { useEffect } from 'react';
import { useReadUbigeos } from '@/hooks/ubigeos';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { format } from 'date-fns';
import { useReadDisabilities } from '@/hooks/disabilities';
import { FiFileText, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { LuGraduationCap } from 'react-icons/lu';

const FieldWithInputText = ({
	placeholder,
	label,
	field,
	value,
	updateProfileField,
}) => {
	return (
		<Field label={label}>
			<Input
				value={value}
				onChange={(e) => updateProfileField(field, e.target.value)}
				variant='flushed'
				placeholder={placeholder}
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
	const { data: dataDepartments, isLoading: isLoadingDepartments } =
		useReadDepartments({ country: profile?.residenceCountry?.value || null });

	const departmentOptions =
		dataDepartments?.results?.map((department) => ({
			value: department.id,
			label: department.name,
		})) || [];

	const { data: dataProvinces, isLoading: isLoadingProvinces } =
		useReadProvince({ department: profile?.department?.value || null });

	const provinceOptions =
		dataProvinces?.results?.map((province) => ({
			value: province.id,
			label: province.name,
		})) || [];

	const { data: dataNacionalities, isLoading: loadingNationalities } =
		useReadNacionalities();
	const nationalityOptions =
		dataNacionalities?.results?.map((nationality) => ({
			value: nationality.id,
			label: nationality.name,
		})) || [];

	const { data: dataUbigeo, isLoading: loadingUbigeo } = useReadUbigeos();
	const districtId = profile?.district?.value;
	const filteredUbigeos =
		dataUbigeo?.results?.filter(
			(ubigeo) => ubigeo.district === districtId
		) || [];

	const UbigeosOptions = filteredUbigeos.map((ubigeo) => ({
		value: ubigeo.id,
		label: `${ubigeo.code} - ${ubigeo.district_name}`,
	}));

	const { data: dataDisabilites, isLoading: loadingDisabilites } =
		useReadDisabilities();
	const DisabilitesOptions =
		dataDisabilites?.results?.map((disability) => ({
			value: disability.id,
			label: disability.name,
		})) || [];

	const { data: dataDistrict, isLoading: loadingDisctrict } = useReadDistrict({
		province: profile?.province?.value || null,
	});

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
			profile.birth_country,
			countryOptions,
			'birth_country'
		);
	}, [dataCountries, profile]);

	useEffect(() => {
		preloadSelectValue(
			dataDepartments,
			profile.department,
			departmentOptions,
			'department'
		);
	}, [dataCountries, profile]);

	useEffect(() => {
		preloadSelectValue(
			dataCountries,
			profile.residenceCountry,
			countryOptions,
			'residenceCountry'
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

	useEffect(() => {
		preloadSelectValue(
			dataProvinces,
			profile.province,
			provinceOptions,
			'province'
		);
	}, [dataProvinces, profile]);

	useEffect(() => {
		preloadSelectValue(
			dataUbigeo,
			profile.address_ubigeo,
			UbigeosOptions,
			'address_ubigeo'
		);
	}, [dataUbigeo, profile]);

	return (
		<>
			<Grid
				w='full'
				templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
				gap='6'
			>
				<Box spaceY={4} minW='50%'>
					<Card.Root>
						<Card.Header pb={0}>
							<HStack gap={2}>
								<Icon as={FiUser} boxSize={5} />
								<Heading size='md'>Información Personal</Heading>
							</HStack>
						</Card.Header>

						<Card.Body>
							<VStack align='stretch' gap={4}>
								<Box>
									<FieldWithInputText
										label='Nombres:'
										field='first_name'
										value={profile.first_name}
										updateProfileField={updateProfileField}
									/>
								</Box>
								<Box>
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
								</Box>
								<Box>
									<FieldWithInputText
										label='Apelido Paterno:'
										field='paternal_surname'
										value={profile.paternal_surname}
										updateProfileField={updateProfileField}
									/>
								</Box>
								<Box>
									{!profile.has_one_surname && (
										<FieldWithInputText
											label='Apellido Materno:'
											field='maternal_surname'
											value={profile.maternal_surname}
											updateProfileField={updateProfileField}
										/>
									)}
								</Box>

								<Box>
									<Field label='Fecha de nacimiento:'>
										<Box w={'full'}>
											<CustomDatePicker
												selectedDate={
													profile.birth_date ? profile.birth_date : null
												}
												onDateChange={(date) =>
													updateProfileField(
														'birth_date',
														format(date, 'yyyy-MM-dd')
													)
												}
												buttonSize='md'
												size={{ base: '240px', md: '410px' }}
											/>
										</Box>
									</Field>
								</Box>
								<Box>
									<Field label='Tipo de Documento:'>
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
								</Box>
								<Box>
									<FieldWithInputText
										label='N° Identidad:'
										field='document_number'
										value={profile.document_number}
										updateProfileField={updateProfileField}
									/>
								</Box>

								<Box>
									<Field label='Foto de Documento:'>
										<CompactFileUpload
											name='document_path'
											onChange={(file) =>
												updateProfileField('document_path', file)
											}
											defaultFile={
												typeof profile.document_path === 'string'
													? profile.document_path
													: undefined
											}
											onClear={() => updateProfileField('document_path', null)}
										/>
									</Field>
								</Box>
								{/* Género */}
								<Field label='Género' required>
									<RadioGroup
										value={profile.gender?.toString() || ''}
										onChange={(e) =>
											updateProfileField('gender', e.target.value)
										}
										spaceX={4}
									>
										<Radio value='1'>Masculino</Radio>
										<Radio value='2'>Femenino</Radio>
										<Radio value='3'>Otro</Radio>
									</RadioGroup>
								</Field>
								<Separator />
							</VStack>
						</Card.Body>
					</Card.Root>

					<Card.Root>
						<Card.Header pb={0}>
							<HStack gap={2}>
								<Icon as={FiPhone} boxSize={5} />
								<Heading size='md'>Información de Contacto</Heading>
							</HStack>
						</Card.Header>

						<Card.Body>
							<VStack align='stretch' gap={4}>
								<Box>
									<FieldWithInputText
										label='Teléfono:'
										field='phone'
										value={profile.phone}
										updateProfileField={updateProfileField}
									/>
								</Box>
								<Box>
									<FieldWithInputText
										label='Correo Personal:'
										placeholder='Correo Personal'
										field='personal_email'
										value={profile.personal_email}
										updateProfileField={updateProfileField}
									/>
								</Box>
							</VStack>
						</Card.Body>
					</Card.Root>
					<Card.Root>
						<Card.Header pb={0}>
							<HStack gap={2}>
								<Icon as={FiFileText} boxSize={5} />
								<Heading size='md'>Datos Adicionales</Heading>
							</HStack>
						</Card.Header>

						<Card.Body>
							<VStack align='stretch' gap={4}>
								<Box>
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
								</Box>
								{profile.has_disability && (
									<Box>
										<Field label='Tipo de Discapacidad:'>
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
									</Box>
								)}
								{profile.has_disability && (
									<Box>
										<FieldWithInputText
											label='Descripción de Discapacidad:'
											field='other_disability'
											placeholder='Ingresar discapacidad'
											value={profile.other_disability}
											updateProfileField={updateProfileField}
										/>
									</Box>
								)}
							</VStack>
						</Card.Body>
					</Card.Root>
				</Box>

				<Box minW='50%' spaceY={4}>
					<Card.Root>
						<Card.Header pb={0}>
							<HStack gap={2}>
								<Icon as={FiMapPin} boxSize={5} />
								<Heading size='md'>Información de Ubicación</Heading>
							</HStack>
						</Card.Header>

						<Card.Body>
							<VStack align='stretch' gap={4}>
								<Box>
									<Field label='País de Nacimiento:'>
										<ReactSelect
											label='País'
											options={countryOptions}
											value={profile.birth_country}
											onChange={(value) =>
												updateProfileField('birth_country', value)
											}
											isLoading={isLoadingCountries}
											placeholder='Seleccione un país'
										/>
									</Field>
								</Box>

								<Box>
									<Field label='Ubigeo Nacimiento:'>
										<ReactSelect
											label='Ubigeo'
											options={UbigeosOptions}
											value={profile.birth_ubigeo}
											onChange={(value) =>
												updateProfileField('birth_ubigeo', value)
											}
											isLoading={loadingUbigeo}
											placeholder='Seleccione Ubigeo'
										/>
									</Field>
								</Box>

								<Box>
									<Field label='Nacionalidad:'>
										<ReactSelect
											label='Nacionalidad'
											options={nationalityOptions}
											value={profile.nationality}
											onChange={(value) =>
												updateProfileField('nationality', value)
											}
											isLoading={loadingNationalities}
											placeholder='Seleccione una nacionalidad'
										/>
									</Field>
								</Box>

								<Box>
									<Field label='País de Residencia:'>
										<ReactSelect
											label='País'
											options={countryOptions}
											value={profile.residenceCountry}
											onChange={(value) =>
												updateProfileField('residenceCountry', value)
											}
											isLoading={isLoadingCountries}
											placeholder='Seleccione un país'
										/>
									</Field>
								</Box>

								<Box>
									<Field label='Departamento de Residencia:'>
										<ReactSelect
											label='Departamento'
											options={departmentOptions}
											value={profile.department}
											onChange={(value) =>
												updateProfileField('department', value)
											}
											isLoading={isLoadingDepartments}
											placeholder='Seleccione un departamento'
										/>
									</Field>
								</Box>

								<Box>
									<Field label='Provincia de Residencia:'>
										<ReactSelect
											label='Provincia'
											options={provinceOptions}
											value={profile.province}
											onChange={(value) =>
												updateProfileField('province', value)
											}
											isLoading={isLoadingProvinces}
											placeholder='Seleccione una provincia'
										/>
									</Field>
								</Box>

								<Box>
									<Field label='Distrito de Residencia:'>
										<ReactSelect
											label='Distrito'
											options={DistrictOptions}
											value={profile.district}
											onChange={(value) =>
												updateProfileField('district', value)
											}
											isLoading={loadingDisctrict}
											placeholder='Seleccione Distrito'
										/>
									</Field>
								</Box>
								<Box>
									<FieldWithInputText
										label='Dirección:'
										field='address'
										value={profile.address}
										updateProfileField={updateProfileField}
									/>
								</Box>
								<Box>
									<Field label='Ubigeo Domicilio:'>
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
								</Box>
							</VStack>
						</Card.Body>
					</Card.Root>
					<Card.Root>
						<Card.Header pb={0}>
							<HStack gap={2}>
								<Icon as={LuGraduationCap} boxSize={5} />
								<Heading size='md'>Información Académica</Heading>
							</HStack>
						</Card.Header>

						<Card.Body>
							<VStack align='stretch' gap={4}>
								<Box>
									<Field label='¿Eres egresado de la UNI?'>
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
								</Box>
								<Separator />

								<Box>
									<FieldWithInputText
										label='Correo institucional:'
										field='uni_email'
										placeholder='Ingresar correo'
										value={profile.uni_email}
										updateProfileField={updateProfileField}
									/>
								</Box>

								<Box>
									<FieldWithInputText
										label='Código UNI:'
										field='uni_code'
										placeholder='Ingresar código'
										value={profile.uni_code}
										updateProfileField={updateProfileField}
									/>
								</Box>

								<Box>
									<FieldWithInputText
										label='Colegiatura:'
										placeholder='Numero de colegiatura'
										field='license_number'
										value={profile.license_number}
										updateProfileField={updateProfileField}
									/>
								</Box>
							</VStack>
						</Card.Body>
					</Card.Root>
					<Card.Root>
						<Card.Header pb={0}>
							<HStack gap={2}>
								<Icon as={LuGraduationCap} boxSize={5} />
								<Heading size='md'>Datos de la cuenta</Heading>
							</HStack>
						</Card.Header>

						<Card.Body>
							<VStack align='stretch' gap={4}>
								<Box>
									<Text
										fontSize='sm'
										color='gray.500'
										mt={2}
										fontWeight='medium'
									>
										Usuario del Sistema
									</Text>
									<Text mt={1}>{profile.user.username}</Text>
								</Box>
								<Separator />
								<Box>
									<Field label='Contraseña'>
										<PasswordInput
											type='password'
											value={profile.password}
											onChange={(e) =>
												updateProfileField('password', e.target.value)
											}
											variant='flushed'
											flex='1'
											size='sm'
											autoComplete='new-password'
										/>
									</Field>
								</Box>
								<Box>
									<Field label='Confirmar Contraseña'>
										<PasswordInput
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
								</Box>
							</VStack>
						</Card.Body>
					</Card.Root>
				</Box>
			</Grid>
		</>
	);
};

ChangeDataStudentProfileForm.propTypes = {
	profile: PropTypes.object,
	updateProfileField: PropTypes.func,
};
