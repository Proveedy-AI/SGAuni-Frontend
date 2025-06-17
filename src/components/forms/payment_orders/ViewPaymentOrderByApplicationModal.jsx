import { Field, ModalSimple } from "@/components/ui";
import { IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import PropTypes from "prop-types";


export const ViewPaymentOrderByApplicationModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  /*
    item: {
      id: 1
      id_orden: 
      sub_amount:
      discount_value:
      total_amount:
      payment_method_name:
      name:
      address:
      email:
      document_num;
      due_date:
      status_value:
    }
  */
  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <IconButton colorPalette='blue' size='xs'>
              <HiEye />
            </IconButton>
          }
          title="Ver Orden de Pago"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              w="full"
            >
              <Stack flex={1} spacing={4}>
                <Field label="Concepto">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.payment_order_name || 'No hay...'}
                  </Text>
                </Field>
                <Field label="Nombre del postulante">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.name}
                  </Text>
                </Field>
                <Field label="Dirección">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.address}
                  </Text>
                </Field>
                <Field label="Correo electrónico">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.email}
                  </Text>
                </Field>
                <Field label="Número de documento">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.document_num}
                  </Text>
                </Field>
                <Field label="ID Orden">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.id_orden}
                  </Text>
                </Field>
              </Stack>
              <Stack flex={1} spacing={4}>
                <Field label="Subtotal">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.sub_amount}
                  </Text>
                </Field>
                <Field label="Descuento">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.discount_value}
                  </Text>
                </Field>
                <Field label="Total">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.total_amount}
                  </Text>
                </Field>
                <Field label="Método de pago">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.payment_method_name}
                  </Text>
                </Field>
                <Field label="Fecha de vencimiento">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.due_date}
                  </Text>
                </Field>
                <Field label="Estado">
                  <Text
                    w="full"
                    py={2}
                    px={3}
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                  >
                    {item.status_value}
                  </Text>
                </Field>
              </Stack>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ViewPaymentOrderByApplicationModal.propTypes = {
  item: PropTypes.object
};