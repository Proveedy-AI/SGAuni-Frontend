import { ReactSelect } from "@/components/select";
import { Button, Field, Modal, toaster } from "@/components/ui";
import { CompactFileUpload } from "@/components/ui/CompactFileInput";
import { useCreateTransferRequest } from "@/hooks/transfer_requests";
import { Box, Text, VStack, HStack, Icon } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { FiPlus, FiDownload, FiFileText } from "react-icons/fi";
import { uploadToS3 } from '@/utils/uploadToS3';

export const AddTransferRequestModal = ({ user, available, loading, dataMyPrograms, dataPrograms }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [programFrom, setProgramFrom] = useState(null);
  const [programTo, setProgramTo] = useState(null);
  const [documentPath, setDocumentPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createTransferRequest, isPending } = useCreateTransferRequest();;

  const validateFields = () => {
    const newErrors = {};
    
    if (!programFrom) {
      newErrors.programFrom = 'Debe seleccionar el programa de origen';
    }
    
    if (!programTo) {
      newErrors.programTo = 'Debe seleccionar el programa de destino';
    }
    
    if (programFrom && programTo && programFrom.value === programTo.value) {
      newErrors.programTo = 'El programa de destino debe ser diferente al de origen';
    }

    if (!documentPath) {
      newErrors.document = 'Debe adjuntar el documento de solicitud';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitData = async () => {
    setIsLoading(true);
    
    if (!validateFields()) return;

    if (!documentPath) {
      toaster.create({
        title: 'Documento no subido',
        description: 'Compartir el documento de solicitud',
        type: 'warning',
      });
      setIsLoading(false);
      return;
    }

    let pathDocUrl = documentPath;

    try {
      const uuid = user.student.uuid;
      if (documentPath instanceof File) {
        pathDocUrl = await uploadToS3(
          documentPath,
          'sga_uni/transfer_requests',
          `transfer_request_${uuid}`,
          'pdf'
        );
      }

      console.log(pathDocUrl)

      if (!pathDocUrl) {
				throw new Error('Error al subir el archivo a S3.');
			}

      const payload = {
        student: user.student.id,
        from_program: programFrom.value,
        to_program: programTo.value,
        request_document_url: pathDocUrl
      }

      createTransferRequest(payload, {
        onSuccess: () => {
          toaster.create({
            title: 'Solicitud enviada',
            description: 'Tu solicitud de traslado ha sido enviada exitosamente.',
            type: 'success',
          });
          setOpen(false);
          setProgramFrom(null);
          setProgramTo(null);
          setDocumentPath(null);
          setErrors({});
        },
        onError: () => {
          toaster.create({
            title: 'Error al enviar la solicitud',
            description: 'Hubo un problema al enviar tu solicitud de traslado.',
            type: 'error',
          });
        }
      });

      console.log('Datos a enviar:', payload);
  
    } catch (err) {
      toaster.create({
				title: 'Error inesperado',
				description: err.message || 'No se pudo completar la validación.',
				type: 'error',
			});
			setIsLoading(false);
		} finally {
			// Limpiar el estado del archivo después de la validación
			setDocumentPath(null);
			setIsLoading(false);
		}
  };

  const programFromOptions = dataMyPrograms?.map((program) => ({
    value: program.program_id,
    label: program.program_name
  })) || [];

  const myProgramIds = dataMyPrograms?.map(p => p.program_id) || [];
  const programToOptions = dataPrograms?.results?.filter(
    program => !myProgramIds.includes(program.id)
  ).map((program) => ({
    value: program.id,
    label: program.name
  })) || [];

  return (
    <Modal
      title='Solicitar Traslado Interno'
      placement='center'
      trigger={
        <Button
          bg='uni.secondary'
          color='white'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
          disabled={!available}
        >
          <FiPlus /> Mandar solicitud
        </Button>
      }
      onSave={handleSubmitData}
      isLoading={isPending || isLoading}
      size='2xl'
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <VStack spacing={6} align="stretch" ref={contentRef}>
        <Box bg="blue.50" p={4} borderRadius="md" border="1px solid" borderColor="blue.200">
          <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={2}>
            ℹ️ Información importante
          </Text>
          <Text fontSize="xs" color="blue.600">
            El traslado interno le permite cambiar de un programa a otro dentro de la universidad. 
            Una vez enviada la solicitud, será evaluada por el área correspondiente.
          </Text>
        </Box>

        <Box bg="green.50" p={4} borderRadius="md" border="1px solid" borderColor="green.200">
          <HStack justify="space-between" align="center">
            <Box flex="1">
              <HStack spacing={2} mb={2}>
                <Icon as={FiFileText} color="green.600" boxSize={4} />
                <Text fontSize="sm" color="green.700" fontWeight="medium">
                  Plantilla de Solicitud
                </Text>
              </HStack>
              <Text fontSize="xs" color="green.600">
                Descarga y completa la plantilla oficial para adjuntar con tu solicitud de traslado.
              </Text>
            </Box>
            <Button
              size="sm"
              variant="outline"
              bg="green.500"
              color="white"
              leftIcon={<Icon as={FiDownload} />}
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/templates/FORMATO_SOLICITUD_TRASLADO.docx';
                link.download = 'FORMATO_SOLICITUD_TRASLADO.docx';
                link.click();
              }}
            >
              <FiDownload /> Descargar
            </Button>
          </HStack>
        </Box>

        <Field label="Programa de origen *" error={errors.programFrom}>
          <ReactSelect
            value={programFrom}
            onChange={(value) => {
              setProgramFrom(value);
              setErrors(prev => ({ ...prev, programFrom: null }));
            }}
            options={programFromOptions}
            placeholder="Seleccione su programa actual"
            size="sm"
            isSearchable
          />
        </Field>

        <Field label="Programa de destino *" error={errors.programTo}>
          <ReactSelect
            value={programTo}
            onChange={(value) => {
              setProgramTo(value);
              setErrors(prev => ({ ...prev, programTo: null }));
            }}
            options={programToOptions}
            placeholder="Seleccione el programa al que desea trasladarse"
            size="sm"
            isSearchable
            loading={loading}
          />
        </Field>

        <Field label='Solicitud:'>
          <CompactFileUpload
            name='document_path'
            accept = '.pdf'
            onChange={(file) =>
              setDocumentPath(file)
            }
            onClear={() => setDocumentPath(null)}
          />
        </Field>

        <Box bg="amber.50" p={4} borderRadius="md" border="1px solid" borderColor="amber.200">
          <Text fontSize="sm" color="amber.700" fontWeight="medium" mb={2}>
            ⚠️ Importante
          </Text>
          <Text fontSize="xs" color="amber.600">
            • La solicitud será evaluada por el área académica correspondiente<br/>
            • El proceso puede tomar entre 5 a 10 días hábiles<br/>
            • Una vez aprobado, no podrá revertir el traslado<br/>
            • Debe cumplir con los requisitos académicos del programa destino
          </Text>
        </Box>
      </VStack>
    </Modal>
  );
};

AddTransferRequestModal.propTypes = {
  user: PropTypes.object,
  available: PropTypes.bool,
  loading: PropTypes.bool,
  dataMyPrograms: PropTypes.array,
  dataPrograms: PropTypes.object,
};