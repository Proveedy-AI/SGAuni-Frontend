import PropTypes from 'prop-types';
import { Field, ModalSimple, Tooltip } from "@/components/ui";
import { useRef, useState } from "react";
import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import { HiEye } from 'react-icons/hi2';

export const ViewCourseModal = ({ item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  return (
    <ModalSimple
      title='Agregar nuevo curso'
      placement='center'
      // size='lg'
      trigger={
        <Box>
          <Tooltip
            content='Ver curso'
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
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
      hiddenFooter={true}
    >
      <Stack css={{ '--field-label-width': '120px' }}>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Código del curso:'
        >
          <Input
            readOnly
            value={item.code}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Nombre del curso:'
        >
          <Input
            readOnly
            value={item.name}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Créditos:'
        >
          <Input
            readOnly
            value={item.credits}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Tipo de curso:'
        >
          <Input
            readOnly
            value={item.type}
            size='xs'
          />
        </Field>
        <Field
          orientation={{ base: 'vertical', sm: 'horizontal' }}
          label='Curso pre-requisito:'
        >
          <Input
            readOnly
            value={item.pre_requisite}
            size='xs'
          />
        </Field>
      </Stack>
    </ModalSimple>
    );
  };
  
ViewCourseModal.propTypes = {
  item: PropTypes.object,
};