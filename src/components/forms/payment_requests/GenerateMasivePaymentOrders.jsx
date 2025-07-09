import { Button, Field, ModalSimple } from "@/components/ui";
import { Flex, Span, Stack } from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import { FiPlus } from "react-icons/fi";

export const GenerateMasivePaymentOrders = ({ data }) => {
  const [open, setOpen] = useState(false);

  //const { mutateAsync: generatePaymentsOrders } = useGeneratePaymentsOrders();
  // Simular el isSaving ↓↓↓
  const [isSaving, setIsSaving] = useState(false);

  const handleValidate = async () => {
    /*
    await validatePaymentRequest({ id: item.id }, {
      onSuccess: () => {
        toaster.create({
          title: "Ordenes de pago generadas correctamente",
          type: "success",
        });
        setOpen(false);
      },
      onError: (error) => {
        toaster.create({
          title: error.message || "Error al generar las ordenes de pago",
          type: "error",
        });
      },
    });
    */

    // Simulación de validación
    setIsSaving(true);
    console.log("Generando masivamente las ordenes de pago");
    setTimeout(() => {
      console.log("Ordenes de pago generadas correctamente");
      setIsSaving(false);
      setOpen(false);
    }, 1000);
  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Button
              size='xs'
              bg='uni.secondary'
            >
              <FiPlus /> Generar Ordenes de Pago
            </Button>
          }
          title="Generar Ordenes de Pago"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack
              direction='column'
              spacing={4}
              w="full"
            >
              <Span fontSize={16} fontWeight={'semibold'} display='block'>¿Estás seguro que deseas generar las órdenes de pago para {data?.length} solicitudes?</Span>
              <Flex justify='flex-end' gap={2} mt={2}>
                <Button
                  size='sm'
                  bg='white'
                  color='uni.secondary'
                  border='1px solid'
                  _hover={{ bg: 'uni.secondary', color: 'white' }}
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size='sm'
                  bg='#0661D8'
                  isLoading={isSaving}
                   _hover={{ bg: '#0551A1' }}
                  onClick={handleValidate}
                >
                  Si, generar ordenes de pago
                </Button>
              </Flex>
              
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

GenerateMasivePaymentOrders.propTypes = {
  data: PropTypes.array
};