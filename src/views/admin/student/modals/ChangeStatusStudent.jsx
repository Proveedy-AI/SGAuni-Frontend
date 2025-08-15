import { ModalSimple, toaster } from '@/components/ui';
import { Box, Button, Stack, Text, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCheck } from 'react-icons/fa';
import { useUpdateStudent } from '@/hooks/students';

export const ChangeStatusStudent = ({
	statusEnumSelected,
	refetchStudent,
	newStatus,
  studentId
}) => {
	const [open, setOpen] = useState(false);

	const { mutateAsync: updateStudentStatus, isPending } = useUpdateStudent();

	const handleChangeStatus = async () => {
		updateStudentStatus(
			{
				id: studentId, // <-- este ID debe venir de tus props o estado
				payload: { status: newStatus },
			},
			{
				onSuccess: () => {
					toaster.create({
						title: `Estado cambiado a ${newStatus === 1 ? 'Activo' : 'Suspendido'}`,
						type: 'success',
					});
					setOpen(false);
					refetchStudent();
				},
				onError: (error) => {
					toaster.create({
						title: error?.message || 'Error al cambiar el estado',
						type: 'error',
					});
				},
			}
		);
	};

	return (
		<ModalSimple
			trigger={
				<Button
					colorPalette={
						newStatus === 1
							? statusEnumSelected?.id === 1
								? 'green'
								: 'gray'
							: statusEnumSelected?.id === 2
								? 'red'
								: 'gray'
					}
					variant={statusEnumSelected?.id === newStatus ? 'solid' : 'outline'}
					size='sm'
					onClick={() => setOpen(true)}
				>
					{statusEnumSelected?.id === newStatus && (
						<Box as={statusEnumSelected.icon} w={4} h={4} mr={1} />
					)}
					{newStatus === 1 ? 'Activo' : 'Suspendido'}
				</Button>
			}
			title='Confirmar cambio de estado'
			placement='center'
			size='lg'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			hiddenFooter={true}
		>
			<Stack gap={4}>
				<Text fontSize='md'>
					¿Estás seguro de que deseas cambiar el estado del estudiante a{' '}
					<strong>{newStatus === 1 ? 'Activo' : 'Suspendido'}</strong>?
				</Text>

				<Flex justify='flex-end' gap={2} mt={2}>
					<Button
						variant='outline'
						coloprPalette='gray'
						size='sm'
						onClick={() => setOpen(false)}
					>
						Cancelar
					</Button>
					<Button
						colorPalette={'green'}
						disabled={
							newStatus === 1
								? statusEnumSelected?.id === 1
									? true
									: false
								: statusEnumSelected?.id === 2
									? true
									: false
						}
						variant='solid'
						loading={isPending}
						size='sm'
						onClick={handleChangeStatus}
					>
						<FaCheck />
						Confirmar
					</Button>
				</Flex>
			</Stack>
		</ModalSimple>
	);
};

ChangeStatusStudent.propTypes = {
	statusEnumSelected: PropTypes.object,
	refetchStudent: PropTypes.func,
	newStatus: PropTypes.number, // 1 = activo, 2 = suspendido
	studentId: PropTypes.string,
};
