import PropTypes from 'prop-types';
import { Field, Modal, toaster, Tooltip } from "@/components/ui";
import { useRef, useState } from "react";
import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { ReactSelect } from '@/components/select';
import { BsPersonAdd } from 'react-icons/bs';
import { useAssignProfessor } from '@/hooks/courses';

export const AssingProfessorModal = ({ data, item, fetchData, professorsOptions }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);

  const [professor, setProfessor] = useState(data?.professor || null);

  const { mutate: assignProfessor, isPending: loading } = useAssignProfessor();

  const handleSubmitData = async (e) => {
    e.preventDefault();

    const payload = {
      professor_id: professor?.value,
    };

    assignProfessor({ id: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Docente asignado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
      },
      onError: (error) => {
        toaster.create({
          title: error.message || 'Error al asignar el docente',
          type: 'error',
        });
      },
    });
  };

  return (
    <Modal
      title='Asignar docente al curso'
      placement='center'
      // size='lg'
      trigger={
        <Box>
          <Tooltip
            content='Asignar docente al curso'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton colorPalette='purple' size='xs'>
              <BsPersonAdd />
            </IconButton>
          </Tooltip>
        </Box>
      }
      onSave={handleSubmitData}
      loading={loading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack css={{ '--field-label-width': '120px' }}>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Código del curso:'
        >
          <Input
            readOnly
            value={item.code}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Nombre del curso:'
        >
          <Input
            readOnly
            value={item.name}
            size='xs'
          />
        </Field>
        <ReactSelect
          options={professorsOptions}
          value={professor}
          onChange={(value) => setProfessor(value)}
          isClearable
          placeholder='Seleccionar docente...'
        />
      </Stack>
    </Modal>
  );
};
  
AssingProfessorModal.propTypes = {
  data: PropTypes.array,
  item: PropTypes.object,
  fetchData: PropTypes.func,
  professorsOptions: PropTypes.array,
};