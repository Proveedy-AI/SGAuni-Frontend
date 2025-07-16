import { Field, ModalSimple, toaster, Tooltip } from "@/components/ui";
import { Box, Button, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiCheck } from "react-icons/hi2";
import PropTypes from "prop-types";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useUpdateFractionationRequest } from "@/hooks/fractionation_requests";

export const ApproveFractionationRequestsModal = ({ item, fetchData }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: update, isSaving } = useUpdateFractionationRequest();

  const handleValidate = async (isApproved) => {
    const payload = {
      status: isApproved ? 2 : 3
    }
    console.log(payload)
    update({ id: item.id, payload }, {
      onSuccess: () => {
        toaster.create({
          title: "Solicitud validada correctamente",
          type: 'success',
        });
        setOpen(false);
        fetchData();
      },
      onError: (error) => {
        toaster.create({
          title: error ? error.message : "Error al validar la solicitud",
          type: "error",
        });
      }
    })
  }

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Box>
              <Tooltip
                content='Validar Solicitud de fraccionamiento'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton disabled={item.status === 3} colorPalette='green' size='xs'>
                  <HiCheck />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Validar Solicitud de fraccionamiento"
          placement="center"
          size="xl"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
        >
          <Stack spacing={4}>
            <Stack spacing={4} w="full"
            >

              <Text fontSize='md'>
                ¿Estás seguro de que deseas validar la solicitud del postulante <strong>{item?.applicant_name?.toUpperCase()}</strong>? 
              </Text>

              <Flex justify='flex-end' gap={2} mt={2}>
                <Button
                  colorPalette={'green'}
                  variant={'solid'}
                  isLoading={isSaving}
                  size='sm'
                  onClick={() => handleValidate(true)}
                >
                  <FaCheck />
                  Validar
                </Button>
                <Button
                  bg={'uni.secondary'}
                  variant={'solid'}
                  size='sm'
                  onClick={() => handleValidate(false)}
                >
                  <FaTimes /> Rechazar
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ApproveFractionationRequestsModal.propTypes = {
  item: PropTypes.object,
  fetchData: PropTypes.func
};