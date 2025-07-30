import { Field, Button, toaster, Modal, Alert } from '@/components/ui';
import { Card, Separator, SimpleGrid, Stack, Textarea } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { FiAlertTriangle, FiInfo, FiPlus } from 'react-icons/fi';
import { useReadMyEnrollments } from '@/hooks';
import PropTypes from 'prop-types';
import { ReactSelect } from '@/components/select';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { uploadToS3 } from '@/utils/uploadToS3';
import { useCreateRequestBenefits } from '@/hooks/benefits';

export const AddMyBenefits = ({ fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const [disableUpload, setDisableUpload] = useState(false);

	const { mutate: register } = useCreateRequestBenefits();
	const { data: dataMyEnrollment } = useReadMyEnrollments(
		{},
		{ enabled: open }
	);

	const [request, setRequest] = useState({
		enrollment_period_program: null,
		justification: '',
		type: null,
		document_url: '',
	});

	const validateFields = () => {
		const newErrors = {};
		if (!request.enrollment_period_program) {
			newErrors.enrollment_period_program =
				'El periodo de matrícula es requerido.';
		}
		if (!request.justification) {
			newErrors.justification = 'La justificación es requerida.';
		}
		if (!request.type) {
			newErrors.type = 'El tipo de solicitud es requerido.';
		}
		if (!request.document_url) {
			newErrors.document_url = 'Debe adjuntar un archivo.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitData = async (e) => {
		e.preventDefault();

		if (!validateFields()) return;
		setDisableUpload(true);
		let s3Url = register.document_url;
		try {
			// Solo subir a S3 si hay un archivo nuevo
			if (request.document_url) {
				s3Url = await uploadToS3(
					request.document_url,
					'sga_uni/benefits',
					request.enrollment_period_program?.uuid.replace(/\s+/g, '_') // evita espacios
				);
			}

			const payload = {
				enrollment_period_program: request.enrollment_period_program?.value,
				justification: request.justification,
				type: request.type?.value,
				document_url: s3Url,
				status_benefit: 2, // En espera
			};

			register(payload, {
				onSuccess: () => {
					toaster.create({
						title: 'Regla creada correctamente',
						type: 'success',
					});
					setOpen(false);
					setDisableUpload(false);
					fetchData();
					setRequest({
						enrollment_period_program: null,
						justification: '',
						type: null,
						document_url: '',
					});
				},
				onError: (error) => {
					toaster.create({
						title: error.message,
						type: 'error',
					});
					setDisableUpload(false);
				},
			});
		} catch (error) {
			console.error('Error al subir el archivo:', error);
			setDisableUpload(false);
			toaster.create({
				title: 'Error al subir el contrato',
				type: 'error',
			});
		}
	};

	const EnrollmentOptions = dataMyEnrollment?.map((enrollment) => ({
		value: enrollment.enrollment_period_program,
		label: `${enrollment.program_name} - ${enrollment.program_period}`,
		uuid: enrollment.uuid,
	}));

	const TypeRequest = [
		{ value: 1, label: 'Beca' },
		{ value: 2, label: 'Semibeca' },
		{ value: 3, label: 'Descuento' },
	];

	return (
		<Modal
			title='Solicitar Beneficio y Becas'
			placement='center'
			size='5xl'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Solicitar Beneficio
				</Button>
			}
			onSave={handleSubmitData}
			loading={disableUpload}
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
						<FiInfo size={24} /> Beneficios y Becas
					</Card.Header>
					<Card.Body>
						<SimpleGrid columns={2} gap={4}>
							<Field
								label='Periodo de Matricula'
								errorText={errors.enrollment_period_program}
								invalid={!!errors.enrollment_period_program}
								required
							>
								<ReactSelect
									value={request.enrollment_period_program}
									onChange={(select) => {
										setRequest({
											...request,
											enrollment_period_program: select,
										});
									}}
									variant='flushed'
									size='xs'
									isSearchable={true}
									isClearable
									name='Periodo de Matricula'
									options={EnrollmentOptions}
								/>
							</Field>

							<Field
								label='Tipo de Beneficio'
								errorText={errors.type}
								invalid={!!errors.type}
								required
							>
								<ReactSelect
									value={request.type}
									onChange={(select) => {
										setRequest({
											...request,
											type: select,
										});
									}}
									variant='flushed'
									size='xs'
									isSearchable={true}
									isClearable
									name='Tipo de Beneficio'
									options={TypeRequest}
								/>
							</Field>
						</SimpleGrid>
						<Separator my={4} />
						<Field
							label='Justificación'
							errorText={errors.justification}
							invalid={!!errors.justification}
							required
						>
							<Textarea
								required
								type='text'
								name='justification'
								placeholder='Describa la justificación y el beneficio al que desea acceder'
								value={request.justification}
								onChange={(e) =>
									setRequest({
										...request,
										justification: e.target.value,
									})
								}
							/>
						</Field>
						<Separator my={4} />
						<Field
							label='Adjuntar documento de justificación'
							invalid={!!errors.document_url}
							errorText={errors.document_url}
							required
						>
							<CompactFileUpload
								name='path_cv'
								onChange={(file) =>
									setRequest({ ...request, document_url: file })
								}
								onClear={() => setRequest({ ...request, document_url: '' })}
							/>
						</Field>

						<Alert
							status='info'
							mt={6}
							bg='blue.50'
							border='1px solid'
							borderColor='blue.200'
							icon={<FiAlertTriangle />}
						>
							Por favor, asegúrese de que todos los campos obligatorios estén
							correctamente completados. Una vez enviada la solicitud, no será
							posible realizar modificaciones.
						</Alert>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

AddMyBenefits.propTypes = {
	fetchData: PropTypes.func,
	programTypesOptions: PropTypes.array,
	coordinatorsOptions: PropTypes.array,
	loadingProgramTypes: PropTypes.bool,
	loadingPurposeOptions: PropTypes.bool,
	ProgramFocusOptions: PropTypes.array,
	PurposeOptions: PropTypes.array,
};
