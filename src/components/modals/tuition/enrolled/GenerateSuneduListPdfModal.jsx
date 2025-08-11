import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { ControlledModal, toaster } from "@/components/ui";
import { Card, Stack, Button, Text, Spinner, VStack, HStack } from "@chakra-ui/react";
import { FiDownload, FiPlay, FiCheckCircle } from "react-icons/fi";
import { useGenerateReportEnrolled } from '@/hooks/enrollments_proccess';

export const GenerateSuneduListPdfModal = ({ open, setOpen, UUIDEnrollmentProcess }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Reiniciar estados cuando se abre el modal
  useEffect(() => {
    if (open) {
      setIsGenerating(false);
      setReportGenerated(false);
    }
  }, [open]);

  
  const {
    data: reportData,
    error: reportError,
    refetch: generateReport
  } = useGenerateReportEnrolled(
    UUIDEnrollmentProcess,
    {},
    { 
      enabled: false, // No ejecutar automáticamente
      onSuccess: () => {
        setReportGenerated(true);
        setIsGenerating(false);
        toaster.create({
          title: 'Reporte generado exitosamente',
          description: 'El archivo está listo para descargar',
          type: 'success',
        });
      },
      onError: (error) => {
        setIsGenerating(false);
        toaster.create({
          title: 'Error al generar reporte',
          description: error.message || 'Ocurrió un error inesperado',
          type: 'error',
        });
      }
    }
  );
  
  console.log(reportData);

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
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportGenerated(false);
    generateReport();
  };

  useEffect(() => {
    if (isGenerating && reportData) {
      setIsGenerating(false);
      setReportGenerated(true);
    }
  }, [isGenerating, reportData]);

  const handleDownload = () => {
    if (reportData) {
      loadExcel(reportData);
      toaster.create({
        title: 'Descarga iniciada',
        description: 'El archivo se está descargando',
        type: 'success',
      });
    }
  };

  const handleClose = () => {
    setIsGenerating(false);
    setReportGenerated(false);
    setOpen(false);
  };

  return (
    <ControlledModal
      title="Estudiantes Matriculados SUNEDU"
      placement='center'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='4xl'
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '140px' }}>
        <Card.Root py={4}>
          <Card.Header>
            <Card.Title>Generar lista de estudiantes matriculados</Card.Title>
            <Text fontSize="sm" color="gray.600">
              Genera un archivo Excel con la información de estudiantes matriculados en formato SUNEDU
            </Text>
          </Card.Header>
          <Card.Body>
            <VStack spacing={6} align="center" py={8}>
              {!isGenerating && !reportGenerated && (
                <VStack spacing={4} textAlign="center">
                  <Text fontSize="md" color="gray.700">
                    Haz clic en el botón para generar el reporte de estudiantes matriculados
                  </Text>
                  <Button
                    bg="blue.500"
                    leftIcon={<FiPlay />}
                    onClick={handleGenerateReport}
                    size="lg"
                    isDisabled={!UUIDEnrollmentProcess}
                  >
                    Generar Reporte
                  </Button>
                </VStack>
              )}

              {isGenerating && (
                <VStack spacing={4} textAlign="center">
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <Text fontSize="md" fontWeight="medium">
                    Generando reporte...
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Por favor espera mientras se procesa la información
                  </Text>
                </VStack>
              )}

              {reportGenerated && reportData && (
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
                    >
                      Descargar Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      size="lg"
                    >
                      Cerrar
                    </Button>
                  </HStack>
                </VStack>
              )}

              {reportError && !isGenerating && (
                <VStack spacing={4} textAlign="center">
                  <Text fontSize="lg" color="red.500" fontWeight="medium">
                    Error al generar el reporte
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {reportError.message || 'Ocurrió un error inesperado'}
                  </Text>
                  <HStack spacing={3}>
                    <Button
                      bg="blue.500"
                      onClick={handleGenerateReport}
                      size="md"
                    >
                      Reintentar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      size="md"
                    >
                      Cerrar
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
