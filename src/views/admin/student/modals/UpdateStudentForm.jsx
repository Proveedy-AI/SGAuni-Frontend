import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { IconButton, Input, Stack } from '@chakra-ui/react';
import { Field, Modal, toaster } from '@/components/ui';
import { FiEdit2 } from 'react-icons/fi';
import { useUpdateStudent } from '@/hooks/students';

export const UpdateStudentForm = ({ data, fetchData }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const [code, setCode] = useState(data?.student_code);

	const { mutate: updateStudent, isPending: loadingUpdateStudent } =
		useUpdateStudent();

	const handleSubmitData = async (e) => {
		e.preventDefault();

		updateStudent(
			{
				id: data.id,
				payload: {
					student_code: code,
				},
			},
			{
				onSuccess: () => {
					toaster.create({
						title: 'Perfil y código de estudiante actualizados.',
						type: 'success',
					});
					fetchData();
					setOpen(false);
				},
				onError: () => {
					toaster.create({
						title: 'Error al actualizar el código de estudiante.',
						type: 'error',
					});
				},
			}
		);
	};

	return (
		<Modal
			title='Editar propiedades'
			placement='center'
			trigger={
				<IconButton colorPalette='cyan' variant='ghost' px={2} size='xs'>
					<FiEdit2 /> Editar código
				</IconButton>
			}
			onSave={handleSubmitData}
			loading={loadingUpdateStudent}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			contentRef={contentRef}
		>
			<Stack css={{ '--field-label-width': '150px' }}>
				<Field label='Código Estudiante:'>
					<Input
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder='Ingresar código'
						size='xs'
					/>
				</Field>
			</Stack>
		</Modal>
	);
};

UpdateStudentForm.propTypes = {
	data: PropTypes.object,
	fetchData: PropTypes.func,
};
