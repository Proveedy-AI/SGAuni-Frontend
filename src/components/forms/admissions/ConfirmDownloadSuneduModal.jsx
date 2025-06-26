import PropTypes from "prop-types";
import { ControlledModal } from "@/components/ui";
import { Stack, Text } from "@chakra-ui/react";

export const ConfirmDownloadSuneduModal = ({ open, setOpen }) => {

  //const { mutate: downloadSunedu, isSaving } = useExportSuneduStudentExcel();

  const handleDownload = () => {
    // downloadSunedu();
    //setOpen(false);
    console.log("Descargando estudiantes admitidos por SUNEDU...");
    setTimeout(() => {
      console.log("Descarga completada.");
      setOpen(false);
    }, 1500);
  };
  
  return (
    <ControlledModal
      title='Vista Previa de Descarga SUNEDU'
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='4xl'
      onSave={handleDownload}
      //loading={isSaving}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Text>¿Desea descargar los estudiantes admitidos por SUNEDU?</Text>
      </Stack>
    </ControlledModal>
  );
}

ConfirmDownloadSuneduModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}