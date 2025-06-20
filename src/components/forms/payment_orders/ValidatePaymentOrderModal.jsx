import { Field, ModalSimple, Tooltip } from "@/components/ui";
import { Box, Button, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";

export const ValidatePaymentOrderModal = ({ item, fetchPaymentOrders }) => {
  const [open, setOpen] = useState(false);
  /*
  {
    "id": 1,
    "request": 1,
    "created_by": 3,
    "created_by_name": "Jose Armando Diaz Torres",
    "id_orden": "123456",
    "sub_amount": "250.00",
    "discount_value": "0.20",
    "status": 1,
    "status_display": "Pending",
    "total_amount": "200.00",
    "payment_method": 1,
    "payment_method_slug": "bcp",
    "name": "Jeferson Farfan Lopez",
    "address": "Av. La Paz #2196",
    "email": "71111544@pronabec.edu.pe",
    "document_num": "71111544",
    "due_date": "2025-06-27",
    "document_type_display": "Receipt",
    "modality": 1,
    "modality_name": "Pre Maestría"
  }
  */

  //const { mutateAsync: validatePaymentOrder, isSaving } = useValidatePaymentOrder();

  const handleValidate = async () => {
    /*
    validatePaymentOrder( item.id_orden, {
      onSuccess: () => {
        toaster.create({
          title: "Orden de pago validada correctamente",
          status: "success",
        });
        setOpen(false);
        fetchPaymentOrders();
      },
      onError: (error) => {
        toaster.create({
          title: "Error al validar la orden de pago",
          status: "error",
        });
      }
    })
    */

    // Simulación de validación
    setOpen(false);
    fetchPaymentOrders();
  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Box>
              <Tooltip
                content='Validar Manualmente Orden de Pago'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='green' size='xs'>
                  <HiCheck />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Validar Manualmente Orden de Pago"
          placement="center"
          size="3xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack spacing={4} w="full"
            >
              <Flex justify='space-between' gap={2} mt={2}>
                <Box w='100%'>
                  <Field label='Id de la ordern:'>
                    <Text fontSize='xl' color={'uni.secondary'}>
                      {item?.id_orden}
                    </Text>
                  </Field>
                  <Field label='Núm. de Documento - Nombre del postulante:'>
                    <Text fontSize='xl' color={'uni.secondary'}>
                      {item?.document_num} - {item?.name}
                    </Text>
                  </Field>
                  <Field label='Pago total:'>
                    <Text fontSize='xl' color={'uni.secondary'}>
                      S/ {item?.sub_amount}
                    </Text>
                  </Field>
                </Box>
                <Box w='100%'>
                  <Field label='Método de pago:'>
                    <Text fontSize='xl' color={'uni.secondary'}>
                      {item?.payment_method_slug}
                    </Text>
                  </Field>
                  <Field label='Modalidad:'>
                    <Text fontSize='xl' color={'uni.secondary'}>
                      {item?.modality_name}
                    </Text>
                  </Field>
                  <Field label='Fecha de vencimiento:'>
                    <Text fontSize='xl' color={'uni.secondary'}>
                      S/ {item?.due_date}
                    </Text>
                  </Field>
                </Box>
              </Flex>

              <Flex justify='flex-end' gap={2} mt={2}>
                <Button
                  colorPalette={'green'}
                  variant={'solid'}
                  //isLoading={isSaving}
                  size='sm'
                  onClick={handleValidate}
                >
                  <FaCheck />
                  Validar
                </Button>
                <Button
                  colorPalette={'red'}
                  variant={'solid'}
                  size='sm'
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ValidatePaymentOrderModal.propTypes = {
  item: PropTypes.object,
  fetchPaymentOrders: PropTypes.func
};