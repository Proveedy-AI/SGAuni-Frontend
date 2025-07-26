import PropTypes from "prop-types";
import { ControlledModal, toaster } from "@/components/ui";
import { useMasiveEvaluateApplicants } from "@/hooks/admissions_applicants";
import { Stack, Text } from "@chakra-ui/react";

export const ConfirmMasiveEvaluateApplicantsModal = ({ isAllEvaluated, admissionProcess, open, setOpen }) => {
  const { mutate: masiveEvaluateApplicants, isSaving } = useMasiveEvaluateApplicants();
  const handleConfirm = () => {
    // if (!isAllEvaluated) {
    //   toaster.create({
    //     title: "Postuantes no evaluados",
    //     description: "Hay postuantes que aún no han sido evaluados. Por favor, evalúelos antes de proceder.",
    //     type: "warning",
    //   });
    //   return;
    // }


    masiveEvaluateApplicants(admissionProcess?.uuid, {
      onSuccess: () => {
        toaster.create({
          title: "Evaluación masiva exitosa",
          description: "Todos los postulantes han sido evaluados correctamente.",
          type: "success",
        });
        setOpen(false);
      },
      onError: (error) => {
        toaster.create({
          title: error.message || "Error al evaluar a los estudiantes.",
          description: "Por favor, intente nuevamente más tarde.",
          type: "error",
        });
      }
    });
  };

  return (
    <ControlledModal
      title='Vista Previa de Descarga SUNEDU'
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='xl'
      onSave={handleConfirm}
      loading={isSaving}
    >
      <Stack   css={{ '--field-label-width': '140px' }}>
        <Text>¿Desea evaluar a todos los estudiantes?</Text>
      </Stack>
    </ControlledModal>
  );
}

ConfirmMasiveEvaluateApplicantsModal.propTypes = {
  isAllEvaluated: PropTypes.bool,
  admissionProcess: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};