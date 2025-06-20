import { Field, ModalSimple, toaster, Tooltip } from "@/components/ui";
import { Box, Flex, IconButton, Input, Stack, Table, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { HiArrowUp } from "react-icons/hi2";
import PropTypes from "prop-types";
import { FaSave, FaTimes } from "react-icons/fa";
import { useCreatePaymentOrder } from "@/hooks/payment_orders";
import { ValidatePaymentOrderModal, ViewPaymentOrderVoucherModal } from "../payment_orders";

export const GeneratePaymentOrderModal = ({ item, paymentOrders, fetchPaymentRequests, fetchPaymentOrders }) => {
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
        fetchPaymentRequests();
        fetchPaymentOrders();
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
          size='4xl'
          open={open}
          hiddenFooter={true}
          onOpenChange={(e) => setOpen(e.open)}
          contentRef={contentRef}
        >
          <Stack spacing={4} css={{ '--field-label-width': '150px' }}>
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
            <Box>
              <Text fontWeight='semibold' mb={2}>
                Órdenes de pago generadas:
              </Text>
              <Table.Root size='sm' striped>
                <Table.Header>
                  <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                    <Table.ColumnHeader>N°</Table.ColumnHeader>
                    <Table.ColumnHeader>Id de la Orden</Table.ColumnHeader>
                    <Table.ColumnHeader>Monto inicial</Table.ColumnHeader>
                    <Table.ColumnHeader>Descuento</Table.ColumnHeader>
                    <Table.ColumnHeader>Monto total</Table.ColumnHeader>
                    <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    paymentOrders?.length > 0 ? (
                      paymentOrders.map((payOrd, index) => (
                        <Table.Row key={payOrd.id}>
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>{payOrd.id_orden}</Table.Cell>
                          <Table.Cell>{payOrd.sub_amount}</Table.Cell>
                          <Table.Cell>{payOrd.discount_value}</Table.Cell>
                          <Table.Cell>{payOrd.total_amount}</Table.Cell>
                          <Table.Cell>
                            <Flex gap={2}>
                              <ViewPaymentOrderVoucherModal item={payOrd} fetchPaymentOrders={fetchPaymentOrders} />
                              <ValidatePaymentOrderModal item={payOrd} />
                            </Flex>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row>
                        <Table.Cell colSpan={6} textAlign='center'>
                          Sin datos disponibles
                        </Table.Cell>
                      </Table.Row>
                    )
                  }
                </Table.Body>
              </Table.Root>
            </Box>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

GeneratePaymentOrderModal.propTypes = {
  item: PropTypes.object,
  paymentOrders: PropTypes.array,
  fetchPaymentRequests: PropTypes.func,
  fetchPaymentOrders: PropTypes.func
};