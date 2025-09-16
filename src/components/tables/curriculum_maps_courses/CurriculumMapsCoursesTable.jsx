import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Badge, Box, Card, Flex, Group, Heading, HStack, IconButton, Table } from '@chakra-ui/react';
import { ModalSimple, Pagination, toaster, Tooltip } from '@/components/ui';
import useSortedData from '@/utils/useSortedData';
import { SortableHeader } from '@/components/ui/SortableHeader';
import { usePaginationSettings } from '@/components/navigation/usePaginationSettings';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { HiBookOpen,HiTrash} from 'react-icons/hi2';
import { useDeleteCurriculumMapCourse } from '@/hooks/curriculum_maps_courses';

const Row = memo(
  ({
    curriculumMap,
    item,
    startIndex,
    index,
    sortConfig,
    data,
    fetchData,
  }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewPreRequisitesModalOpen, setViewPreRequisitesModalOpen] = useState(false);

    const { mutate: deleteCurriculumMapCourse, isLoading } = useDeleteCurriculumMapCourse();

    const handleDeleteCourse = () => {
      deleteCurriculumMapCourse(item.id, {
        onSuccess: () => {
          toaster.create({
            title: 'Curso eliminado de la malla curricular',
            type: 'success',
          });
          setDeleteModalOpen(false);
          fetchData();
        },
        onError: (error) => {
          toaster.create({
            title: 'Error al eliminar el curso de la malla curricular',
            description: error?.response?.data?.message || error.message,
            type: 'error',
          });
        }
      });
    };

    return (
      <Table.Row key={item.id} bg={{ base: 'white', _dark: 'its.gray.500' }}>
        <Table.Cell>
          {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
            ? data.length - (startIndex + index)
            : startIndex + index + 1}
        </Table.Cell>
        <Table.Cell>{item.course_code}</Table.Cell>
        <Table.Cell>{item.course_name}</Table.Cell>
        <Table.Cell>{item.cycle}</Table.Cell>
        <Table.Cell>{item.credits}</Table.Cell>
        <Table.Cell textAlign="center">
          <Badge bg={item.credits ? 'green.200' : 'red.200'} color={item.credits ? 'green.500' : 'red.500'}>
            {item.credits ? 'Si' : 'No'}
          </Badge>
        </Table.Cell>
        <Table.Cell>
          <HStack justify='space-between'>
            <Group>
              <ModalSimple
                trigger={
                  <Box>
                    <Tooltip
                      content={item?.prerequisite?.length === 0 ? 'No hay Prerrequisitos' : 'Ver Prerrequisitos'}
                      positioning={{ placement: 'bottom-center' }}
                      showArrow
                      openDelay={0}
                    >
                      <IconButton 
                        colorPalette='blue' 
                        size='xs'
                        disabled={item?.prerequisite?.length === 0}
                      >
                        <HiBookOpen />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                placement='center'
                open={viewPreRequisitesModalOpen}
                onOpenChange={(e) => setViewPreRequisitesModalOpen(e.open)}
                size='4xl'
                hiddenFooter={true}
              >
                <Card.Root minH='250px'>
                  <Card.Header>
                    <Heading size='lg'>Prerrequisitos del Curso {item.course_code}</Heading>
                  </Card.Header>
                  <Card.Body>
                    <Flex wrap='wrap'>
                      {item?.prerequisite?.length === 0 ? (
                        <Box>No hay prerrequisitos para este curso.</Box>
                      ) : item?.prerequisite?.map((prereq, idx) => (
                        <Badge size="md" key={idx} colorPalette='blue' variant='subtle' m={1}>
                          {prereq}
                        </Badge>
                      ))}
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </ModalSimple>
              <ModalSimple
                trigger={
                  <Box>
                    <Tooltip
                      content='Eliminar Curso de la Malla'
                    >
                      <IconButton colorPalette='red' size='xs' disabled={!curriculumMap?.editable}>
                        <HiTrash />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                placement='center'
                open={deleteModalOpen}
                onOpenChange={(e) => setDeleteModalOpen(e.open)}
                size='4xl'
                onSave={handleDeleteCourse}
                isLoading={isLoading}
                saveLabel='Si, Eliminar'
              >

              </ModalSimple>
            </Group>
          </HStack>
        </Table.Cell>
      </Table.Row>
    );
  }
);

Row.displayName = 'Row';

Row.propTypes = {
  curriculumMap: PropTypes.object,
  item: PropTypes.object,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  sortConfig: PropTypes.object,
  data: PropTypes.array,
  fetchData: PropTypes.func,
};

export const CurriculumMapsCoursesTable = ({
  curriculumMap,
  data,
  isLoading,
  fetchData,
}) => {
  const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [sortConfig, setSortConfig] = useState(null);
  const sortedData = useSortedData(data, sortConfig);
  const visibleRows = sortedData?.slice(startIndex, endIndex);

  return (
    <Box
      bg={{ base: 'white', _dark: 'its.gray.500' }}
      p='3'
      borderRadius='10px'
      overflow='hidden'
      boxShadow='sm'
    >
      <Table.ScrollArea>
        <Table.Root size='sm' w='full' striped>
          <Table.Header>
            <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
              <Table.ColumnHeader textAlign="center" w='5%'>
                <SortableHeader
                  label='N°'
                  columnKey='index'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" w='25%'>
                <SortableHeader
                  label='Código'
                  columnKey='course_code'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" w='30%'>
                <SortableHeader
                  label='Nombre'
                  columnKey='course_name'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" w='10%'>
                <SortableHeader
                  label='Ciclo'
                  columnKey='cycle'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" w='10%'>
                <SortableHeader
                  label='Créditos'
                  columnKey='credits'
                  sortConfig={sortConfig}
                  onSort={setSortConfig}
                  textAlign="center"
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" w='5%'>Obligatorio</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" w='15%'>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <SkeletonTable columns={7} />
            ) : visibleRows?.length > 0 ? (
              visibleRows.map((item, index) => (
                <Row
                  key={item.id}
                  curriculumMap={curriculumMap}
                  item={item}
                  data={data}
                  sortConfig={sortConfig}
                  startIndex={startIndex}
                  index={index}
                  fetchData={fetchData}
                />
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign='center' py={2}>
                  No hay datos disponibles.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <Pagination
        count={data?.length}
        pageSize={pageSize}
        currentPage={currentPage}
        pageSizeOptions={pageSizeOptions}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </Box>
  );
};

CurriculumMapsCoursesTable.propTypes = {
  curriculumMap: PropTypes.object,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  fetchData: PropTypes.func,
};
