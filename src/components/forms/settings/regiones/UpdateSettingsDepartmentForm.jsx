import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateDepartments } from '@/hooks';
import { ReactSelect } from '@/components/select';

export const UpdateSettingsDepartmentForm = ({
	data,
	fetchData,
	dataCountries,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(data?.name);
	const [code, setCode] = useState(data?.code);
	const [selectedCountry, setSelectedCountry] = useState(null);

	const { mutateAsync: updateDepartment, isPending } = useUpdateDepartments();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		const payload = {
			name: name.trim(),
			code: code.trim(),
			country: selectedCountry.value,
		};

		try {
			await updateDepartment({ id: data.id, payload });
			toaster.create({
				title: 'País editado correctamente',
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

	const CountriesOptions = dataCountries?.map((country) => ({
		label: country.name,
		value: country.id,
	}));

	useEffect(() => {
		if (data && data.country && dataCountries?.length) {
			const matchedCountry = dataCountries.find((c) => c.id === data.country);
			if (matchedCountry) {
				setSelectedCountry({
					label: matchedCountry.name,
					value: matchedCountry.id,
				});
			}
		}
	}, [data, dataCountries]);

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
					label='País:'
				>
					<ReactSelect
						value={selectedCountry}
						onChange={(select) => {
							setSelectedCountry(select);
						}}
						variant='flushed'
						size='xs'
						isClearable
						isSearchable={true}
						name='paises'
						options={CountriesOptions}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateSettingsDepartmentForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
	dataCountries: PropTypes.array,
};
