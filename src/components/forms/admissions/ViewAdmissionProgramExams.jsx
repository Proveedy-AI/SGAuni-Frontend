import { Modal, Tooltip } from '@/components/ui';
import { useReadAdmissionEvaluationsByApplication } from '@/hooks/admissions_evaluations';
import { Box, Group, IconButton, Spinner, Stack, Table } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { AverageScoresModal, UpdateQualificationEvaluationModal, ViewEvaluationDetailModal } from './evaluations';

export const ViewAdmissionProgramExams = ({ item, fetchData }) => {
  const { data: dataEvaluationsByApplication, refetch: fetchExams,  isLoading } = useReadAdmissionEvaluationsByApplication(item.id);
  const contentRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <Modal
      title='Ver exámenes'
      placement='center'
      trigger={
        <Box>
          <Tooltip
            content='Ver exámenes'
            positioning={{ placement: 'bottom-center' }}
            showArrow
            openDelay={0}
          >
            <IconButton
              size='xs'
              colorPalette='blue'
              css={{ _icon: { width: '5', height: '5' } }}
            >
              <FiCheckCircle />
            </IconButton>
          </Tooltip>
        </Box>
      }
      size='4xl'
      open={open}
      hiddenFooter={true}
      onOpenChange={(e) => setOpen(e.open)}
      contentRef={contentRef}
    >
      <Stack spacing={4} css={{ '--field-label-width': '150px' }}>
        <AverageScoresModal applicationId={item.id} data={dataEvaluationsByApplication?.results} fetchData={fetchData} />
        <Table.Root size='sm' striped>
          <Table.Header>
            <Table.Row bg={{ base: 'its.100', _dark: 'its.gray.400' }}>
              <Table.ColumnHeader>N°</Table.ColumnHeader>
              <Table.ColumnHeader>Fecha</Table.ColumnHeader>
              <Table.ColumnHeader>Examenes realizados</Table.ColumnHeader>
              <Table.ColumnHeader>Calificación</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { isLoading && <Spinner /> }
            {
              !isLoading && dataEvaluationsByApplication?.results?.length > 0 ? (
                dataEvaluationsByApplication?.results?.map((evaluation, index) => (
                  <Table.Row key={evaluation.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{evaluation.start_date}</Table.Cell>
                    <Table.Cell>{evaluation.type_application_display}</Table.Cell>
                    <Table.Cell>{evaluation.qualification ?? '-'}</Table.Cell>
                    <Table.Cell>
                      <Group gap={2}>
                        <ViewEvaluationDetailModal data={evaluation} />
                        <UpdateQualificationEvaluationModal data={evaluation} fetchData={fetchExams} />
                      </Group>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign='center'>
                    Sin datos disponibles
                  </Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
                      </Table.Root>
      </Stack>
    </Modal>
  );
}

ViewAdmissionProgramExams.propTypes = {
  item: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
}