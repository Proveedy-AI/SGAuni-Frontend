import PropTypes from "prop-types";
import { ControlledModal, toaster } from "@/components/ui";
import { Stack, Text } from "@chakra-ui/react";
import { useExportSuneduStudentExcel } from "@/hooks/admissions_programs";

export const ConfirmDownloadSuneduModal = ({ admissionProcess, open, setOpen }) => {
  const { mutate: downloadSunedu, isSaving } = useExportSuneduStudentExcel();

  const loadExcel = (data) => {
    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `estudiantes_admitidos_sunedu_${admissionProcess?.uuid}.xlsx`);
    document.body.appendChild(link);
    link.click();
  }

  const handleDownload = () => {
    downloadSunedu(admissionProcess?.uuid, {
      onSuccess: (data) => {
        loadExcel(data)
        toaster.create({
          title: "Descarga exitosa",
          type: "success",
        });
        setOpen(false);
      },
      onError: (error) => {
        toaster.create({
          title: error.message || "Error al descargar los estudiantes admitidos por SUNEDU.",
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
      size='4xl'
      onSave={handleDownload}
      loading={isSaving}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Text>¿Desea descargar los estudiantes admitidos por SUNEDU?</Text>
      </Stack>
    </ControlledModal>
  );
}

ConfirmDownloadSuneduModal.propTypes = {
  admissionProcess: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}