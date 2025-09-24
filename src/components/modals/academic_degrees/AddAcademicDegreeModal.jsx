import PropTypes from 'prop-types';
import { Button, Field, Modal, toaster } from '@/components/ui';
import { useRef, useState } from 'react';
import { FiBookOpen, FiPlus } from 'react-icons/fi';
import { Card, Flex, Icon, Input, Stack } from '@chakra-ui/react';
import { ReactSelect } from '@/components/select';
import { useCreateAcademicDegreeByPerson } from '@/hooks/academic_degrees';
import { uploadToS3 } from '@/utils/uploadToS3';
import { CompactFileUpload } from '@/components/ui/CompactFileInput';

export const AddAcademicDegreeModal = ({ dataUser, fetchData, options }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const [degreeName, setDegreeName] = useState('');
	const [university, setUniversity] = useState('');
	const [typeDegree, setTypeDegree] = useState(null);
	const [file, setFile] = useState(null);

	const { mutate: register, isPending: loading } =
		useCreateAcademicDegreeByPerson();

	const [errors, setErrors] = useState({});

  const handleFileChange = (file) => {
		setFile(file);

		if (errors.path_url) {
			setErrors((prev) => ({ ...prev, path_url: '' }));
		}
	};

	const validate = () => {
		const newErrors = {};
		if (!degreeName) newErrors.degreeName = 'El nombre del título es requerido';
		if (!university)
			newErrors.university = 'El nombre de la universidad es requerido';
		if (!typeDegree) newErrors.typeDegree = 'El tipo de título es requerido';
		if (!file) newErrors.file = 'El archivo del título es requerido';

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
  }

	const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

		try {
			setIsPending(true);
			let uploadedUrl = null;

			if (file) {
					uploadedUrl = await uploadToS3(
						file,
						'sga_uni/academic_degrees',
						`${dataUser?.document_num?.replace(/\s+/g, '_') || 'degree'}_${degreeName.replace(/\s+/g, '_')}`
					);
				}

				const payload = {
					degrees: [
						{
							name: degreeName,
							university: university,
							type_degree: typeDegree?.value,
							path_url: uploadedUrl,
						},
					],
				};

				// Crear título en el servidor
				register(
					{ id: dataUser?.id, payload },
					{
						onSuccess: () => {
							toaster.create({
								title: 'Título guardado',
								description: 'El título se ha guardado correctamente',
								type: 'success',
							});
							fetchData();
							resetForm(); // Limpiar formulario después del éxito
						},
						onError: () => {
							toaster.create({
								title: 'Error',
								description: 'No se pudo guardar el título',
								type: 'error',
							});
						},
					}
				);
		} catch (err) {
			console.log(err);
			toaster.create({
				title: 'Error al subir el documento.',
				type: 'error',
			});
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Modal
			placement='center'
			size='xl'
			trigger={
				<Button
					bg='uni.secondary'
					color='white'
					size='xs'
					w={{ base: 'full', sm: 'auto' }}
				>
					<FiPlus /> Agregar Título
				</Button>
			}
			onSave={handleSubmit}
			loading={loading}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
      isPending={isPending || loading}
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
							Agregar nuevo título académico
						</Card.Title>
					</Card.Header>
					<Card.Body>
						<Flex flexDirection='column' gap={3}>
							<Field
								label='Nombre:'
								invalid={!!errors.degreeName}
								errorText={errors.degreeName}
								required
							>
								<Input
									type='text'
									value={degreeName}
									onChange={(event) => setDegreeName(event.target.value)}
								/>
							</Field>
							<Field
								label='Nombre de la universidad:'
								invalid={!!errors.university}
								errorText={errors.university}
								required
							>
								<Input
									value={university}
									onChange={(event) => setUniversity(event.target.value)}
								/>
							</Field>
							<Field
								label='Tipo de título:'
								invalid={!!errors.typeDegree}
								errorText={errors.typeDegree}
								required
							>
								<ReactSelect
									name='typeDegree'
									options={options}
									placeholder='Selecciona el tipo de título'
									value={typeDegree}
									onChange={setTypeDegree}
									isClearable
									size='sm'
								/>
							</Field>
              <Field
                label='Documento del Título'
                errorText={errors.file}
                invalid={!!errors.file}
              >
                <CompactFileUpload
                  name='degree-document'
                  accept='application/pdf,image/png,image/jpeg,image/jpg'
                  onChange={handleFileChange}
                  defaultFile={
                    typeof file === 'string'
                      ? file
                      : null
                  }
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

AddAcademicDegreeModal.propTypes = {
  dataUser: PropTypes.object.isRequired,
	fetchData: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
};
