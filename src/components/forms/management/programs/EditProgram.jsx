import { Field, Modal, toaster } from '@/components/ui';
import { Card, IconButton, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useUpdateProgram } from '@/hooks';
import { HiPencil } from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import { FiDollarSign, FiInfo } from 'react-icons/fi';

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
		minPaymentPercentage: null,
		maxInstallments: null,
		total_program_credits: item.total_program_credits || '', // Aseguramos que sea un string
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
				postgraduate_focus: ProgramFocusOptions?.find(
					(p) => String(p.value) === String(item.postgraduate_focus)
				),
				minPaymentPercentage: item.min_payment_percentage * 100,
				maxInstallments: item.max_installments,
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
		if (!programRequest.postgraduate_focus)
			newErrors.postgraduate_focus = 'Seleccione un enfoque';
		if (!programRequest.coordinator)
			newErrors.coordinator = 'Seleccione un coordinador';
		if (
			!programRequest.price_credit ||
			Number(programRequest.price_credit) <= 0
		)
			newErrors.price_credit = 'El precio debe ser mayor a 0';
		if (!programRequest.total_program_credits)
			newErrors.total_program_credits =
				'Ingrese el total de créditos del programa';
		if (!programRequest.director) newErrors.director = 'Seleccione un director';
		if (
			!programRequest.minPaymentPercentage ||
			programRequest.minPaymentPercentage < 0 ||
			programRequest.minPaymentPercentage > 100
		) {
			newErrors.minPaymentPercentage =
				'El porcentaje mínimo debe estar entre 0 y 100';
		}
		if (
			!programRequest.maxInstallments ||
			programRequest.maxInstallments <= 0
		) {
			newErrors.maxInstallments =
				'El máximo de cuotas debe ser un número positivo';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdate = async () => {
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
			// Condicion de deuda
			min_payment_percentage: programRequest.minPaymentPercentage / 100,
			max_installments: programRequest.maxInstallments,
			total_program_credits: programRequest.total_program_credits,
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
			size='5xl'
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
			<Stack css={{ '--field-label-width': '120px' }}>
				<Card.Root>
					<Card.Header
						css={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '8px',
							color: 'var(--chakra-colors-uni-secondary)',
							fontSize: '16px',
							fontWeight: 'bold',
						}}
					>
						<FiInfo size={24} /> Detalles del programa
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={2} gap={4}>
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
										setProgramRequest({
											...programRequest,
											name: e.target.value,
										})
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
										setProgramRequest({
											...programRequest,
											coordinator: select,
										});
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
									step='0.01'
									value={programRequest.price_credit}
									onChange={(e) => {
										const value = e.target.value;
										// Limita a 2 decimales
										const formatted = value.includes('.')
											? value.split('.')[0] +
												'.' +
												value.split('.')[1].slice(0, 2)
											: value;

										setProgramRequest({
											...programRequest,
											price_credit: formatted,
										});
									}}
								/>
							</Field>
							<Field
								label='Total de créditos del programa'
								errorText={errors.total_program_credits}
								invalid={!!errors.total_program_credits}
								required
							>
								<Input
									required
									type='number'
									name='total_program_credits'
									placeholder='Total de créditos del programa'
									step='1'
									value={programRequest.total_program_credits}
									onChange={(e) => {
										const value = e.target.value;
										// Elimina decimales si los escriben
										const onlyInteger = value.replace(/\D/g, '');
										setProgramRequest({
											...programRequest,
											total_program_credits: onlyInteger,
										});
									}}
								/>
							</Field>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>

				<Card.Root>
					<Card.Header
						css={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '8px',
							color: 'var(--chakra-colors-uni-secondary)',
							fontSize: '16px',
							fontWeight: 'bold',
						}}
					>
						<FiDollarSign size={24} /> Condiciones de deuda
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={2} gap={4}>
							<Field
								label='Porcentaje mínimo de deuda (0-100%)'
								invalid={!!errors.minPaymentPercentage}
								errorText={errors.minPaymentPercentage}
								required
							>
								<Input
									type='number'
									value={programRequest.minPaymentPercentage}
									onChange={(e) =>
										setProgramRequest({
											...programRequest,
											minPaymentPercentage: e.target.value,
										})
									}
								/>
							</Field>
							<Field
								label='Máximo de cuotas'
								invalid={!!errors.maxInstallments}
								errorText={errors.maxInstallments}
								required
							>
								<Input
									type='number'
									step='1'
									value={programRequest.maxInstallments}
									onChange={(e) => {
										const value = e.target.value;
										// Elimina decimales si los escriben
										const onlyInteger = value.replace(/\D/g, '');
										setProgramRequest({
											...programRequest,
											maxInstallments: onlyInteger,
										});
									}}
								/>
							</Field>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
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
