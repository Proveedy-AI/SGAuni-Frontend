import { Field, toaster, Modal, RadioGroup, Radio } from '@/components/ui';
import {
	Card,
	Flex,
	IconButton,
	Input,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FiInfo } from 'react-icons/fi';

import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import { HiPencil } from 'react-icons/hi2';
import { useUpdatePaymentRules } from '@/hooks/payment_rules/useUpdatePaymentRules';

export const UpdatePaymentRules = ({
	fetchData,
	item,
	PurposeOptions,
	loadingPurposeOptions,
}) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const { mutate: update, isPending: loading } = useUpdatePaymentRules();

	const [purposeRequest, setPurposeRequest] = useState({
		payment_purpose: null,
		amount: item?.amount || '',
		amount_type: null,
		use_credits_from: null,
		discount_percentage: item?.discount_percentage || '',
		applies_to_students: item?.applies_to_students ?? false,
		applies_to_applicants: item?.applies_to_applicants ?? false,
		only_first_enrollment: item?.only_first_enrollment ?? false,
		process_types: item?.process_types || '',
	});

	useEffect(() => {
		if (PurposeOptions?.length) {
			setPurposeRequest((prev) => ({
				...prev,
				payment_purpose: PurposeOptions.find(
					(t) => t.value === item?.payment_purpose?.toString()
				),
				use_credits_from: item?.use_credits_from
					? CreditsFromOptions.find(
							(opt) => opt.value === item.use_credits_from
						)
					: null,
				process_types: item?.process_types
					? Array.isArray(item.process_types)
						? item.process_types.map((type) =>
								ProcessTypesOptions.find((opt) => opt.value === type)
							)
						: item.process_types
								.split(',')
								.map((type) =>
									ProcessTypesOptions.find((opt) => opt.value === type)
								)
					: [],
				amount_type: item?.amount_type
					? TypeAmountOptions.find((opt) => opt.value === item.amount_type)
					: null,
			}));
		}
	}, [PurposeOptions, item]);

	const ProcessTypesOptions = [
		{ value: 'admission', label: 'Admisión' },
		{ value: 'enrollment', label: 'Matrícula' },
	];

	const validateFields = () => {
		const newErrors = {};
		if (!purposeRequest.amount_type)
			newErrors.amount_type = 'Seleccione un tipo de monto';

		if (
			purposeRequest.amount_type?.value === 'fijo' &&
			!purposeRequest.amount?.toString().trim()
		)
			newErrors.amount = 'El monto es requerido';

		if (
			purposeRequest.amount_type?.value === 'calcular' &&
			!purposeRequest.use_credits_from
		)
			newErrors.use_credits_from = 'Seleccione créditos a usar';
		if (!purposeRequest.payment_purpose)
			newErrors.payment_purpose = 'Seleccione un propósito de pago';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		const payload = {
			amount: purposeRequest.amount,
			amount_type: Number(purposeRequest.amount_type.value),
			payment_purpose: Number(purposeRequest.payment_purpose.value),
			use_credits_from: purposeRequest.use_credits_from
				? Number(purposeRequest.use_credits_from.value)
				: null,
			discount_percentage: purposeRequest.discount_percentage,
			applies_to_students: purposeRequest.applies_to_students,
			applies_to_applicants: purposeRequest.applies_to_applicants,
			only_first_enrollment: purposeRequest.only_first_enrollment,
			process_types: purposeRequest.process_types.map((type) => type.value),
			//admission_modality: null,
			//student_status: 1,
			//program: null,
			//in_installments: false,
		};
		console.log(payload)
		update(
			{ id: item.id, payload },
			{
				onSuccess: () => {
					toaster.create({
						title: 'Regla actualizada correctamente',
						type: 'success',
					});
					setOpen(false);
					fetchData();
					setPurposeRequest({
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
			}
		);
	};

	const TypeAmountOptions = [
		{ value: 1, label: 'Fijo' },
		{ value: 2, label: 'Calcular' },
	];

	const CreditsFromOptions = [
		{
			value: 1,
			label: 'Creditos de la matricula del programa',
		},
		{ value: 2, label: 'Creditos de Programa de postgrado' },
	];
console.log(item)
	return (
		<Modal
			title='Actualizar Reglas de Pago'
			placement='center'
			size='5xl'
			trigger={
				<IconButton colorPalette='green' size='xs'>
					<HiPencil />
				</IconButton>
			}
			onSave={handleSubmitData}
			loading={loading}
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
						<FiInfo size={24} /> Detalles de la regla
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={2} gap={4}>
							<Field
								label='Propósito de pago'
								errorText={errors.payment_purpose}
								invalid={!!errors.payment_purpose}
								required
							>
								<ReactSelect
									value={purposeRequest.payment_purpose}
									onChange={(select) => {
										setPurposeRequest({
											...purposeRequest,
											payment_purpose: select,
										});
									}}
									variant='flushed'
									size='xs'
									isDisabled={loadingPurposeOptions}
									isLoading={loadingPurposeOptions}
									isSearchable={true}
									isClearable
									name='Directores'
									options={PurposeOptions}
								/>
							</Field>
							<Field label='Tipos de proceso (seleccione 1 o más)'>
								<ReactSelect
									value={purposeRequest.process_types}
									onChange={(select) => {
										setPurposeRequest({
											...purposeRequest,
											process_types: select,
										});
									}}
									variant='flushed'
									size='xs'
									isMulti
									isSearchable={true}
									isClearable
									name='Tipos de proceso'
									options={ProcessTypesOptions}
								/>
							</Field>
							<Field
								label='Tipo de Monto'
								errorText={errors.amount_type}
								invalid={!!errors.amount_type}
								required
							>
								<ReactSelect
									value={purposeRequest.amount_type}
									variant='flushed'
									size='xs'
									isSearchable={true}
									isClearable
									onChange={(select) => {
										setPurposeRequest({
											...purposeRequest,
											amount_type: select,
										});
									}}
									name='Tipos de Monto'
									options={TypeAmountOptions}
								/>
							</Field>
							{purposeRequest.amount_type?.value === 1 && (
								<Field
									label='Monto'
									invalid={!!errors.amount}
									errorText={errors.amount}
									required
								>
									<Input
										required
										type='text'
										name='amount'
										placeholder='Monto'
										value={purposeRequest.amount}
										onChange={(e) =>
											setPurposeRequest({
												...purposeRequest,
												amount: e.target.value,
											})
										}
									/>
								</Field>
							)}
							{purposeRequest.amount_type?.value === 2 && (
								<Field
									label='Creditos a usar'
									errorText={errors.use_credits_from}
									invalid={!!errors.use_credits_from}
								>
									<ReactSelect
										value={purposeRequest.use_credits_from}
										onChange={(select) => {
											setPurposeRequest({
												...purposeRequest,
												use_credits_from: select,
											});
										}}
										variant='flushed'
										size='xs'
										isSearchable={true}
										isClearable
										name='Creditos a usar'
										options={CreditsFromOptions}
									/>
								</Field>
							)}

							<Field label='Aplicar descuento (0-100%)'>
								<Input
									required
									type='number'
									name='discount_percentage'
									placeholder='0 (Opcional)'
									value={purposeRequest.discount_percentage}
									onChange={(e) =>
										setPurposeRequest({
											...purposeRequest,
											discount_percentage: e.target.value,
										})
									}
								/>
							</Field>

							<Field marginBottom='4' label='Aplicar a estudiantes'>
								<RadioGroup
									name='requiresPreMasterExam'
									value={purposeRequest.applies_to_students ? 'true' : 'false'}
									onChange={(e) =>
										setPurposeRequest({
											...purposeRequest,
											applies_to_students: e.target.value === 'true',
										})
									}
									direction='row'
								>
									<Flex gap='5'>
										<Radio value={'true'}>Sí</Radio>
										<Radio value={'false'}>No</Radio>
									</Flex>
								</RadioGroup>
							</Field>
							<Field marginBottom='4' label='Aplicar a postulantes'>
								<RadioGroup
									name='appliesToApplicants'
									value={
										purposeRequest.applies_to_applicants ? 'true' : 'false'
									}
									onChange={(e) =>
										setPurposeRequest({
											...purposeRequest,
											applies_to_applicants: e.target.value === 'true',
										})
									}
									direction='row'
								>
									<Flex gap='5'>
										<Radio value={'true'}>Sí</Radio>
										<Radio value={'false'}>No</Radio>
									</Flex>
								</RadioGroup>
							</Field>
							<Field marginBottom='4' label='Solo primera matrícula'>
								<RadioGroup
									name='onlyFirstEnrollment'
									value={
										purposeRequest.only_first_enrollment ? 'true' : 'false'
									}
									onChange={(e) =>
										setPurposeRequest({
											...purposeRequest,
											only_first_enrollment: e.target.value === 'true',
										})
									}
									direction='row'
								>
									<Flex gap='5'>
										<Radio value={'true'}>Sí</Radio>
										<Radio value={'false'}>No</Radio>
									</Flex>
								</RadioGroup>
							</Field>
						</SimpleGrid>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

UpdatePaymentRules.propTypes = {
	fetchData: PropTypes.func,
	loadingPurposeOptions: PropTypes.bool,
	PurposeOptions: PropTypes.array,
	item: PropTypes.object,
};
