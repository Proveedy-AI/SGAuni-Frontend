import PropTypes from 'prop-types';
import { ControlledModal, toaster } from "@/components/ui";
import { Card, Stack, Button, Text, VStack, HStack } from "@chakra-ui/react";
import { FiDownload, FiCheckCircle } from "react-icons/fi";
import { useGenerateReportEnrolled } from '@/hooks/enrollments_proccess';

export const GenerateSuneduListPdfModal = ({ open, setOpen, UUIDEnrollmentProcess }) => {
  const {
    mutate: downloadSunedu, isSaving
  } = useGenerateReportEnrolled();

  const loadExcel = (data) => {
    const url = window.URL.createObjectURL(
      new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `estudiantes_matriculados_sunedu_${UUIDEnrollmentProcess}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
  };

  const handleDownload = () => {
    downloadSunedu(UUIDEnrollmentProcess, {
      onSuccess: (data) => {
				loadExcel(data);
				toaster.create({
					title: 'Descarga exitosa',
					type: 'success',
				});
				setOpen(false);
			},
			onError: (error) => {
				toaster.create({
					title:
						error.message ||
						'Error al descargar los estudiantes matriculados por SUNEDU.',
					type: 'error',
				});
			},
    });
  };

  return (
    <ControlledModal
      title="Estudiantes Matriculados SUNEDU"
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='2xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Card.Root>
          <Card.Header>
            <Text fontSize="sm" color="gray.600">
              Genera un archivo Excel con la información de estudiantes matriculados en formato SUNEDU
            </Text>
          </Card.Header>
          <Card.Body>
            <VStack spacing={6} align="center" py={8}>
              {(
                <VStack spacing={4} textAlign="center">
                  <FiCheckCircle size={48} color="#38A169" />
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    ¡Reporte generado exitosamente!
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    El archivo está listo para descargar
                  </Text>
                  <HStack spacing={3}>
                    <Button
                      bg="green.500"
                      leftIcon={<FiDownload />}
                      onClick={handleDownload}
                      size="lg"
                      isLoading={isSaving}
                    >
                      Descargar Excel
                    </Button>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </ControlledModal>
  )
};

GenerateSuneduListPdfModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  UUIDEnrollmentProcess: PropTypes.string
};
