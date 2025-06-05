import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateDistrict } from '@/hooks';
import { ReactSelect } from '@/components/select';

export const UpdateSettingsDistrictForm = ({
	data,
	fetchData,
	dataProvince,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(data?.name);
	const [code, setCode] = useState(data?.code);
	const [selectedProvince, setselectedProvince] = useState(null);

	const { mutateAsync: updateDistrict, isPending } = useUpdateDistrict();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name.trim(),
			code: code.trim(),
			province: selectedProvince.value,
		};

		try {
			await updateDistrict({ id: data.id, payload });
			toaster.create({
				title: 'Distrito editado correctamente',
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

	const ProvinceOptions = dataProvince?.map((province) => ({
		label: province.name,
		value: province.id,
	}));

	useEffect(() => {
		if (data && data.province && dataProvince?.length) {
			const matchedProvince = dataProvince.find((c) => c.id === data.province);
			if (matchedProvince) {
				setselectedProvince({
					label: matchedProvince.name,
					value: matchedProvince.id,
				});
			}
		}
	}, [data, dataProvince]);

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
						placeholder='San miguel'
						size='xs'
					/>
				</Field>
				<Field
					orientation={{ base: 'vertical', sm: 'horizontal' }}
					label='Provincia'
				>
					<ReactSelect
						value={selectedProvince}
						onChange={(select) => {
							setselectedProvince(select);
						}}
						variant='flushed'
						size='xs'
						isSearchable={true}
						name='provincia'
						options={ProvinceOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateSettingsDistrictForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
	dataProvince: PropTypes.array,
};
