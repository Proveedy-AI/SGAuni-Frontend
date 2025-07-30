import PropTypes from 'prop-types';
import { ControlledModal, toaster } from '@/components/ui';
import { useMasiveEvaluateApplicants } from '@/hooks/admissions_applicants';
import { Stack, Text } from '@chakra-ui/react';

export const ConfirmMasiveEvaluateApplicantsModal = ({
	isAllEvaluated,
	uuid,
	open,
	setOpen,
}) => {
	const { mutate: masiveEvaluateApplicants, isPending } =
		useMasiveEvaluateApplicants();

	const handleConfirm = () => {
		if (!isAllEvaluated) {
			toaster.create({
				title: 'Postuantes no evaluados',
				description:
					'Hay postuantes que aún no han sido evaluados. Por favor, evalúelos antes de proceder.',
				type: 'warning',
			});
			return;
		}

		masiveEvaluateApplicants(uuid, {
			onSuccess: () => {
				toaster.create({
					title: 'Evaluación masiva exitosa',
					description:
						'Todos los estudiantes han sido evaluados correctamente.',
					type: 'success',
				});
				setOpen(false);
			},
			onError: (error) => {
				toaster.create({
					title: error.message || 'Error al evaluar a los estudiantes.',
					description: 'Por favor, intente nuevamente más tarde.',
					type: 'error',
				});
			},
		});
	};

	return (
		<ControlledModal
			title='Evaluar a todos los estudiantes'
			placement='center'
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='xl'
			onSave={handleConfirm}
			loading={isPending}
		>
			<Stack css={{ '--field-label-width': '140px' }}>
				<Text>
					Esta acción evaluará automáticamente a todos los estudiantes. Aquellos
					que obtengan una calificación aprobatoria serán marcados como
					ingresantes.
				</Text>
			</Stack>
		</ControlledModal>
	);
};

ConfirmMasiveEvaluateApplicantsModal.propTypes = {
	isAllEvaluated: PropTypes.bool,
	uuid: PropTypes.string,
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
