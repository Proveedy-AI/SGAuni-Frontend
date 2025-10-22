import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Button, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiPlus } from 'react-icons/fi';
import { useCreateProvince } from '@/hooks';
import { ReactSelect } from '@/components/select';

export const AddSettingsProvinceForm = ({
	fetchData,
	isLoading,
	dataDepartments,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [selectedDepartment, setSelectedDepartment] = useState(null);

	const { mutate: createProvince, isPending } = useCreateProvince();

	const handleSubmitData = (e) => {
		e.preventDefault();

		// Validación de campos vacíos
		if (!name.trim() || !code.trim() || !selectedDepartment) {
			toaster.create({
				title: 'Por favor completa todos los campos',
				type: 'warning',
			});
			return;
		}

		const payload = {
			name: name.trim(),
			code: code.trim(),
			department: selectedDepartment.value,
		};

		createProvince(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Provincia registrado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData?.();
				setName('');
				setCode('');
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

	const DepartmentOptions = dataDepartments?.map((department) => ({
		label: department.name,
		value: department.id,
	}));

	return (
		<Modal
			title='Agregar nueva Provincia'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Provincia
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
					label='Provincia:'
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
						placeholder='00'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Departamento:'
				>
					<ReactSelect
						value={selectedDepartment}
						onChange={(select) => {
							setSelectedDepartment(select);
						}}
						variant='flushed'
						size='xs'
						isDisabled={isLoading}
						isLoading={isLoading}
						isSearchable={true}
						isClearable
						name='paises'
						options={DepartmentOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddSettingsProvinceForm.propTypes = {
	fetchData: PropTypes.func,
	dataDepartments: PropTypes.array,
	isLoading: PropTypes.bool,
};
