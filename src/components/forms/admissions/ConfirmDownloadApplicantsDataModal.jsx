import PropTypes from 'prop-types';
import { ControlledModal } from "@/components/ui";
import { Stack, Text } from '@chakra-ui/react';

export const ConfirmDownloadApplicantsDataModal = ({ dataProgram, open, setOpen }) => {
  //const { mutate: downloadApplicantsData, isSaving } = useExportApplicantsExcel();
  
    const loadExcel = (data) => {
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `estudiantes_admitidos_sunedu_${dataProgram?.uuid}.xlsx`);
      document.body.appendChild(link);
      link.click();
    }
  
    const handleDownload = () => {
      // downloadApplicantsData(dataProgram?.uuid, {
      //   onSuccess: (data) => {
      //     loadExcel(data)
      //     toaster.create({
      //       title: "Descarga exitosa",
      //       type: "success",
      //     });
      //     setOpen(false);
      //   },
      //   onError: (error) => {
      //     toaster.create({
      //       title: error.message || "Error al descargar los estudiantes admitidos por SUNEDU.",
      //       type: "error",
      //     });
      //   }
      // });
    };
    
    return (
      <ControlledModal
        title='Vista Previa de Descarga de fichas de postulantes'
        placement='center'
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size='4xl'
        onSave={handleDownload}
        //loading={isSaving}
      >
        <Stack css={{ '--field-label-width': '140px' }}>
          <Text>¿Desea descargar la ficha de postulantes?</Text>
        </Stack>
      </ControlledModal>
    );
  }
  
  ConfirmDownloadApplicantsDataModal.propTypes = {
    dataProgram: PropTypes.object,
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
  }