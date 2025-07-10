import PropTypes from 'prop-types';
import { Field, ModalSimple, Tooltip } from "@/components/ui";
import { useRef, useState } from "react";
import { Box, Card, Flex, Icon, IconButton, Input, Stack, Textarea } from '@chakra-ui/react';
import { HiEye } from 'react-icons/hi2';
import { FiBookOpen } from 'react-icons/fi';

export const ViewCourseModal = ({ item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  
  return (
    <ModalSimple
      title='Vista previa de curso'
      placement='center'
      size='xl'
      trigger={
        <Box>
          <Tooltip
            content='Vista previa de curso'
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
      <Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '65vh' }}
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
          <Card.Header>
            <Card.Title
              display='flex'
              alignItems='center'
              gap={2}
              fontSize='lg'
            >
              <Icon as={FiBookOpen} boxSize={5} color='blue.600' />
              Información Básica del curso
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Flex flexDirection='column' gap={3}>
              <Field
                label='Código del curso:'
              >
                <Input
                  readOnly
                  value={item.code}
                  size='xs'
                />
              </Field>
              <Field
                label='Nombre del curso:'
              >
                <Input
                  readOnly
                  value={item.name}
                  size='xs'
                />
              </Field>
              <Field
                label='Descripción:'
              >
                <Textarea
                  readOnly
                  value={item.description}
                  size='xs'
                  placeholder='Descripción del curso'
                  css={{ height: '60px', resize: 'none', overflowY: 'auto' }}
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{ borderColor: 'gray.300', boxShadow: 'none' }}
                />
              </Field>
              <Flex flexDirection={{ base:'column', md: 'row' }} gap={3}>
                <Field
                  label='Créditos:'
                >
                  <Input
                    readOnly
                    value={item.default_credits}
                    size='xs'
                  />
                </Field>
                <Field
                  label='Nivel de curso:'
                >
                  <Input
                    readOnly
                    value={item.level || '-'}
                    size='xs'
                  />
              </Field>
              </Flex>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Stack>
    </ModalSimple>
    );
  };
  
ViewCourseModal.propTypes = {
  item: PropTypes.object,
};