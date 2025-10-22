import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateProvince } from '@/hooks';
import { ReactSelect } from '@/components/select';

export const UpdateSettingsProvinceForm = ({
	data,
	fetchData,
	dataDepartment,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(data?.name);
	const [code, setCode] = useState(data?.code);
	const [selectedDepartment, setselectedDepartment] = useState(null);

	const { mutateAsync: updateProvince, isPending } = useUpdateProvince();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name.trim(),
			code: code.trim(),
			department: selectedDepartment.value,
		};

		try {
			await updateProvince({ id: data.id, payload });
			toaster.create({
				title: 'Provincia editado correctamente',
				type: 'success',
			});
			setOpen(false);
			fetchData();
		} catch (error) {
			toaster.create({
				title: error.message,
				type: 'error',
			});
		}
	};

	const DepartmentOptions = dataDepartment?.map((department) => ({
		label: department.name,
		value: department.id,
	}));

	useEffect(() => {
		if (data && data.department && dataDepartment?.length) {
			const matchedDepartment = dataDepartment.find((c) => c.id === data.department);
			if (matchedDepartment) {
				setselectedDepartment({
					label: matchedDepartment.name,
					value: matchedDepartment.id,
				});
			}
		}
	}, [data, dataDepartment]);

	return (
		<Modal
			title='Editar propiedades'
			placement='center'
			trigger={
				<IconButton colorPalette='cyan' size='xs'>
					<FiEdit2 />
				</IconButton>
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
						placeholder='Lima'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Departamento'
				>
					<ReactSelect
						value={selectedDepartment}
						onChange={(select) => {
							setselectedDepartment(select);
						}}
						variant='flushed'
						size='xs'
						isSearchable={true}
						isClearable
						name='departamento'
						options={DepartmentOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateSettingsProvinceForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
	dataDepartment: PropTypes.array,
};
