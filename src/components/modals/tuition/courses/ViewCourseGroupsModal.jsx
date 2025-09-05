import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { Button, Modal } from '@/components/ui';
import { Box, Card, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router';

export const ViewCourseGroupsModal = ({ item, hasView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [open, setOpen] = useState(false);

  const handleRowClick = (courseGroupId) => {
    const encrypted = Encryptor.encrypt(courseGroupId);
    const encoded = encodeURIComponent(encrypted);
    
    navigate(`${location.pathname}/${encoded}`);
  };
  

  return (
    <Modal
			title='Grupos del curso'
			placement='center'
			size='2xl'
			trigger={
        <Button size='xs' bg='blue.600' disabled={!hasView}>
          <FiEye /> Ver Grupos
        </Button>
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
            border='1px solid'
            borderColor="gray.200"
            borderRadius='2px'
            overflow='hidden'
          >
            <Table.ScrollArea borderRadius='2px'>
              <Table.Root size='sm' w='full' boxShadow='xs'>
                <Table.Header>
                  <Table.Row bg='gray.100'>
                    <Table.ColumnHeader>N°</Table.ColumnHeader>
                    <Table.ColumnHeader>Codigo de Grupo</Table.ColumnHeader>
                    <Table.ColumnHeader>Docente</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {item?.groups?.length > 0 ? item?.groups?.map((group, index) => (
                    <Table.Row 
                      key={index}
                      onClick={(e) => {
                        if (e.target.closest('button') || e.target.closest('a')) return;
                        handleRowClick(group.id);
                      }}
                      bg={ index % 2 === 0 ? 'white' : 'gray.100' }
                      _hover={{ bg: 'blue.200', cursor: 'pointer' }}
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{group.group_code}</Table.Cell>
                      <Table.Cell>{group.teacher_name}</Table.Cell>
                    </Table.Row>
                  )) : (
                    <Table.Row>
                      <Table.Cell colSpan={2} textAlign='center'>
                        No hay grupos disponibles
                      </Table.Cell>
                    </Table.Row>
                  )}
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