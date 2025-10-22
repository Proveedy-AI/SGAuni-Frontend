import { ConfirmModal, SendModal, toaster, Tooltip } from '@/components/ui';
import { Box, IconButton, Span, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useCreateProgramsReview } from '@/hooks/enrollments_review_programs';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';

export const ApproveTuitionProgramsModal = ({
	permissions,
	item,
	fetchData,
}) => {
	const { mutate: createProgramsReview, isPending } = useCreateProgramsReview();
	const [open, setOpen] = useState(false);

	const handleSend = () => {
		createProgramsReview(item.id, {
			onSuccess: () => {
				toaster.create({
					title: 'Programa enviado correctamente',
					type: 'success',
				});
				fetchData();
				setOpen(false);
			},
			onError: (error) => {
				toaster.create({
					title: error.message,
					type: 'error',
				});
			},
		});
	};

	return (
		<SendModal
			placement='center'
			open={open}
			loading={isPending}
			onOpenChange={(e) => setOpen(e.open)}
			onConfirm={handleSend}
			positionerProps={{ style: { padding: 40 } }}
			trigger={
				<Box>
					<Tooltip
						content='Enviar para aprobación'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
					>
						<IconButton
							colorPalette='green'
							size='xs'
							disabled={
								item.status === 4 ||
								item.status_display === 'Pendiente' ||
								item.status_display === 'Rechazado' ||
								item.status_display === 'Aprobado'
							} // || !permissions?.includes('enrollments.myprograms.approve')}
						>
							<FiSend />
						</IconButton>
					</Tooltip>
				</Box>
			}
		>
			<Text>
				¿Estás seguro que quieres enviar a
				<Span fontWeight='semibold' px='1'>
					{item?.program_name}
				</Span>
				para aprobación de cronograma?
			</Text>
		</SendModal>
	);
};

ApproveTuitionProgramsModal.propTypes = {
	permissions: PropTypes.array,
	item: PropTypes.object,
	fetchData: PropTypes.func,
};
