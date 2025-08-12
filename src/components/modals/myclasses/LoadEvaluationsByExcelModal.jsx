import PropTypes from 'prop-types';
import { Button, Field, Modal, toaster, Checkbox } from "@/components/ui";
import { CompactFileUpload } from '@/components/ui/CompactFileInput';
import { useState } from "react";
import { Alert, Box, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { FiDownload, FiFileText, FiUpload, FiAlertTriangle } from 'react-icons/fi';
import { 
  useReadExcelTemplate, 
  useUploadEvaluationsByExcel 
} from '@/hooks/evaluations';
import { uploadToS3 } from '@/utils/uploadToS3';

export const LoadEvaluationsByExcelModal = ({ dataCourseGroup, fetchData }) => {
  const [open, setOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [acceptedWarning, setAcceptedWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: generateTemplate, isPending: loadingTemplate } = useReadExcelTemplate();
  const { mutate: uploadEvaluations, isPending: loadingUpload } = useUploadEvaluationsByExcel();

  const handleDownloadTemplate = () => {
    if (!dataCourseGroup?.id) {
      toaster.create({
        title: 'Error',
        description: 'No se pudo identificar el grupo de curso',
        type: 'error',
      });
      return;
    }

    generateTemplate(
      dataCourseGroup?.id,
      {
        onSuccess: (data) => {
          // Crear blob desde la respuesta de la API
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          
          // Crear URL temporal y descargar
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `plantilla_evaluaciones_${dataCourseGroup.course_code || 'curso'}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toaster.create({
            title: 'Descarga completa',
            description: 'La plantilla de evaluaciones se descargó correctamente',
            type: 'success',
          });
        },
        onError: (error) => {
          toaster.create({
            title: 'Error al descargar',
            description: error.message || 'No se pudo descargar la plantilla',
            type: 'error',
          });
        }
      }
    );
  };

  const handleUploadEvaluations = async () => {
    if (!acceptedWarning) {
      toaster.create({
        title: 'Confirmación requerida',
        description: 'Debe aceptar la advertencia antes de continuar',
        type: 'warning',
      });
      return;
    }

    if (!excelFile) {
      toaster.create({
        title: 'Archivo requerido',
        description: 'Seleccione un archivo Excel con las evaluaciones',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    try {
      let fileUrl = excelFile;

      // Subir a S3 si es un archivo nuevo
      if (excelFile instanceof File) {
        fileUrl = await uploadToS3(
          excelFile,
          'sga_uni/evaluations/uploads',
          'evaluaciones_excel'
        );
      }

      if (!fileUrl) {
        throw new Error('Error al subir el archivo');
      }

      const payload = {
        courseGroupId: dataCourseGroup.id,
        excel_url: fileUrl
      };

      uploadEvaluations(payload, {
        onSuccess: () => {
          toaster.create({
            title: 'Evaluaciones cargadas',
            description: 'Las evaluaciones del Excel han sido procesadas correctamente',
            type: 'success',
          });
          setOpen(false);
          setExcelFile(null);
          setAcceptedWarning(false);
          if (fetchData) fetchData();
        },
        onError: (error) => {
          toaster.create({
            title: 'Error al procesar',
            description: error.message || 'No se pudieron cargar las evaluaciones',
            type: 'error',
          });
        }
      });
    } catch (error) {
      toaster.create({
        title: 'Error inesperado',
        description: error.message || 'No se pudo completar la operación',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setExcelFile(null);
    setAcceptedWarning(false);
  };

  const isUploadDisabled = !excelFile || !acceptedWarning || isLoading || loadingUpload;

  return (
    <Modal
      trigger={
        <Button
          overflow='hidden'
          borderColor='uni.secondary'
          color='uni.secondary'
          variant='outline'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
        >
          <FiUpload /> Subir notas con excel
        </Button>
      }
      title='Cargar Evaluaciones desde Excel'
      placement='center'
      size='3xl'
      loading={isLoading || loadingUpload}
      disabledSave={isUploadDisabled}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      onSave={handleUploadEvaluations}
      onClose={handleCloseModal}
    >
      <Stack gap={5}>
        {/* Sección de descarga de plantilla */}
        <Box
          bg='blue.50'
          p={4}
          w={'full'}
          borderRadius='lg'
          border='1px solid'
          borderColor='blue.200'
        >
          <HStack justify='space-between' align='center'>
            <HStack gap={3}>
              <Box
                w={8}
                h={8}
                bg='blue.100'
                borderRadius='full'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <FiFileText color='blue.600' size={16} />
              </Box>
              <Box>
                <Text fontSize='sm' fontWeight='medium' color='blue.800'>
                  Plantilla de evaluaciones
                </Text>
                <Text fontSize='xs' color='blue.600'>
                  Descarga la plantilla con los estudiantes del curso
                </Text>
              </Box>
            </HStack>

            <Button
              colorScheme='blue'
              variant='solid'
              onClick={handleDownloadTemplate}
              isLoading={loadingTemplate}
              borderRadius='lg'
              size='sm'
            >
              <FiDownload /> Descargar plantilla
            </Button>
          </HStack>
        </Box>

        {/* Alerta de advertencia */}
        <Alert.Root status='warning' variant='subtle' borderRadius='lg'>
          <Alert.Indicator>
            <FiAlertTriangle />
          </Alert.Indicator>
          <Alert.Title>¡Advertencia Importante!</Alert.Title>
          <Alert.Description>
            <VStack align='start' spacing={2} mt={2}>
              <Text>
                • Las evaluaciones cargadas desde Excel <strong>sobrescribirán</strong> todas las notas 
                que hayan sido ingresadas manualmente.
              </Text>
              <Text>
                • Esta acción no se puede deshacer una vez completada.
              </Text>
              <Text>
                • Asegúrese de que el archivo Excel contiene las evaluaciones correctas antes de proceder.
              </Text>
            </VStack>
          </Alert.Description>
        </Alert.Root>

        {/* Checkbox de confirmación */}
        <Box
          bg='orange.50'
          p={4}
          borderRadius='lg'
          border='1px solid'
          borderColor='orange.200'
        >
          <Checkbox
            checked={acceptedWarning}
            onChange={(e) => setAcceptedWarning(e.target.checked)}
          >
            <Text fontSize='sm' fontWeight='medium' color='orange.800'>
              He leído y entiendo que las notas del Excel sobrescribirán las notas manuales existentes
            </Text>
          </Checkbox>
        </Box>

        {/* Campo de carga de archivo */}
        <Stack spacing={4} w='full'>
          <Field
            orientation={{ base: 'vertical', sm: 'horizontal' }}
            label='Archivo Excel con evaluaciones:'
            required
          >
            <CompactFileUpload
              name='excel_evaluations'
              accept='.xlsx,.xls'
              onChange={(file) => setExcelFile(file)}
              onClear={() => setExcelFile(null)}
              disabled={!acceptedWarning}
            />
          </Field>
        </Stack>

        {/* Información adicional */}
        <Alert.Root status='info' variant='subtle' borderRadius='lg'>
          <Alert.Indicator />
          <Alert.Title>Requisitos del archivo:</Alert.Title>
          <Alert.Description>
            <VStack align='start' spacing={1} mt={2}>
              <Text fontSize='sm'>• Formato requerido: .xlsx o .xls</Text>
              <Text fontSize='sm'>• Use la plantilla descargada como base</Text>
              <Text fontSize='sm'>• No modifique las columnas de identificación</Text>
              <Text fontSize='sm'>• Ingrese solo valores numéricos en las calificaciones</Text>
            </VStack>
          </Alert.Description>
        </Alert.Root>
      </Stack>
    </Modal>
  );
};

LoadEvaluationsByExcelModal.propTypes = {
  dataCourseGroup: PropTypes.object,
  fetchData: PropTypes.func,
};
