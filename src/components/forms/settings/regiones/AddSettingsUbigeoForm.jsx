import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useCreateUbigeos } from '@/hooks/ubigeos';

export const AddSettingsUbigeoForm = ({
	fetchData,
	isLoading,
	dataDistrict,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [code, setCode] = useState('');
	const [selectedDistrict, setSelectedDistrict] = useState(null);

	const { mutate: createUbigeo, isPending } = useCreateUbigeos();

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if ( !code.trim() || !selectedDistrict) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			code: code.trim(),
			district: selectedDistrict.value,
		};

		createUbigeo(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Ubigeo registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData?.();
				setCode('');
			},
			onError: (error) => {
				console.log(error);
				toaster.create({
					title: error.response?.data?.[0] || 'Error al registrar el Ubigeo',
					type: 'error',
				});
			},
		});
	};

	const DistrictOptions = dataDistrict?.map((department) => ({
		label: department.name,
		value: department.id,
	}));

	return (
		<Modal
			title='Agregar nuevo Ubigeo'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Ubigeo
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
					label='Código:'
				>
					<Input
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder='0000000'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Distrito:'
				>
					<ReactSelect
						value={selectedDistrict}
						onChange={(select) => {
							setSelectedDistrict(select);
						}}
						variant='flushed'
						size='xs'
						isDisabled={isLoading}
						isLoading={isLoading}
						isSearchable={true}
						isClearable
						name='paises'
						options={DistrictOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddSettingsUbigeoForm.propTypes = {
	fetchData: PropTypes.func,
	dataDistrict: PropTypes.array,
	isLoading: PropTypes.bool,
};
