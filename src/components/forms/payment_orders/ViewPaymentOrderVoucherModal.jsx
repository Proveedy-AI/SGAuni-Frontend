import { Field, ModalSimple, Tooltip } from "@/components/ui";
import { Box, IconButton, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import PropTypes from "prop-types";

export const ViewPaymentOrderVoucherModal = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack css={{ "--field-label-width": "180px" }}>
      <Field orientation={{ base: "vertical", sm: "horizontal" }}>
        <ModalSimple
          trigger={
            <Box>
              <Tooltip
                content='Ver Voucher'
                positioning={{ placement: 'bottom-center' }}
                showArrow
                openDelay={0}
              >
                <IconButton colorPalette='blue' size='xs'>
                  <HiEye />
                </IconButton>
              </Tooltip>
            </Box>
          }
          title="Ver Voucher"
          placement="center"
          size="5xl"
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
              
            </Stack>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
}

ViewPaymentOrderVoucherModal.propTypes = {
  item: PropTypes.object
};