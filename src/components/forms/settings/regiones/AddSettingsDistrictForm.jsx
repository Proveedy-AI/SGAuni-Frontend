import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useCreateDistrict } from '@/hooks';


export const AddSettingsDistrictForm = ({
	fetchData,
	isLoading,
	dataProvince,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [selectedProvince, setSelectedProvince] = useState(null);

	const { mutate: createDistrict, isPending } = useCreateDistrict();

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!name.trim() || !code.trim() || !selectedProvince) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			name: name.trim(),
			code: code.trim(),
			province: selectedProvince.value,
		};

		createDistrict(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Provincia registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setName('');
				setCode('');
				setSelectedProvince(null)
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al registrar la provincia',
					type: 'error',
				});
			},
		});
	};

	const ProvinceOptions = dataProvince?.map((province) => ({
		label: province.name,
		value: province.id,
	}));

	return (
		<Modal
			title='Agregar nuevo distrito'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Distrito
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
					label='Distrito:'
				>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='San Miguel'
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
						placeholder=''
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Provincia:'
				>
					<ReactSelect
						value={selectedProvince}
						onChange={(select) => {
							setSelectedProvince(select);
						}}
						variant='flushed'
						size='xs'
						isDisabled={isLoading}
						isLoading={isLoading}
						isSearchable={true}
						isClearable
						name='provincia'
						options={ProvinceOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddSettingsDistrictForm.propTypes = {
	fetchData: PropTypes.func,
	dataProvince: PropTypes.array,
	isLoading: PropTypes.bool,
};
