import { Field, ModalSimple, Tooltip } from '@/components/ui';
import {
  Card,
  IconButton,
  Input,
  Stack,
  Text,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
  HiBookOpen,
  HiEye,
} from 'react-icons/hi2';
import PropTypes from 'prop-types';
import { useReadCurriculumMapsCourses } from '@/hooks/curriculum_maps_courses';
import { CurriculumMapsCoursesTable } from '@/components/tables/curriculum_maps_courses';

export const PreviewCurriculumMap = ({ item }) => {
  const contentRef = useRef();
  const [open, setOpen] = useState(false);

  const {
    data: dataCurriculumMapsCourses,
    isLoading: isLoadingCurriculumMapsCourses,
    refetch: fetchCurriculumMapsCourses,
  } = useReadCurriculumMapsCourses();

  const filteredCoursesByCurriculumMap = dataCurriculumMapsCourses?.results
    ?.filter(
      (course) => course.curriculum_map === item.id
    );

  return (
    <Stack css={{ '--field-label-width': '180px' }}>
      <Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
        <ModalSimple
          trigger={
            <Box>
              <Tooltip
                content='Ver Malla Curricular'
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
          placement='center'
          size='6xl'
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
          onSave={() => {}}
          hiddenFooter={true}
          contentRef={contentRef}
        >
          <Stack spacing={6}>
            <Card.Root>
              <Card.Header
                display='flex'
                flexDirection='row'
                alignItems='center'
                gap={2}
                color='blue.500'
              >
                <HiBookOpen size={24} />
                <Text fontSize='lg' fontWeight='semibold'>
                  Información de la Malla
                </Text>
              </Card.Header>
              <Card.Body>
                <SimpleGrid columns={{ base: 1, md: 5 }} gap={4}>
                  <Field label='Código' gridColumn={{ base: 'span 1',  md: 'span 2' }}>
                    <Input readOnly variant="flushed" value={item.code} />
                  </Field>
                  <Field label='Año'>
                    <Input readOnly variant="flushed" value={item.year} />
                  </Field>
                  <Field label='Total de cursos'>
                    <Input readOnly variant="flushed" value={item.total_courses} />
                  </Field>
                  <Field label='¿Es actual?'>
                    <Input readOnly variant="flushed" value={item.is_current ? 'Sí' : 'No'} />
                  </Field>
                </SimpleGrid>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header
                display='flex'
                flexDirection='row'
                alignItems='center'
                gap={2}
                color='orange.500'
              >
                <HiBookOpen size={24} />
                <Text fontSize='lg' fontWeight='semibold'>
                  Cursos de la Malla Curricular
                </Text>
              </Card.Header>
              <Card.Body>
                <CurriculumMapsCoursesTable
                  data={filteredCoursesByCurriculumMap}
                  isLoading={isLoadingCurriculumMapsCourses}
                  fetchData={fetchCurriculumMapsCourses}
                />
              </Card.Body>
              {/* <Card.Body>
                <Stack spacing={4}>
                  {localCourses.map((course) => (
                    <Box
                      key={course.id}
                      border='2px solid'
                      borderColor='orange.200'
                      borderRadius='xl'
                      p={4}
                      bg='orange.50'
                    >
                      <Flex align='center' gap={3}>
                        <Badge colorScheme='orange' fontSize='md'>
                          {course.code}
                        </Badge>
                        <Text fontWeight='bold' fontSize='lg'>
                          {course.name}
                        </Text>
                        <Badge colorScheme='yellow'>Ciclo {course.cycle}</Badge>
                      </Flex>
                      <Box mt={2}>
                        <Field label='Prerequisitos'>
                          <ReactSelect
                            value={course.pre_requisites.map((pr) => ({
                              value: pr.id,
                              label: `${pr.code} - ${pr.name}`,
                            }))}
                            options={coursesOptions}
                            isMulti
                            isClearable
                            isSearchable
                            placeholder='Sin prerequisitos'
                            isDisabled
                          />
                        </Field>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card.Body> */}
            </Card.Root>
          </Stack>
        </ModalSimple>
      </Field>
    </Stack>
  );
};

PreviewCurriculumMap.propTypes = {
  item: PropTypes.object.isRequired,
};