import { Box, Card, Flex, Table, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Pagination } from "@/components/ui";
import { useState } from "react";
import useSortedData from "@/utils/useSortedData";
import { SortableHeader } from "@/components/ui/SortableHeader";
import { usePaginationSettings } from "@/components/navigation/usePaginationSettings";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { GenerateStudentsByCoursePdfModal } from "@/components/modals/tuition/enrolled/GenerateStudentsByCoursePdfModal";

const Row = ({ item, data, startIndex, index, sortConfig }) => {

  return (
    <Table.Row _hover={{ bg: 'gray.50' }}>
      <Table.Cell>
        {sortConfig?.key === 'index' && sortConfig?.direction === 'desc'
          ? data.length - (startIndex + index)
          : startIndex + index + 1}
      </Table.Cell>
      <Table.Cell>{item.full_name}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>{item.document}</Table.Cell>
      <Table.Cell>{item.code || 'Sin código'}</Table.Cell>
    </Table.Row>
  );
};

Row.propTypes = {
  item: PropTypes.object,
  data: PropTypes.array,
  startIndex: PropTypes.number,
  index: PropTypes.number,
  sortConfig: PropTypes.object,
};

export const EnrolledStudentsTable = ({ data = {}, students = [], isLoading = false }) => {
  const { pageSize, setPageSize, pageSizeOptions } = usePaginationSettings();
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [sortConfig, setSortConfig] = useState(null);
  const sortedData = useSortedData(students, sortConfig);
  const visibleRows = sortedData?.slice(startIndex, endIndex);

  const isDownloadable = students.length > 0;

  return (
    <Card.Root>
      <Card.Header py={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="md" color="gray.500" mb={1}>
            {students.length} {students.length === 1 ? 'estudiante encontrado' : 'estudiantes encontrados'}
          </Text>
          <GenerateStudentsByCoursePdfModal
            isDownloadable={isDownloadable}
            data={data}
            students={students}
          />
        </Flex>
      </Card.Header>

      <Card.Body p={0}>
        <Box
          bg={{ base: 'white', _dark: 'its.gray.500' }}
          p='3'
          borderRadius='10px'
          overflow='hidden'
        >
          <Table.ScrollArea>
            <Table.Root size='sm' w='full'>
              <Table.Header>
                <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
                  <Table.ColumnHeader w='5%'>
                    <SortableHeader
                      label='N°'
                      columnKey='index'
                      sortConfig={sortConfig}
                      onSort={setSortConfig}
                    />
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW="250px">
                    <SortableHeader
                      label='Nombre Completo'
                      columnKey='full_name'
                      sortConfig={sortConfig}
                      onSort={setSortConfig}
                    />
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>
                    <SortableHeader
                      label='Documento'
                      columnKey='student_document'
                      sortConfig={sortConfig}
                      onSort={setSortConfig}
                    />
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>
                    <SortableHeader
                      label='Correo'
                      columnKey='email'
                      sortConfig={sortConfig}
                      onSort={setSortConfig}
                    />
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>
                    <SortableHeader
                      label='Código'
                      columnKey='code'
                      sortConfig={sortConfig}
                      onSort={setSortConfig}
                    />
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {isLoading ? (
                  <SkeletonTable columns={5} />
                ) : visibleRows?.length > 0 ? (
                  visibleRows.map((student, index) => (
                    <Row 
                      key={index}
                      item={student} 
                      sortConfig={sortConfig}
                      startIndex={startIndex}
                      index={index}
                      data={students}
                    />
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} textAlign='center' py={2}>
                      No hay estudiantes disponibles.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          <Pagination
            count={students?.length}
            pageSize={Number(pageSize)}
            currentPage={currentPage}
            pageSizeOptions={pageSizeOptions}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </Box>
      </Card.Body>
    </Card.Root>
  );
};

EnrolledStudentsTable.propTypes = {
  data: PropTypes.object,
  students: PropTypes.array,
  isLoading: PropTypes.bool,
};