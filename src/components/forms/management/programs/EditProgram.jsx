import CustomSelect from "@/components/select/customSelect";
import {
  Field,
  Modal,
  Radio,
  RadioGroup,
  toaster,
} from "@/components/ui";
import { Flex, IconButton, Input, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useUpdateProgram } from "@/hooks";
import { HiPencil } from "react-icons/hi2";
import PropTypes from "prop-types";

export const EditProgram = ({ fetchData, item, programTypesOptions, coordinatorsOptions }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const { mutateAsync: update, isPending: loadingUpdate } = useUpdateProgram();
  const [programRequest, setProgramRequest] = useState(item)
  
  const handleUpdate = async () => {
    const payload = {
      coordinator: programRequest.coordinator,
      name: programRequest.name,
      type: programRequest.type,
      price_credit: programRequest.price_credit,
    }
  
    if (!payload.name || payload.price_credit <= 0 || payload.coordinator === 0 || payload.coordinator === null) return;

    await update({ id: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: 'Programa actualizado correctamente',
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
      title='Editar Programa'
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
        <Field label="Nombre del programa">
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

        <Field label="Tipo de programa">
          <RadioGroup
            name="type"
            value={programRequest.type.toString()}
            onChange={(e) =>
              setProgramRequest({
                ...programRequest,
                type: Number(e.target.value),
              })
            }
            direction='row'
          >
            <Flex gap={5}>
              {programTypesOptions?.map((option, index) => (
                <Radio key={index} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Flex>
          </RadioGroup>
        </Field>

        <Field label="Coordinador">
          <CustomSelect
            options={coordinatorsOptions}
            value={programRequest.coordinator?.toString()}
            onChange={(value) =>
              setProgramRequest({
                ...programRequest,
                coordinator: Number(value),
              })
            }
          />
        </Field>
        <Field label='Precio por crédito'>
          <Input
            required
            type='number'
            name='price_credit'
            placeholder='Precio por crédito'
            value={programRequest.price_credit}
            onChange={(e) =>
              setProgramRequest({
                ...programRequest,
                price_credit: Number(e.target.value),
              })
            }
          />
        </Field>
      </Stack>
    </Modal>
  )
}

EditProgram.propTypes = {
  fetchData: PropTypes.func,
  item: PropTypes.object,
  programTypesOptions: PropTypes.array,
  coordinatorsOptions: PropTypes.array,
};