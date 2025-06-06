import {
  Field,
  Modal,
  toaster,
} from "@/components/ui";
import { IconButton, Input, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useUpdateProgramType } from "@/hooks";
import { HiPencil } from "react-icons/hi2";
import PropTypes from "prop-types";

export const EditProgramType = ({ fetchData, item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const { mutateAsync: update, isPending: loadingUpdate } = useUpdateProgramType();
  const [programRequest, setProgramRequest] = useState({
    name: item.name,
    code: item.code,
  })

  const handleUpdate = async () => {
    const payload = {
      name: programRequest.name,
      code: programRequest.code,
    }

    if (!payload.name || !payload.code) return;

    await update({ id: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Tipo de Programa actualizado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
      },
      onError: (error) => {
        toaster.create({
          title: error.message,
          type: 'error',
        });
      },
    })
  }

  return (
    <Modal
      title='Editar Tipo de Programa'
      placement='center'
      trigger={
        <IconButton colorPalette='green' size='xs'>
          <HiPencil />
        </IconButton>
      }
      onSave={handleUpdate}
      loading={loadingUpdate}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack spacing={4}>
        <Field label="Nombre del tipo de programa">
          <Input
            value={programRequest.name}
            onChange={(e) =>
              setProgramRequest((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </Field>

        <Field label='Código del tipo de programa'>
          <Input
            value={programRequest.code}
            onChange={(e) =>
              setProgramRequest({
                ...programRequest,
                code: e.target.value,
              })
            }
          />
        </Field>
      </Stack>
    </Modal>
  )
}

EditProgramType.propTypes = {
  fetchData: PropTypes.func,
  item: PropTypes.object,
};