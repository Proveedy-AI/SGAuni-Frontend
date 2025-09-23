import {
	Field,
	Button,
	Radio,
	RadioGroup,
	toaster,
	Modal,
	Checkbox,
} from '@/components/ui';
import { Flex, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
	useCreateModality,
	useReadModalityRules,
	useReadProgramTypes,
} from '@/hooks';
import PropTypes from 'prop-types';
import { FiPlus } from 'react-icons/fi';
import { ReactSelect } from '@/components/select';

export const AddModalityForm = ({ fetchData }) => {
	const contentRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [selectedRuleIds, setSelectedRuleIds] = useState([]);
	const [modalityRequest, setModalityRequest] = useState({
		name: '',
		requires_pre_master_exam: false,
		requires_interview: false,
		requires_essay: false,
		description: '',
		pre_master_min_grade: '',
		rules_ids: [],
		postgraduate_type: '',
		code: '',
	});
	const { data: dataModalityRules, isLoading: loadingRules } =
		useReadModalityRules();
	const [errors, setErrors] = useState({});

	const { data: dataProgramTypes, isLoading: loadingProgramTypes } =
		useReadProgramTypes({}, { enabled: open });

	const programTypesOptions = dataProgramTypes?.results?.map((item) => ({
		value: item.id.toString(),
		label: item.name,
	}));

	const validate = () => {
		const newErrors = {};

		if (!modalityRequest.name) newErrors.name = 'El nombre es obligatorio';
		if (!modalityRequest.description)
			newErrors.description = 'Falta descripción';
		if (
			(modalityRequest.requires_pre_master_exam &&
				!modalityRequest.pre_master_min_grade) ||
			modalityRequest.pre_master_min_grade < 0 ||
			modalityRequest.pre_master_min_grade > 20
		) {
			newErrors.pre_master_min_grade = 'Debe estar entre 0 y 20';
		}
		if (!modalityRequest.postgraduate_type)
			newErrors.postgraduate_type = 'Seleccione un tipo de programa';
		if (!selectedRuleIds || selectedRuleIds.length === 0)
			newErrors.rules_ids = 'Seleccione al menos una regla';
		if (!modalityRequest.code) newErrors.code = 'El código es obligatorio';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleCheckboxChange = (ruleId, isChecked) => {
		setSelectedRuleIds((prev) =>
			isChecked ? [...prev, ruleId] : prev.filter((id) => id !== ruleId)
		);
	};

	const { mutate: create, isPending: loading } = useCreateModality();

	const handleChange = (field, value) => {
		const boolValue = value === 'true';

		let updatedRequest = { ...modalityRequest, [field]: boolValue };

		if (field === 'requires_pre_master_exam' && boolValue) {
			// Desactiva ensayo e entrevista
			updatedRequest.requires_essay = false;
			updatedRequest.requires_interview = false;
		}
		if (
			(field === 'requires_essay' || field === 'requires_interview') &&
			boolValue
		) {
			// Desactiva pre-maestría
			updatedRequest.requires_pre_master_exam = false;
			updatedRequest.pre_master_min_grade = '';
		}

		setModalityRequest(updatedRequest);
	};

	const handleSubmitData = (e) => {
		e.preventDefault();

		if (!validate()) return;

		const payload = {
			...modalityRequest,
			rules_ids: selectedRuleIds,
			postgraduate_type: Number(modalityRequest.postgraduate_type.value),
		};

		create(payload, {
			onSuccess: () => {
				toaster.create({
					title: 'Modalidad registrada correctamente',
					type: 'success',
				});
				setOpen(false);
				fetchData();
				setModalityRequest({
					name: '',
					requires_pre_master_exam: false,
					requires_interview: false,
					requires_essay: false,
					description: '',
					postgraduate_type: null,
					pre_master_min_grade: 0,
					code: '',
				});
				setSelectedRuleIds([]);
			},
			onError: (error) => {
				toaster.create({
					title: error?.message || 'Error al crear la modalidad',
					type: 'error',
				});
			},
		});
	};

	return (
		<Modal
			title='Crear Modalidad de Admisión'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Crear Modalidad de Admisión
				</Button>
			}
			onSave={handleSubmitData}
			loading={loading}
			open={open}
			size={{ base: 'full', sm: '2xl' }}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '120px' }}>
				<Field
					label='Nombre de la modalidad'
					invalid={!!errors.name}
					errorText={errors.name}
				>
					<Input
						required
						type='text'
						name='name'
						placeholder='Ingrese nombres de la modalidad'
						value={modalityRequest.name}
						onChange={(e) =>
							setModalityRequest({ ...modalityRequest, name: e.target.value })
						}
					/>
				</Field>
				<Field label='Código' invalid={!!errors.code} errorText={errors.code}>
					<Input
						required
						type='text'
						name='code'
						placeholder='Ingrese el código de la modalidad'
						value={modalityRequest.code}
						onChange={(e) =>
							setModalityRequest({ ...modalityRequest, code: e.target.value })
						}
					/>
				</Field>
				<Field
					label='Descripción'
					invalid={!!errors.description}
					errorText={errors.description}
				>
					<Input
						required
						type='text'
						name='description'
						placeholder='Descripción de la modalidad'
						value={modalityRequest.description}
						onChange={(e) =>
							setModalityRequest({
								...modalityRequest,
								description: e.target.value,
							})
						}
					/>
				</Field>
				<Field
					label='¿Para qué tipo de programa es?'
					errorText={errors.postgraduate_type}
					invalid={!!errors.postgraduate_type}
					required
				>
					<ReactSelect
						value={modalityRequest.postgraduate_type}
						variant='flushed'
						size='xs'
						isSearchable
						options={programTypesOptions}
						isDisabled={loadingProgramTypes}
						isLoading={loadingProgramTypes}
						isClearable
						name='Tipo de Programa'
						onChange={(select) =>
							setModalityRequest({
								...modalityRequest,
								postgraduate_type: select,
							})
						}
					/>
				</Field>
				<Flex
					marginBottom='4'
					alignItems='start'
					direction={{ base: 'column', sm: 'row' }}
					gap={4}
				>
					<Field marginBottom='4' label='Requiere pre-maestría'>
						<RadioGroup
							name='requiresPreMasterExam'
							value={
								modalityRequest.requires_pre_master_exam ? 'true' : 'false'
							}
							onChange={(e) =>
								handleChange('requires_pre_master_exam', e.target.value)
							}
							direction='row'
						>
							<Flex gap='5'>
								<Radio value={'true'}>Sí</Radio>
								<Radio value={'false'}>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>
					{modalityRequest.requires_pre_master_exam && (
						<Field
							marginBottom='4'
							label='Nota mínima aprobatoria pre-maestría (0 a 20)'
							invalid={!!errors.pre_master_min_grade}
							errorText={errors.pre_master_min_grade}
						>
							<Input
								required
								type='number'
								name='pre_master_min_grade'
								placeholder='Ingrese la nota mínima (0 a 20)'
								value={modalityRequest.pre_master_min_grade}
								onChange={(e) =>
									setModalityRequest({
										...modalityRequest,
										pre_master_min_grade: e.target.value,
									})
								}
								min={0}
								max={20}
								step={0.5}
							/>
						</Field>
					)}
				</Flex>
				<Flex
					marginBottom='4'
					alignItems='start'
					direction={{ base: 'column', sm: 'row' }}
					gap={4}
				>
					<Field label='Requiere ensayo'>
						<RadioGroup
							name='requiresEssay'
							value={modalityRequest.requires_essay ? 'true' : 'false'}
							onChange={(e) => handleChange('requires_essay', e.target.value)}
							direction='row'
						>
							<Flex gap='5'>
								<Radio value={'true'}>Sí</Radio>
								<Radio value={'false'}>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>
					<Field label='Requiere entrevista personal'>
						<RadioGroup
							name='requiresInterview'
							value={modalityRequest.requires_interview ? 'true' : 'false'}
							onChange={(e) =>
								handleChange('requires_interview', e.target.value)
							}
							direction='row'
						>
							<Flex gap='5'>
								<Radio value={'true'}>Sí</Radio>
								<Radio value={'false'}>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>
				</Flex>

				<Field
					label='Reglas'
					errorText={errors.rules_ids}
					invalid={!!errors.rules_ids}
					required
				>
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} columnGap={8}>
						{!loadingRules &&
							dataModalityRules?.results?.map((rule) => (
								<Field key={rule.id} orientation='horizontal'>
									<Checkbox
										checked={selectedRuleIds.includes(rule.id)}
										onChange={(e) =>
											handleCheckboxChange(rule.id, e.target.checked)
										}
									>
										{rule.field_name}
									</Checkbox>
								</Field>
							))}
					</SimpleGrid>
				</Field>
			</Stack>
		</Modal>
	);
};

AddModalityForm.propTypes = {
	fetchData: PropTypes.func,
};
