import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { Button, Modal, Tooltip } from '@/components/ui';
import { Box, Card, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router';

export const ViewCourseGroupsModal = ({ item, hasView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [open, setOpen] = useState(false);
  console.log({ item, hasView });

  const handleRowClick = (courseGroupId) => {
    const encrypted = Encryptor.encrypt(courseGroupId);
    const encoded = encodeURIComponent(encrypted);
    
    navigate(`${location.pathname}/${encoded}`);
  };
  

  return (
    <Modal
			title='Grupos del curso'
			placement='center'
			size='4xl'
			trigger={
        <Box>
          <Tooltip 
            content='Ver grupos de curso'
						positioning={{ placement: 'bottom-center' }}
						showArrow
						openDelay={0}
          >
            <Button size='xs' bg='blue.600' disabled={!hasView}>
              <FiEye />
            </Button>
          </Tooltip>
        </Box>
			}
      hiddenFooter={true}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
		>
      <Card.Root>
        <Card.Header fontWeight="semibold" fontSize="lg" bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
          {item?.code} - {item?.course} 
        </Card.Header>
        <Card.Body>
          <Box
            bg={{ base: 'white', _dark: 'its.gray.500' }}
            p='3'
            borderRadius='2px'
            overflow='hidden'
            boxShadow='sm'
          >
            <Table.ScrollArea>
              <Table.Root size='sm' w='full'>
                <Table.Header>
                  <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                    <Table.ColumnHeader>Codigo de Grupo</Table.ColumnHeader>
                    <Table.ColumnHeader>Docente</Table.ColumnHeader>
                    <Table.ColumnHeader>Capacidad total</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {item?.course_groups?.map((group, index) => (
                    <Table.Row 
                      key={index}
                      onClick={(e) => {
                        if (e.target.closest('button') || e.target.closest('a')) return;
                        handleRowClick(group.id);
                      }}
                    >
                      <Table.Cell>{group.group_code}</Table.Cell>
                      <Table.Cell>{group.teacher}</Table.Cell>
                      <Table.Cell>{group.capacity}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>
        </Card.Body>
      </Card.Root>
    </Modal>
  );
};

ViewCourseGroupsModal.propTypes = {
  item: PropTypes.object,
  hasView: PropTypes.bool,
}