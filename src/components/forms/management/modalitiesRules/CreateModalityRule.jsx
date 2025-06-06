import { Field, Button, toaster, Modal } from "@/components/ui"
import { Input, Stack } from "@chakra-ui/react"
import { useRef, useState } from "react";
import { useCreateModalityRule } from "@/hooks";
import PropTypes from "prop-types";
import { FiPlus } from "react-icons/fi";

export const AddModalityRuleForm = ({ fetchData }) => {
  const contentRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [modalityRuleRequest, setModalityRuleRequest] = useState({
    field_name: '',
  })

  const { mutate: create, isPending: loading } = useCreateModalityRule();

  const handleSubmitData = (e) => {
    e.preventDefault();

    create(modalityRuleRequest, {
      onSuccess: () => {
        toaster.create({
          title: 'Regla registrada correctamente',
          type: 'success'
        })
        setOpen(false);
				fetchData();
        setModalityRuleRequest({
          field_name: '',
        })
      }
    })
  }

  return (
    <Modal
      title='Crear Regla de Modalidad'
      placement='center'
      trigger={
        <Button
          bg='uni.secondary'
          color='white'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
        >
          <FiPlus /> Crear Regla de Modalidad
        </Button>
      }
      onSave={handleSubmitData}
      loading={loading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack css={{ '--field-label-width': '120px' }}>
        <Field label='Nombre de la regla' helperText='Ingrese el nombre de la regla de modalidad'>
          <Input
            required
            type="text"
            name="name"
            placeholder='Ingrese el nombre de la regla'
            value={modalityRuleRequest.field_name}
            onChange={e => setModalityRuleRequest({ ...modalityRuleRequest, field_name: e.target.value })}
          />
        </Field>
      </Stack>
    </Modal>
  )
}

AddModalityRuleForm.propTypes = {
  fetchData: PropTypes.func,
};
