import { Field, ModalSimple, toaster } from "@/components/ui";
import { Card, Flex, Heading, Icon, IconButton, Input, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaSave, FaTimes } from "react-icons/fa";
import { useCreatePaymentOrder } from "@/hooks/payment_orders";
import { FiArrowUp, FiPlus } from "react-icons/fi";

export const GeneratePaymentOrderModalByRequest = ({ item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const { mutateAsync: generatePaymentOrder, isSaving } = useCreatePaymentOrder();

  const [orderIdInput, setOrderIdInput] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  const handleReset = () => {
    setOrderIdInput("");
    setDiscountInput("");
    setDueDateInput("");
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
    
    generatePaymentOrder(payload, {
      onSuccess: () => {
        toaster.create({
          title: 'Orden generada con éxito',
          type: 'success',
        });
        handleReset();
      },
      onError: (error) => {
        toaster.create({
          title: error.response?.data?.[0] || 'Error en la creación del examen',
          type: 'error',
        });
      }
    })

  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          title="Generar Orden de Pago"
          placement="center"
          trigger={
            <IconButton colorPalette='purple' size='xs'>
              <FiArrowUp />
            </IconButton>
          }
          size='4xl'
          open={open}
          hiddenFooter={true}
          onOpenChange={(e) => setOpen(e.open)}
          contentRef={contentRef}
        >
          <Stack
            gap={2}
            pb={6}
            maxH={{ base: 'full', md: '75vh' }}
            overflowY='auto'
            sx={{
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray.300',
                borderRadius: 'full',
              },
            }}
          >
            <Card.Root>
              <Card.Header pb={0}>
                <Flex align='center' gap={2}>
                  <Icon as={FiPlus} w={5} h={5} color='purple.600' />
                  <Heading size='sm'>Generar Orden de Pago</Heading>
                </Flex>
              </Card.Header>
              <Card.Body>
                <Flex
              direction={{ base: 'column', md: 'row' }}
              justify='flex-start'
              align={'end'}
              gap={2}
              mt={2}
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
                <Flex gap={2}>
                  <IconButton
                    size='sm'
                    bg='green'
                    loading={isSaving}
                    disabled={!orderIdInput || !discountInput || !dueDateInput}
                    onClick={handleSubmit}
                    css={{ _icon: { width: '5', height: '5' } }}
                    >
                    <FaSave />
                  </IconButton>
                  <IconButton
                    size='sm'
                    bg='red'
                    onClick={handleReset}
                    disabled={!orderIdInput && !discountInput && !dueDateInput}
                    css={{ _icon: { width: '5', height: '5' } }}
                    >
                    <FaTimes />
                  </IconButton>
                  </Flex>
                </Flex>
              </Card.Body>
            </Card.Root>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

GeneratePaymentOrderModalByRequest.propTypes = {
  item: PropTypes.object,
  paymentOrders: PropTypes.array,
  fetchPaymentRequests: PropTypes.func,
  fetchPaymentOrders: PropTypes.func
};