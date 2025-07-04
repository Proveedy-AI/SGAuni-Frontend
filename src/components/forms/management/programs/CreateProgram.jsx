import { Field, Button, toaster, Modal } from '@/components/ui';
import { Input, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCreateProgram } from '@/hooks';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';

export const AddProgram = ({
	fetchData,
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
	const { mutate: register, isPending: loading } = useCreateProgram();

	const [programRequest, setProgramRequest] = useState({
		name: '',
		type: null,
		coordinator: null,
		price_credit: '',
		director: null,
		postgraduate_focus: null,
	});

	const validateFields = () => {
		const newErrors = {};

		if (!programRequest.name.trim()) newErrors.name = 'El nombre es requerido';
		if (!programRequest.type) newErrors.type = 'Seleccione un tipo de programa';
		if (!programRequest.coordinator)
			newErrors.coordinator = 'Seleccione un coordinador';
		if (
			!programRequest.price_credit ||
			Number(programRequest.price_credit) <= 0
		)
			newErrors.price_credit = 'El precio debe ser mayor a 0';
		if (!programRequest.director)
			newErrors.director = 'Seleccione un director';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		const payload = {
			name: programRequest.name,
			type: Number(programRequest.type.value),
			coordinator: Number(programRequest.coordinator.value),
			director: programRequest.director
				? Number(programRequest.director.value)
				: null,
			postgraduate_focus: programRequest.postgraduate_focus
				? Number(programRequest.postgraduate_focus.value)
				: null,
			price_credit: programRequest.price_credit,
		};

		register(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Programa creado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setProgramRequest({
					name: '',
					type: null,
					coordinator: null,
					price_credit: '',
				});
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Crear Programa'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Crear Programa
				</Button>
			}
			onSave={handleSubmitData}
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '120px' }}>
				<Field
					label='Nombre del Programa'
					invalid={!!errors.name}
					errorText={errors.name}
					required
				>
					<Input
						required
						type='text'
						name='name'
						placeholder='Nombre del programa'
						value={programRequest.name}
						onChange={(e) =>
							setProgramRequest({ ...programRequest, name: e.target.value })
						}
					/>
				</Field>
				<Field
					label='Tipo de Programa'
					errorText={errors.type}
					invalid={!!errors.type}
					required
				>
					<ReactSelect
						value={programRequest.type}
						variant='flushed'
						size='xs'
						isDisabled={loadingProgramTypes}
						isLoading={loadingProgramTypes}
						isSearchable={true}
						isClearable
						onChange={(select) => {
							setProgramRequest({ ...programRequest, type: select });
						}}
						name='Tipos de Programa'
						options={programTypesOptions}
					/>
				</Field>
				<Field
					label='Enfoque de Programa'
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
						isSearchable={true}
						isClearable
						name='Enfoques de Programa'
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
								price_credit: e.target.value,
							})
						}
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

AddProgram.propTypes = {
	fetchData: PropTypes.func,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
	ProgramFocusOptions: PropTypes.array,
	DirectorOptions: PropTypes.array,
};
