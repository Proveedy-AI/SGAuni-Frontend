import { Button, Field, ModalSimple, toaster } from "@/components/ui";
import { CompactFileUpload } from "@/components/ui/CompactFileInput";
import { useValidateOcefExcel } from "@/hooks/payment_orders";
import { Flex, Stack } from "@chakra-ui/react";
import { useState } from "react";

export const LoadExcelValidationsModal = () => {
  const [open, setOpen] = useState(false);
  const [excelPath, setExcelPath] = useState(null);
  const { mutateAsync: validate, isSaving } = useValidateOcefExcel();

  const handleValidate = () => {
    if (!excelPath) {
      toaster.create({
        title: 'Excel no subido',
        description: 'Compartir el excel OCEF para validar ordenes de pago',
        type: 'warning'
      })
    }

    const payload = {
      path_ocef: excelPath
    }

    validate(payload, {
      onSuccess: () => {
        toaster.create({
          title: "Validación exitosa",
          description: "El archivo Excel ha sido validado correctamente.",
          type: "success",
        })
        setOpen(false);
      },
      onError: () => {
        toaster.create({
          title: "Error en la validación",
          description: "El archivo Excel no ha sido validado correctamente.",
          type: "error",
        })
      }
    })
  }
  
  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Button
              bg='uni.secondary'
              color='white'
              size='xs'
              w={{ base: 'full', sm: 'auto' }}
            >
              Validar con excel OCEF
            </Button>
          }
          title="Validar órdenes de pago con documento OCEF"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack spacing={4} w="full">

              <Field
                orientation={{ base: 'vertical', sm: 'horizontal' }}
                label='Excel OCEF:'
              >
                <CompactFileUpload
                  name='path_ocef'
                  accept='.xlsx'
                  onChange={(file) => setExcelPath(file)}
                  onClear={() => setExcelPath(null)}
                />
              </Field>

              <Flex justify='flex-end' gap={2} mt={2}>
                <Button
                  bg={'uni.secondary'}
                  variant={'solid'}
                  size='sm'
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  colorPalette={'green'}
                  variant={'solid'}
                  isLoading={isSaving}
                  size='sm'
                  onClick={handleValidate}
                >
                  Validar
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}