import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateDepartments } from '@/hooks';
import { ReactSelect } from '@/components/select';

export const AddSettingsDepartmentForm = ({
	fetchData,
	dataCountries,
	isLoading,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [selectedCountry, setSelectedCountry] = useState(null);

	const { mutate: createDepartment, isPending } = useCreateDepartments();

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!name.trim() || !code.trim() || !selectedCountry) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			name: name.trim(),
			code: code.trim(),
			country: selectedCountry.value
		};

		createDepartment(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Departamento registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setName('');
				setCode('');
				setSelectedCountry(null);
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title:
						error.response?.data?.[0] || 'Error al registrar el departamento',
					type: 'error',
				});
			},
		});
	};
	const CountriesOptions = dataCountries?.map((country) => ({
		label: country.name,
		value: country.id,
	}));
	return (
		<Modal
			title='Agregar nuevo departamento'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Departamento
				</Button>
			}
			onSave={handleSubmitData}
			loading={isPending}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Departamento:'
				>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Lima'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Código:'
				>
					<Input
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder='Lima'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='País'
				>
					<ReactSelect
						value={selectedCountry}
						onChange={(select) => {
							setSelectedCountry(select);
						}}
						variant='flushed'
						size='xs'
						isDisabled={isLoading}
						isLoading={isLoading}
						isSearchable={true}
						name='paises'
						options={CountriesOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddSettingsDepartmentForm.propTypes = {
	fetchData: PropTypes.func,
	isLoading: PropTypes.bool,
	dataCountries: PropTypes.array,
};
