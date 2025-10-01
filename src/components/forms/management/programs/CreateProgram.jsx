import { Field, Button, toaster, Modal } from '@/components/ui';
import { Card, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiDollarSign, FiInfo, FiPlus } from 'react-icons/fi';
import { useCreateProgram } from '@/hooks';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import { uploadToS3 } from '@/utils/uploadToS3';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';

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
	const [disableUpload, setDisableUpload] = useState(false);
	const [programRequest, setProgramRequest] = useState({
		name: '',
		type: null,
		coordinator: null,
		price_credit: '',
		director: null,
		postgraduate_focus: null,
		minPaymentPercentage: null,
		maxInstallments: null,
		total_program_credits: '',
		essay_guide_path: '',
		code: '',
	});

	const validateFields = () => {
		const newErrors = {};

		if (!programRequest.name.trim()) newErrors.name = 'El nombre es requerido';
		if (!programRequest.total_program_credits)
			newErrors.total_program_credits =
				'Ingrese el total de créditos del programa';
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
		if (!programRequest.code) newErrors.code = 'El código es requerido';
		if (!programRequest.essay_guide_path)
			newErrors.essay_guide_path = 'La ruta de la guía de ensayo es requerida';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		let pathDocUrl = programRequest?.essay_guide_path;
    // Determinar el tipo de archivo (pdf o word)
    if (programRequest?.essay_guide_path instanceof File) {
      const fileType = programRequest.essay_guide_path.type;
      if (fileType === 'application/pdf') {
        console.log('Es un PDF');
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        console.log('Es un Word');
      } else {
        console.log('Tipo de archivo no soportado:', fileType);
      }
    }
		setDisableUpload(true);
		// Solo subir a S3 si hay un archivo nuevo
		if (programRequest?.essay_guide_path instanceof File) {
			pathDocUrl = await uploadToS3(
				programRequest.essay_guide_path,
				'sga_uni/essays',
				programRequest.name?.replace(/\s+/g, '_') || 'cv',
        programRequest.essay_guide_path.type === 'application/pdf' ? 'pdf' : 'docx'
			);
		}

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
			// Condicion de deuda
			min_payment_percentage: programRequest.minPaymentPercentage / 100,
			max_installments: programRequest.maxInstallments,
			total_program_credits: programRequest.total_program_credits,
			code: programRequest.code,
			essay_guide_path: pathDocUrl,
		};

		register(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Programa creado correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setDisableUpload(false);
				setProgramRequest({
					name: '',
					type: null,
					coordinator: null,
					price_credit: '',
					director: null,
					postgraduate_focus: null,
					minPaymentPercentage: null,
					maxInstallments: null,
					total_program_credits: '',
					essay_guide_path: '',
					code: '',
				});
			},
			onError: (error) => {
				setDisableUpload(false);
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
			size='5xl'
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
			loading={loading || disableUpload}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '120px' }}>
				<Card.Root css={{ flex: 1 }}>
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
								label='Código'
								invalid={!!errors.code}
								errorText={errors.code}
								required
							>
								<Input
									required
									type='text'
									name='code'
									placeholder='Código del programa'
									value={programRequest.code}
									onChange={(e) =>
										setProgramRequest({
											...programRequest,
											code: e.target.value,
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
									step='0.01'
									placeholder='Precio por crédito'
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
								label='Total créditos del programa'
								errorText={errors.total_program_credits}
								invalid={!!errors.total_program_credits}
								required
							>
								<Input
									required
									type='number'
									name='total_program_credits'
									step='1'
									placeholder='Total créditos del programa'
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
							<Field
								label='Guía de Ensayo:'
								errorText={errors.essay_guide_path}
								invalid={!!errors.essay_guide_path}
								required
							>
								<CompactFileUpload
									name='essay_guide_path'
									onChange={(file) =>
										setProgramRequest({
											...programRequest,
											essay_guide_path: file,
										})
									}
									defaultFile={
										typeof programRequest.essay_guide_path === 'string'
											? programRequest.essay_guide_path
											: undefined
									}
									onClear={() =>
										setProgramRequest({
											...programRequest,
											essay_guide_path: null,
										})
									}
									accept={'.docx, .pdf'}
								/>
							</Field>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>

				<Card.Root css={{ flex: 1 }}>
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
									placeholder='Porcentaje mínimo de deuda'
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
									placeholder='Máximo de cuotas'
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

AddProgram.propTypes = {
	fetchData: PropTypes.func,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingCoordinators: PropTypes.bool,
	ProgramFocusOptions: PropTypes.array,
	DirectorOptions: PropTypes.array,
};
