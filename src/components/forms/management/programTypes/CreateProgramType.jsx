import {
  Field,
  Button,
  toaster,
  Modal,
} from "@/components/ui";
import { Input, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useCreateProgramType } from "@/hooks";
import PropTypes from "prop-types";

export const AddProgramType = ({ fetchData }) => {
  const { mutate: register, isPending: loading } = useCreateProgramType()

  const [open, setOpen] = useState(false);
  const [programType, setProgramType] = useState({
    name: '',
    code: '',
  });
  const contentRef = useRef();

  const handleSubmitData = async (e) => {
    e.preventDefault();
    if (!programType.name || !programType.code) return;

    const payload = {
      name: programType.name,
      code: programType.code,
    };

    register(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Tipo de programa creado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
        setProgramType({
          name: '',
          code: '',
        });
      },
      onError: (error) => {
        toaster.create({
          title: error.message,
          type: 'error',
        });
      },
    });
  };

  return (
    <Modal
      title='Crear Tipo de Programa'
      placement='center'
      trigger={
        <Button
          bg='uni.secondary'
          color='white'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
        >
          <FiPlus /> Crear Tipo de Programa
        </Button>
      }
      onSave={handleSubmitData}
      loading={loading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack css={{ '--field-label-width': '120px' }}>
        <Field label='Nombre del Tipo de Programa'>
          <Input
            required
            type='text'
            name='name'
            placeholder='Nombre del tipo de programa'
            value={programType.name}
            onChange={(e) => setProgramType({ ...programType, name: e.target.value })}
          />
        </Field>
        <Field label='Código del Tipo de Programa'>
          <Input
            required
            type='text'
            name='code'
            placeholder='Código del tipo de programa'
            value={programType.code}
            onChange={(e) => setProgramType({ ...programType, code: e.target.value })}
          />
        </Field>
      </Stack>
    </Modal>
  )
}

AddProgramType.propTypes = {
  fetchData: PropTypes.func,
}