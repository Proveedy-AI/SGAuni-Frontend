import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';
import { useUpdateUbigeos } from '@/hooks/ubigeos';

export const UpdateSettingsUbigeosForm = ({
	data,
	fetchData,
	dataDistrict,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [code, setCode] = useState(data?.code);
	const [selectedDistrict, setselectedDistrict] = useState(null);

	const { mutateAsync: updateUbigeos, isPending } = useUpdateUbigeos();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			code: code.trim(),
			district: selectedDistrict.value,
		};

		try {
			await updateUbigeos({ id: data.id, payload });
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

	const DistrictOptions = dataDistrict?.map((district) => ({
		label: district.name,
		value: district.id,
	}));

	useEffect(() => {
		if (data && data.district && dataDistrict?.length) {
			const matchedDistrict = dataDistrict.find((c) => c.id === data.district);
			if (matchedDistrict) {
				setselectedDistrict({
					label: matchedDistrict.name,
					value: matchedDistrict.id,
				});
			}
		}
	}, [data, dataDistrict]);

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
					label='Distrito'
				>
					<ReactSelect
						value={selectedDistrict}
						onChange={(select) => {
							setselectedDistrict(select);
						}}
						variant='flushed'
						size='xs'
						isSearchable={true}
						name='distrito'
						options={DistrictOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateSettingsUbigeosForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
	dataDistrict: PropTypes.array,
};
