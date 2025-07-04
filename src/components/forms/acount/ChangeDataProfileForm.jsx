import { Badge, Box, Flex, Grid, Input, Stack, Text } from '@chakra-ui/react';
import { Field } from '@/components/ui';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';

const FieldWithInputText = ({ label, field, errors, value, updateProfileField }) => {
	return (
		<Field
			orientation={{
				base: 'vertical',
				sm: 'horizontal',
			}}
			label={label}
      invalid={errors[field]}
      errorText={errors[field]}
		>
			<Input
				value={value}
				onChange={(e) => updateProfileField(field, e.target.value)}
				variant='flushed'
				flex='1'
				size='sm'
			/>
		</Field>
	);
};

FieldWithInputText.propTypes = {
	label: PropTypes.string,
	field: PropTypes.string,
  errors: PropTypes.object,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	updateProfileField: PropTypes.func,
};

export const ChangeDataProfileForm = ({ errors, profile, updateProfileField }) => {
	return (
		<Grid
			w='full'
			templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
			gap='6'
		>
			<Box minW='50%'>
				<Stack css={{ '--field-label-width': '140px' }}>
					<FieldWithInputText
						label='Nombres:'
						field='first_name'
						errors={errors}
						value={profile.first_name}
						updateProfileField={updateProfileField}
					/>

					<FieldWithInputText
						label='Apellidos:'
						field='last_name'
            errors={errors}
						value={profile.last_name}
						updateProfileField={updateProfileField}
					/>

					{/* <FieldWithInputText label='Correo electrónico:' field='email' value={profile.email} updateProfileField={updateProfileField} /> */}

					<FieldWithInputText
						label='Num Identidad:'
						field='num_doc'
            errors={errors}
						value={profile.num_doc}
						updateProfileField={updateProfileField}
					/>

					{/* <FieldWithInputText label='País:' field='country' value={profile.country.label || user.country.name} updateProfileField={updateProfileField} /> */}

					<FieldWithInputText
						label='Correo institucional:'
						field='uni_email'
            errors={errors}
						value={profile.uni_email}
						updateProfileField={updateProfileField}
					/>

					<Field
						orientation={{ base: 'vertical', sm: 'horizontal' }}
						label='Categoria:'
					>
						<ReactSelect
							options={[
								{ label: '4ta categoría', value: '4ta' },
								{ label: '5ta categoría', value: '5ta' },
							]}
							value={{
								label:
									profile.category === '4ta'
										? '4ta categoría'
										: '5ta categoría',
								value: profile.category,
							}}
							onChange={(option) =>
								updateProfileField('category', option.value)
							}
							size='xs'
							variant='flushed'
							isSearchable={false}
							isClearable
						/>
					</Field>
				</Stack>
			</Box>

			<Box minW='50%'>
				<Stack css={{ '--field-label-width': '140px' }}>
					<FieldWithInputText
						label='Teléfono:'
						field='phone'
            errors={errors}
						value={profile.phone}
						updateProfileField={updateProfileField}
					/>

					<Field
						orientation={{ base: 'vertical', sm: 'horizontal' }}
						label='Curriculum:'
					>
						<CompactFileUpload
							name='path_cv'
							onChange={(file) => updateProfileField('path_cv', file)}
							defaultFile={
								typeof profile.path_cv === 'string'
									? profile.path_cv
									: undefined
							}
							onClear={() => updateProfileField('path_cv', null)}
						/>
					</Field>

					<Field
						orientation={{ base: 'vertical', sm: 'horizontal' }}
						label='Título o grado:'
					>
						<CompactFileUpload
							name='path_grade'
							onChange={(file) => updateProfileField('path_grade', file)}
							defaultFile={
								typeof profile.path_grade === 'string'
									? profile.path_grade
									: undefined
							}
							onClear={() => updateProfileField('path_grade', null)}
						/>
					</Field>
				</Stack>
			</Box>
			<Stack css={{ '--field-label-width': '140px' }}>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Roles asignados:'
					mb={10}
				>
					<Flex w='full' align='start' gap='2' wrap='wrap'>
						{profile.roles.length > 0 ? (
							profile.roles.map((role, index) => (
								<Badge
									key={index}
									bg={{
										base: 'uni.200',
										_dark: 'uni.gray.300',
									}}
								>
									{role.name}
								</Badge>
							))
						) : (
							<Text fontSize='sm' color='gray.500'>
								Sin roles asignados
							</Text>
						)}
					</Flex>
				</Field>
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
		</Grid>
	);
};

ChangeDataProfileForm.propTypes = {
  errors: PropTypes.object,
	profile: PropTypes.object,
	updateProfileField: PropTypes.func,
};
