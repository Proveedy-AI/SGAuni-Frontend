import { Field, Modal, toaster } from '@/components/ui';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useUpdateProgram } from '@/hooks';
import { HiPencil } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';

export const EditProgram = ({
	fetchData,
	item,
	DirectorOptions,
	ProgramFocusOptions,
	programTypesOptions,
	coordinatorsOptions,
	loadingProgramTypes,
	loadingCoordinators,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const { mutateAsync: update, isPending: loadingUpdate } = useUpdateProgram();
	const [programRequest, setProgramRequest] = useState({
		name: item.name,
		type: null,
		coordinator: null,
		price_credit: item.price_credit,
		director: null,
		postgraduate_focus: null,
	});

	useEffect(() => {
		if (programTypesOptions?.length && coordinatorsOptions?.length) {
			setProgramRequest((prev) => ({
				...prev,
				type: programTypesOptions.find((t) => t.value === item.type.toString()),
				coordinator: coordinatorsOptions.find(
					(c) => c.value === item.coordinator.toString()
				),
				director: DirectorOptions.find(
					(d) => String(d.value) === String(item.director)
				),
				postgraduate_focus: ProgramFocusOptions.find(
					(p) => String(p.value) === String(item.postgraduate_focus)
				),
			}));
		}
	}, [
		programTypesOptions,
		coordinatorsOptions,
		item,
		DirectorOptions,
		ProgramFocusOptions,
	]);
	

	const validateFields = () => {
		const newErrors = {};

		if (!programRequest.name.trim()) newErrors.name = 'El nombre es requerido';
		if (!programRequest.type) newErrors.type = 'Seleccione un tipo de programa';
		if (!programRequest.coordinator)
			newErrors.coordinator = 'Seleccione un coordinador';
		if (!programRequest.director) newErrors.director = 'Seleccione un director';
		if (
			!programRequest.price_credit ||
			Number(programRequest.price_credit) <= 0
		)
			newErrors.price_credit = 'El precio debe ser mayor a 0';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdate = async () => {
		console.log(validateFields());
		if (!validateFields()) return;
		const payload = {
			coordinator: Number(programRequest.coordinator.value),
			name: programRequest.name,
			type: Number(programRequest.type.value),
			price_credit: programRequest.price_credit,
			director: programRequest.director
				? Number(programRequest.director.value)
				: null,
			postgraduate_focus: programRequest.postgraduate_focus
				? Number(programRequest.postgraduate_focus.value)
				: null,
		};

		await update(
			{ id: item.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Programa actualizado correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData();
				},
				onError: (error) => {
					toaster.create({
						title: error.message,
						type: 'error',
					});
				},
			}
		);
	};

	return (
		<Modal
			title='Editar Programa'
			placement='center'
			trigger={
				<IconButton colorPalette='green' size='xs'>
					<HiPencil />
				</IconButton>
			}
			onSave={handleUpdate}
			loading={loadingUpdate}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack spacing={4}>
				<Field
					label='Nombre del programa'
					invalid={!!errors.name}
					errorText={errors.name}
					required
				>
					<Input
						value={programRequest.name}
						onChange={(e) =>
							setProgramRequest((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
					/>
				</Field>

				<Field
					label='Tipo de programa'
					errorText={errors.type}
					invalid={!!errors.type}
					required
				>
					<ReactSelect
						value={programRequest.type}
						onChange={(select) => {
							setProgramRequest({ ...programRequest, type: select });
						}}
						variant='flushed'
						size='xs'
						isDisabled={loadingProgramTypes}
						isLoading={loadingProgramTypes}
						isSearchable={true}
						isClearable
						name='Tipos de programa'
						options={programTypesOptions}
					/>
				</Field>

				<Field
					label='Enfoque de programa'
					errorText={errors.postgraduate_focus}
					invalid={!!errors.postgraduate_focus}
				>
					<ReactSelect
						value={programRequest.postgraduate_focus}
						onChange={(select) => {
							setProgramRequest({
								...programRequest,
								postgraduate_focus: select,
							});
						}}
						variant='flushed'
						size='xs'
						isDisabled={loadingProgramTypes}
						isLoading={loadingProgramTypes}
						isSearchable={true}
						isClearable
						name='Enfoques de programa'
						options={ProgramFocusOptions}
					/>
				</Field>

				<Field
					label='Director'
					errorText={errors.director}
					invalid={!!errors.director}
					required
				>
					<ReactSelect
						value={programRequest.director}
						onChange={(select) => {
							setProgramRequest({ ...programRequest, director: select });
						}}
						variant='flushed'
						size='xs'
						isDisabled={loadingCoordinators}
						isLoading={loadingCoordinators}
						isSearchable={true}
						isClearable
						name='Directores'
						options={DirectorOptions}
					/>
				</Field>

				<Field
					label='Coordinador'
					errorText={errors.coordinator}
					invalid={!!errors.coordinator}
					required
				>
					<ReactSelect
						value={programRequest.coordinator}
						onChange={(select) => {
							setProgramRequest({ ...programRequest, coordinator: select });
						}}
						variant='flushed'
						size='xs'
						isDisabled={loadingCoordinators}
						isLoading={loadingCoordinators}
						isSearchable={true}
						isClearable
						name='Coordinadores'
						options={coordinatorsOptions}
					/>
				</Field>
				<Field
					label='Precio por crédito (S/.)'
					errorText={errors.price_credit}
					invalid={!!errors.price_credit}
					required
				>
					<Input
						required
						type='number'
						name='price_credit'
						placeholder='Precio por crédito'
						value={programRequest.price_credit}
						onChange={(e) =>
							setProgramRequest({
								...programRequest,
								price_credit: Number(e.target.value),
							})
						}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

EditProgram.propTypes = {
	fetchData: PropTypes.func,
	item: PropTypes.object,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
	DirectorOptions: PropTypes.array,
	ProgramFocusOptions: PropTypes.array,
};
