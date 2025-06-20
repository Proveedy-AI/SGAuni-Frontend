import { Field, ModalSimple, toaster, Tooltip } from "@/components/ui";
import { Box, IconButton, Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi2";
import PropTypes from "prop-types";

export const GeneratePaymentOrderModal = ({ item, fetchData }) => {
  const [open, setOpen] = useState(false);
  //const { mutateAsync: generatePaymentOrder, isSaving } = useCreatePaymentOrder();

  const [orderIdInput, setOrderIdInput] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  const handleReset = () => {
    setOrderIdInput("");
    setDiscountInput("");
    setDueDateInput("");
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!orderIdInput || !discountInput || !dueDateInput) {
      toaster.create({
        title: 'Completar los campos necesarios',
        type: 'warning'
      })
    }


    const payload = {
      request: item.id,
      id_orden: orderIdInput,
      discount_value: (Number(discountInput)/100).toString(),
      due_date: dueDateInput
    }

    /*
    generatePaymentOrder(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Orden generada con éxito',
          type: 'success',
        });
        fetchData();
        handleReset();
      },
      onError: (error) => {
        toaster.create({
          title: error.response?.data?.[0] || 'Error en la creación del examen',
          type: 'error',
        });
      }
    })
    */

    //Quitar esto cuando se implemente el hook para crear ordenes de pago
    console.log(payload)
    handleReset();
    setOpen(false);
  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Box>
              <Tooltip
                content='Generar Orden de Pago'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='purple' size='xs'>
                  <HiArrowUp />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Generar Orden de Pago"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={handleSubmit}
        >
          <Stack spacing={4}>
            <Stack
              spacing={4}
              w="full"
            >
              <Field label='Id de Orden'>
                <Input
                  placeholder="Ingresar id de Orden"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                />
              </Field>
              <Field label='Descuento'>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  placeholder="Ingresar descuento"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                />
              </Field>
              <Field label='Fecha de Vencimiento'>
                <Input
                  type="date"
                  placeholder="Ingresar fecha de vencimiento"
                  value={dueDateInput}
                  onChange={(e) => setDueDateInput(e.target.value)}
                />
              </Field>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

GeneratePaymentOrderModal.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func
};