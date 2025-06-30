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
import { useCreateModality, useReadModalityRules } from '@/hooks';
import PropTypes from 'prop-types';
import { FiPlus } from 'react-icons/fi';

export const AddModalityForm = ({ fetchData }) => {
	const contentRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [modalityRequest, setModalityRequest] = useState({
		name: '',
		requires_pre_master_exam: false,
		requires_interview: false,
		requires_essay: false,
		description: '',
		essay_weight: 0,
		interview_weight: 0,
		min_grade: 0,
		rules_ids: [],
	});
	const { data: dataModalityRules, isLoading: loadingRules } =
		useReadModalityRules();
	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};

		if (!modalityRequest.name) newErrors.name = 'Falta nombre';
		if (!modalityRequest.description)
			newErrors.description = 'Falta descripción';
		if (
			!modalityRequest.min_grade ||
			modalityRequest.min_grade < 0 ||
			modalityRequest.min_grade > 20
		) {
			newErrors.min_grade = 'Debe estar entre 0 y 20';
		}

		if (
			modalityRequest.requires_essay &&
			(modalityRequest.essay_weight === '' ||
				modalityRequest.essay_weight < 0 ||
				modalityRequest.essay_weight > 1)
		) {
			newErrors.essay_weight = 'Debe estar entre 0 y 1';
		}

		if (
			modalityRequest.requires_interview &&
			(modalityRequest.interview_weight === '' ||
				modalityRequest.interview_weight < 0 ||
				modalityRequest.interview_weight > 1)
		) {
			newErrors.interview_weight = 'Debe estar entre 0 y 1';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const [selectedRuleIds, setSelectedRuleIds] = useState([]);

	const handleCheckboxChange = (ruleId, isChecked) => {
		setSelectedRuleIds((prev) =>
			isChecked ? [...prev, ruleId] : prev.filter((id) => id !== ruleId)
		);
	};

	const { mutate: create, isPending: loading } = useCreateModality();

	const handleSubmitData = (e) => {
		e.preventDefault();

		if (!validate()) return;

		if (selectedRuleIds.length === 0) {
			toaster.create({
				title: 'Debe seleccionar al menos una regla.',
				type: 'warning',
			});
			return;
		}

		const payload = {
			...modalityRequest,
			rules_ids: selectedRuleIds,
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
					essay_weight: 0,
					interview_weight: 0,
					min_grade: 0,
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
			title='Crear Modalidad'
			placement='center'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Crear Modalidad
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
								setModalityRequest({
									...modalityRequest,
									requires_pre_master_exam: e.target.value === 'true',
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
					<Field marginBottom='4' label='Nota mínima (0 a 20)'>
						<Input
							required
							type='number'
							name='min_grade'
							placeholder='Ingrese la nota mínima (0 a 20)'
							value={modalityRequest.min_grade}
							onChange={(e) =>
								setModalityRequest({
									...modalityRequest,
									min_grade: e.target.value,
								})
							}
							min={0}
							max={20}
							step={0.5}
						/>
					</Field>
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
							onChange={(e) => {
								const requiresEssay = e.target.value === 'true';
								setModalityRequest({
									...modalityRequest,
									requires_essay: requiresEssay,
									essay_weight: requiresEssay
										? modalityRequest.essay_weight
										: 0, // set 0 when "No"
								});
							}}
							direction='row'
						>
							<Flex gap='5'>
								<Radio value={'true'}>Sí</Radio>
								<Radio value={'false'}>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>
					{modalityRequest.requires_essay && (
						<Field label='Peso del ensayo (0 a 100)'>
							<Input
								required
								type='number'
								name='essay_weight'
								placeholder='Ej: 0.5'
								value={modalityRequest.essay_weight}
								onChange={(e) =>
									setModalityRequest({
										...modalityRequest,
										essay_weight: e.target.value,
									})
								}
								min={0}
								max={1}
								step={0.01}
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
					<Field label='Requiere entrevista personal'>
						<RadioGroup
							name='requiresInterview'
							value={modalityRequest.requires_interview ? 'true' : 'false'}
							onChange={(e) => {
								const requiresInterview = e.target.value === 'true';
								setModalityRequest({
									...modalityRequest,
									requires_interview: requiresInterview,
									interview_weight: requiresInterview
										? modalityRequest.interview_weight
										: 0, // set 0 when "No"
								});
							}}
							direction='row'
						>
							<Flex gap='5'>
								<Radio value={'true'}>Sí</Radio>
								<Radio value={'false'}>No</Radio>
							</Flex>
						</RadioGroup>
					</Field>
					{modalityRequest.requires_interview && (
						<Field label='Peso de la entrevista (0 a 100)'>
							<Input
								required
								type='number'
								name='interview_weight'
								value={modalityRequest.interview_weight}
								onChange={(e) =>
									setModalityRequest({
										...modalityRequest,
										interview_weight: e.target.value,
									})
								}
								placeholder='Ej: 0.5'
								min={0}
								max={1}
								step={0.01}
							/>
						</Field>
					)}
				</Flex>
				<Field label='Reglas'>
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
