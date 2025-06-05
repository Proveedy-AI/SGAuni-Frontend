import CustomSelect from "@/components/select/customSelect";
import {
  Field,
  Button,
  Radio,
  RadioGroup,
  toaster,
  Modal,
} from "@/components/ui";
import { Flex, Input, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useCreateProgram } from "@/hooks";
import { useCreateProgramType } from "@/hooks/ProgramTypes/useCreateProgramTypes";

export const CreateProgram = ({ fetchData, programTypesOptions, coordinatorsOptions }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);

  const { mutate: register, isPending: loading } = useCreateProgram();

  const [programeRequest, setProgramRequest] = useState({
    name: '',
    type: Number(programTypesOptions[0]?.value),
    coordinator: null,
    price_credit: '',
  })

  const handleSubmitData = async (e) => {
    e.preventDefault();
    if (!programeRequest.name || programeRequest.price_credit <= 0 || programeRequest.coordinator === 0 || programeRequest.coordinator === null) return;

    const payload = programeRequest;
    register(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Programa creado correctamente',
          type: 'success',
        });
        setOpen(false);
        fetchData();
        setProgramRequest({
          name: '',
          type: Number(programTypesOptions[0]?.value),
          coordinator: null,
          price_credit: '',
        });
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
      title='Crear Programa'
      placement='center'
      trigger={
        <Button
          bg='uni.secondary'
          color='white'
          size='xs'
          w={{ base: 'full', sm: 'auto' }}
        >
          <FiPlus /> Crear Programa
        </Button>
      }
      onSave={handleSubmitData}
      loading={loading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack css={{ '--field-label-width': '120px' }}>
        <Field label='Nombre del Programa'>
          <Input
            required
            type='text'
            name='name'
            placeholder='Nombre del programa'
            value={programeRequest.name}
            onChange={(e) => setProgramRequest({ ...programeRequest, name: e.target.value })}
          />
        </Field>
        <Field label='Tipo de Programa'>
          <RadioGroup
            name='type'
            value={programeRequest.type.toString()}
            onChange={(e) => setProgramRequest({ ...programeRequest, type: Number(e.target.value) })}
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
        <Field label='Coordinador'>
          <CustomSelect
            required
            options={coordinatorsOptions || []}
            value={programeRequest.coordinator?.toString() || ''}
            onChange={(e) => setProgramRequest({ ...programeRequest, coordinator: Number(e) })}
            isDisabled={false}
            isLoading={false}
            isSearchable={true}
            name='coordinator'
          />
        </Field>
        <Field label='Precio por crédito'>
          <Input
            required
            type='number'
            name='price_credit'
            placeholder='Precio por crédito'
            value={programeRequest.price_credit}
            onChange={(e) => setProgramRequest({ ...programeRequest, price_credit: e.target.value })}
          />
        </Field>
      </Stack>
    </Modal>
  )

}

export const AddProgramType = () => {
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
      onSuccess: (newProgramType) => {
        toaster.create({
          title: 'Tipo de programa creado correctamente',
          type: 'success',
        });
        setOpen(false);
        setProgramType({
          name: '',
          code: '',
        });
        console.log('nuevo tipo de programa', newProgramType);
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