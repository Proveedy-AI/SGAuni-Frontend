import { Modal, Tooltip, Field, toaster } from '@/components/ui';
import {
	Box,
	IconButton,
	Input,
	Stack,
	Card,
	Flex,
	Icon,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { FiEdit, FiBookOpen } from 'react-icons/fi';
import { uploadToS3 } from '@/utils/uploadToS3';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { useUpdateAcademicDegree } from '@/hooks/academic_degrees';
import { ReactSelect } from '@/components/select';

export const UpdateAcademicDegreeModal = ({ item, options, fetchData }) => {
	const contentRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [errors, setErrors] = useState({});

	const { mutate: update, isPending: isUpdating } = useUpdateAcademicDegree();

	const [degreeName, setDegreeName] = useState('');
	const [university, setUniversity] = useState('');
	const [typeDegree, setTypeDegree] = useState(null);
	const [file, setFile] = useState(null);

	// Inicializar valores cuando se abre el modal o cambia el item
	useEffect(() => {
		if (open && item) {
			setDegreeName(item.name || '');
			setUniversity(item.university || '');
			setTypeDegree(
				options.find((opt) => opt.value === item.type_degree) || null
			);
			setFile(item.path_url || null);
			setErrors({});
		}
	}, [open, item, options]);

	const handleFileChange = (file) => {
		setFile(file);
		if (errors.file) {
			setErrors((prev) => ({ ...prev, file: '' }));
		}
	};

	const validateFields = () => {
		const newErrors = {};

		if (!degreeName.trim()) newErrors.degreeName = 'El nombre del título es requerido';

		if (!university.trim()) newErrors.university = 'El nombre de la universidad es requerido';

		if (!typeDegree) newErrors.typeDegree = 'El tipo de título es requerido';

		if (!file) newErrors.file = 'El archivo es necesario';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const resetForm = () => {
		setDegreeName('');
		setUniversity('');
		setTypeDegree(null);
		setFile(null);
		setErrors({});
		setOpen(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateFields()) return;

		try {
			setIsPending(true);
			let uploadedUrl = item.path_url; // Mantener la URL existente por defecto

			// Solo subir a S3 si el archivo cambió (es un File y no una string URL)
			if (file && file instanceof File) {
				uploadedUrl = await uploadToS3(
					file,
					'sga_uni/academic_degrees',
					`${item?.id || 'degree'}_${degreeName.replace(/\s+/g, '_')}`
				);
			}

			const payload = {
				name: degreeName.trim(),
				university: university.trim(),
				type_degree: typeDegree.value,
				path_url: uploadedUrl,
			};

			// Actualizar título en el servidor
			update(
				{ id: item.id, payload },
				{
					onSuccess: () => {
						toaster.create({
							title: 'Título actualizado',
							description: 'El título se ha actualizado correctamente',
							type: 'success',
						});
						fetchData(); // Recargar datos
						resetForm(); // Limpiar formulario
					},
					onError: (error) => {
						toaster.create({
							title: 'Error',
							description: error.message || 'No se pudo actualizar el título',
							type: 'error',
						});
					},
				}
			);
		} catch (err) {
			console.error(err);
			toaster.create({
				title: 'Error al procesar el archivo.',
				type: 'error',
			});
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Modal
			title='Actualizar Título Académico'
			placement='center'
			size='4xl'
			trigger={
				<Box>
					<Tooltip
						content='Actualizar Título Académico'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton colorPalette='yellow' size='xs'>
							<FiEdit />
						</IconButton>
					</Tooltip>
				</Box>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			onSave={handleSubmit}
			loading={isPending || isUpdating}
			contentRef={contentRef}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '65vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<Card.Root>
					<Card.Header>
						<Card.Title
							display='flex'
							alignItems='center'
							gap={2}
							fontSize='lg'
						>
							<Icon as={FiBookOpen} boxSize={5} color='blue.600' />
							Editar información del título académico
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Flex flexDirection='column' gap={3}>
							<Field
								label='Nombre del Título:'
								invalid={!!errors.degreeName}
								errorText={errors.degreeName}
								required
							>
								<Input
									type='text'
									value={degreeName}
									onChange={(e) => setDegreeName(e.target.value)}
									placeholder='Ej: Licenciado en Ingeniería Civil'
								/>
							</Field>

							<Field
								label='Nombre de la Universidad:'
								invalid={!!errors.university}
								errorText={errors.university}
								required
							>
								<Input
									type='text'
									value={university}
									onChange={(e) => setUniversity(e.target.value)}
									placeholder='Ej: Universidad Nacional de Ingeniería'
								/>
							</Field>

							<Field
								label='Tipo de Título:'
								invalid={!!errors.typeDegree}
								errorText={errors.typeDegree}
								required
							>
								<ReactSelect
									name='typeDegree'
									options={options}
									placeholder='Selecciona el tipo de título'
									value={typeDegree}
									onChange={(selected) => setTypeDegree(selected)}
									isClearable
									size='sm'
								/>
							</Field>

							<Field
								label='Documento del Título:'
								invalid={!!errors.file}
								errorText={errors.file}
							>
								<CompactFileUpload
									name='degree-document'
									accept='application/pdf,image/png,image/jpeg,image/jpg'
									onChange={handleFileChange}
									defaultFile={typeof file === 'string' ? file : null}
									onClear={() => handleFileChange(null)}
									placeholder='Seleccionar documento del título'
								/>
							</Field>
						</Flex>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

UpdateAcademicDegreeModal.propTypes = {
	item: PropTypes.object.isRequired,
	options: PropTypes.array.isRequired,
	fetchData: PropTypes.func.isRequired,
};
