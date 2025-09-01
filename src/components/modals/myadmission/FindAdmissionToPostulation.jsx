import PropTypes from 'prop-types';
import { Button, Checkbox, Field, Modal, toaster } from '@/components/ui';
import { ReactSelect } from '@/components';
import { FaGraduationCap } from 'react-icons/fa';
import { Box, Flex, HStack, Icon, Input, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useReadAdmissionByUUID } from '@/hooks/admissions_proccess';
import { FiFile } from 'react-icons/fi';
import { useCreateAdmissionAplicant } from '@/hooks/admissions_applicants';

export const FindAdmissionToPostulation = ({ program, userData, fetchData }) => {
  const [open, setOpen] = useState(false);
  const { data: dataProgramDetails } = useReadAdmissionByUUID(program?.uuid);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedModality, setSelectedModality] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { mutate: createAdmissionApplicant, isPending } = useCreateAdmissionAplicant();

  const hasStudentData = !!userData?.student;

  const programsUser = userData?.student?.admission_programs
    ?.filter((prog) => prog.academic_status === 3 || prog.academic_status === 5 || prog.academic_status === 7)
    ?.map((prog) => prog.program);

  const AdmissionOptions = 
    dataProgramDetails?.programs
    ?.filter((program) => !programsUser?.includes(program.program))
    ?.map((admision) => ({
      label: admision.program_name,
      value: admision.id
    }));

  const availableModalities =
    selectedAdmission && dataProgramDetails?.programs?.length > 0
      ? dataProgramDetails.programs
          .filter(
            (program) =>
              program.id === Number(selectedAdmission?.value)
          )
          .flatMap(
            (program) =>
              program.modalities?.map((modality) => ({
                value: modality.id.toString(),
                label: modality.modality_name,
              })) || []
          )
      : [];

  useEffect(() => {
    setSelectedModality(null);
  }, [selectedAdmission]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    if (!selectedAdmission) newErrors.selectedAdmission = 'Debes seleccionar una admisión';
    if (!selectedModality) newErrors.selectedModality = 'Debes seleccionar una modalidad';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      person: userData?.id || 0,
      admission_program: Number(selectedAdmission?.value),
      modality_id: Number(selectedModality?.value),
    };

    createAdmissionApplicant(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Postulación enviada',
          description: 'Tu postulación ha sido enviada con éxito.',
          type: 'success',
        })
        fetchData();
        setOpen(false);
      },

      onError: (error) => {
        toaster.create({
          title: error.message || 'Error al enviar la postulación',
          description: 'Ocurrió un error al enviar tu postulación.',
          type: 'error',
        })
      }
    });
  }


  return (
    <Modal
      title="Postular a otros programas"
      placement='center'
      trigger={
        <Button 
          size='sm'
          bg='uni.secondary'
          onClick={() => setOpen(true)}
          disabled={!hasStudentData}
        >
          <FiFile /> Postular a otros programas
        </Button>
      }
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size='3xl'
      loading={isPending}
      loadingText='Guardando...'
      onSave={handleSubmit}
      saveButtonProps={{ disabled: !acceptTerms || !selectedAdmission || !selectedModality || isPending }}
    >
      <Box>
        <VStack gap={2} align='stretch'>
          <Field 
            label={<><Icon as={FaGraduationCap} w={4} h={4} /> Programa Académico</>}
            invalid={!!errors.selectedAdmission}
            errorText={errors.selectedAdmission}  
          >
            <ReactSelect
              value={selectedAdmission}
              onChange={setSelectedAdmission}
              options={AdmissionOptions}
              isClearable
            />
          </Field>
          <Field 
            label='Modalidad de Admisión'
            invalid={!!errors.selectedModality}
            errorText={errors.selectedModality}
          >
            <ReactSelect
              value={selectedModality}
              onChange={setSelectedModality}
              options={availableModalities}
              isDisabled={!selectedAdmission}
              isClearable
            />
          </Field>
          {/* Información del estudiante (solo visual) */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gapX={8} gapY={4}>
            <Field label='Nombres'>
              <Input
                readOnly
                value={userData?.first_name || ''}
                variant='flushed'
              />
            </Field>
            <Field label='Apellidos'>
              <Input
                readOnly
                value={`${userData?.paternal_surname || ''} ${userData?.maternal_surname || ''}`}
                variant='flushed'
              />
            </Field>
            <Field label='Tipo y número de documento'>
              <Input
                readOnly
                value={`${userData?.type_document_name || ''} - ${userData?.document_number || ''}`}
                variant='flushed'
              />
            </Field>
            <Field label='Correo institucional'>
              <Input
                readOnly
                value={userData?.uni_email || ''}
                variant='flushed'
              />
            </Field>
            <Field label='Correo personal'>
              <Input
                readOnly
                value={userData?.personal_email || ''}
                variant='flushed'
              />
            </Field>
            <Field label='Dirección'>
              <Input
                readOnly
                value={userData?.address || ''}
                variant='flushed'
              />
            </Field>
            <Field label='Teléfono'>
              <Input
                readOnly
                value={userData?.phone || ''}
                variant='flushed'
              />
            </Field>
          </SimpleGrid>

          <HStack align='start' gap={3}>
            <Field
              invalid={!!errors.acceptTerms}
              errorText={errors.acceptTerms}
            >
              <Flex alignItems='center' gapX={2}>
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <VStack align='start' gap={1}>
                  <Text fontSize='sm'>
                    Confirmo mis{' '}
                    <Text as='a' color='blue.600'>
                      datos personales proporcionados
                    </Text>{' '}
                    para la postulación al programa y modalidad seleccionada.
                  </Text>
                </VStack>
              </Flex>
            </Field>
          </HStack>
        </VStack>
      </Box>
    </Modal>
  );
}

FindAdmissionToPostulation.propTypes = {
  program: PropTypes.object,
  userData: PropTypes.object,
  fetchData: PropTypes.func
}