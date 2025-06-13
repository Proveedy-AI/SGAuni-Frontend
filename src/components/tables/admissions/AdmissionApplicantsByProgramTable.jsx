import { CreateProgramExamToAdmissionProgram } from '@/components/forms/admissions/createProgramExamToAdmissionProgram';
import {
  Pagination,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui';
import {
  Box,
  createListCollection,
  HStack,
  Span,
  Stack,
  Table,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const Row = memo(({ programId, item, fetchData, startIndex, index, permissions }) => {
  const navigate = useNavigate();
  const handleRowClick = () => {
    // if (permissions?.includes('admissions.myapplicants.view')) {
    //   navigate(`/admissions/myapplicants/${item.id}`);
    // }
    // if (permissions?.includes('admissions.applicants.view')) {
    //   navigate(`/admissions/applicants/${item.id}`);
    // }
    // Por ahora, sin permisos para ver los postulantes por programa
    navigate(`/admissions/applicants/programs/${programId}/estudiante/${item.id}`);
  };

  const applicationStatusEnum = [
    { id: 1, value:'Incomplete', label: 'En revisión', color: 'orange' },
    { id: 2, value:'Approved', label: 'Aprobado', color: 'green' },
    { id: 3, value:'rejected', label: 'Rechazado', color: 'red' },
    { id: 4, value:'Observed', label: 'Observado', color: 'purple' },
  ];

  const calificationStatusEnum = [
    { id: 1, value:'Pending', label: 'Pendiente', color: 'gray' },
    { id: 2, value:'Calificado', label: 'Calificado', color: 'green' },
  ];

  return (
    <Table.Row
       onClick={(e) => {
         if (e.target.closest('button') || e.target.closest('a')) return;
         handleRowClick();
       }}
      key={item.id}
      bg={index % 2 === 0 ? 'gray.100' : 'white'} // tu color alternado aquí
      _hover={{
        bg: 'blue.100',
        cursor: 'pointer',
      }}
    >
      <Table.Cell>{startIndex + index + 1}</Table.Cell>
      <Table.Cell>{item.person_full_name}</Table.Cell>
      <Table.Cell display={'flex'} alignItems='center' justifyContent='center' w={'150px'}>
        <Span
          bg={applicationStatusEnum.find(status => status.value === item.status_display)?.color}
          fontWeight='semibold'
          px={2}
          py={1}
          rounded={'md'}
          color={'white'}
        >
          {applicationStatusEnum.find(status => status.value === item.status_display)?.label}
        </Span>
      </Table.Cell>
      <Table.Cell>
        <Span
          bg={calificationStatusEnum.find(status => status.value === item.status_qualification_display)?.color}
          fontWeight='semibold'
          px={2}
          py={1}
          rounded={'md'}
          color={'white'}
        >
          {calificationStatusEnum.find(status => status.value === item.status_qualification_display)?.label}
        </Span>
      </Table.Cell>
      <Table.Cell onClick={(e) => e.stopPropagation()}>
        <HStack>
          <CreateProgramExamToAdmissionProgram
            item={item}
            fetchData={fetchData}
          />
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
});

Row.displayName = 'Row';

Row.propTypes = {
  programId: PropTypes.number,
  item: PropTypes.object,
  fetchData: PropTypes.func,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  permissions: PropTypes.array,
};

export const AdmissionApplicantsByProgramTable = ({ programId, data, fetchData, permissions }) => {

  const smallOptions = useMemo(
    () => [
      { label: '6', value: '6' },
      { label: '10', value: '10' },
      { label: '15', value: '15' },
    ],
    []
  );

  const mediumOptions = useMemo(
    () => [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '25', value: '25' },
    ],
    []
  );

  const largeOptions = useMemo(
    () => [
      { label: '13', value: '13' },
      { label: '26', value: '26' },
      { label: '39', value: '39' },
    ],
    []
  );

  const smallHeight = 350; // Base para pantallas pequeñas
  const mediumHeight = 530; // Para pantallas medianas
  const largeHeight = 690; // Para pantallas grandes

  const getTableHeight = () => {
    const width = window.innerWidth;
    if (width > 1900) return largeHeight; // Para pantallas muy grandes (large)
    if (width >= 1600) return mediumHeight; // Para pantallas medianas
    return smallHeight; // Para pantallas pequeñas
  };

  const [tableHeight, setTableHeight] = useState(getTableHeight());

  useEffect(() => {
    const handleResize = () => {
      setTableHeight(getTableHeight()); // Actualiza la altura cada vez que se redimensione
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getInitialPageSize = () => {
    const width = window.innerWidth;
    if (width > 1900) return largeOptions[0].value;
    if (width >= 1600) return mediumOptions[0].value;
    return smallOptions[0].value;
  };

  const getInitialPageSizeOptions = () => {
    const width = window.innerWidth;
    if (width > 1900) return largeOptions;
    if (width >= 1600) return mediumOptions;
    return smallOptions;
  };

  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [pageSizeOptions, setPageSizeOptions] = useState(
    getInitialPageSizeOptions()
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width > 1900) {
        setPageSizeOptions(largeOptions);
        if (parseInt(pageSize) < 13) setPageSize('13');
      } else if (width >= 1600) {
        setPageSizeOptions(mediumOptions);
        if (parseInt(pageSize) > 10 || parseInt(pageSize) < 10)
          setPageSize('10');
      } else {
        setPageSizeOptions(smallOptions);
        if (parseInt(pageSize) > 6) setPageSize('6');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pageSize, largeOptions, mediumOptions, smallOptions]);

  const startIndex = (currentPage - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const visibleRows = data?.slice(startIndex, endIndex);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };
  
  return (<Box
      bg={{ base: 'white', _dark: 'its.gray.500' }}
      p='3'
      borderRadius='10px'
      overflow='hidden'
      boxShadow='md'
    >
      <Table.ScrollArea
        style={{
          maxHeight: tableHeight,
        }}
      >
        <Table.Root size='sm' w='full'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>N°</Table.ColumnHeader>
              <Table.ColumnHeader>Nombres del postulante</Table.ColumnHeader>
              <Table.ColumnHeader>Estado de postulación</Table.ColumnHeader>
              <Table.ColumnHeader>Estado de calificación</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleRows?.map((item, index) => (
              <Row
                key={item.id}
                programId={programId}
                item={item}
                permissions={permissions}
                fetchData={fetchData}
                startIndex={startIndex}
                index={index}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Stack
        w='full'
        direction={{ base: 'column', sm: 'row' }}
        justify={{ base: 'center', sm: 'space-between' }}
        pt='2'
      >
        <SelectRoot
          collection={createListCollection({
            items: pageSizeOptions,
          })}
          size='xs'
          w='150px'
          display={{ base: 'none', sm: 'block' }}
          defaultValue={pageSize}
          onChange={(event) => handlePageSizeChange(event.target.value)}
        >
          <SelectTrigger>
            <SelectValueText placeholder='Seleccionar filas' />
          </SelectTrigger>
          <SelectContent bg={{ base: 'white', _dark: 'its.gray.500' }}>
            {pageSizeOptions.map((option) => (
              <SelectItem
                _hover={{
                  bg: {
                    base: 'its.100',
                    _dark: 'its.gray.400',
                  },
                }}
                key={option.value}
                item={option}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>

        <Pagination
          count={data?.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Stack>
    </Box>
  );
}

AdmissionApplicantsByProgramTable.propTypes = {
  programId: PropTypes.number,
  data: PropTypes.array,
  fetchData: PropTypes.func,
  permissions: PropTypes.array,
}