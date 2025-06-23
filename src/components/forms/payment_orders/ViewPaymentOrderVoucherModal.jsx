import { Field, ModalSimple, Tooltip } from "@/components/ui";
import { Box, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiEye } from "react-icons/hi2";
import PropTypes from "prop-types";
import { useReadPaymentVoucherById } from "@/hooks/payment_vouchers";

export const ViewPaymentOrderVoucherModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  const { data: dataPaymentVoucher, loading: isPaymentVoucherLoading } = useReadPaymentVoucherById(item?.id);
  console.log(dataPaymentVoucher);
  /*
    {
      "id": 2,
      "order": 2,
      "file_path": "https://iacerts-v2.s3.us-east-1.amazonaws.com/sga_uni/voucher/images-71111544-2025-06-22.pdf",
      "is_verified": false,
      "verified_at": null,
      "verified_by": null
    } 
  */

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
              {
                dataPaymentVoucher?.file_path ? (
                  <Box w='full' h='600px'>
                    <iframe
                      src={dataPaymentVoucher?.file_path}
                      width="100%"
                      height="100%"
                      title="Payment Voucher"
                      style={{ border: 'none' }}
                    />
                  </Box>
                ) : (
                  <Box w='full' h='600px' display='flex' alignItems='center' justifyContent='center'>
                    <Text>No hay voucher disponible.</Text>
                  </Box>
                )
              }
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