import { AddCourseModal } from "@/components/forms/courses";
import { AddCourseSchedule } from "@/components/forms/schedules";
import { CoursesTable } from "@/components/tables/courses";
import { InputGroup } from "@/components/ui";
import { useReadCourses } from "@/hooks/courses";
import { useReadSchedules } from "@/hooks/schedules";
//import { useReadUsers } from "@/hooks/users";
import { Box, Heading, HStack, Input, Spinner, Stack, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

export const CoursesAndSchedules = () => {
  const [tab, setTab] = useState(1);

  const [searchCourseName, setSearchCourseName] = useState('');

 // const { data: dataUsers } = useReadUsers();

  /*const filteredProfessors = dataUsers?.results?.filter(
    user => user.is_active && user.roles?.find(role => role.name === 'Docente')
  ) || [];
  
  const professorsOptions = filteredProfessors.map(user => ({
    value: user.id,
    label: user.full_name
  }));*/

  useEffect(() => {
    setSearchCourseName('');
  }, [tab])

  const { 
    data: dataCourses, 
    isLoading: isLoadingCourses, 
    refetch: fetchCourses
  } = useReadCourses();

  const { 
    data: dataSchedules, 
    isLoading: isLoadingSchedules, 
    refetch: fetchSchedules
  } = useReadSchedules();

  const filteredCourses = dataCourses?.results?.filter(course =>
    course.name.toLowerCase().includes(searchCourseName.toLowerCase())
  );

  return (
    <Box spaceY='5'>
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'start', sm: 'center' }}
        justify='space-between'
      >
        <Heading
          size={{
            xs: 'xs',
            sm: 'sm',
            md: 'md',
          }}
        >
          Gestión de Cursos
        </Heading>

        {tab === 1 ? (
          <AddCourseModal data={dataCourses?.results} fetchData={fetchCourses} />
        ) : (
          <AddCourseSchedule fetchData={fetchSchedules} />
        )}
      </Stack>

      <Tabs.Root
        value={tab}
        onValueChange={(e) => setTab(e.value)}
        size={{ base: 'sm', md: 'md' }}
      >
        <Tabs.List colorPalette='cyan'>
          <Tabs.Trigger value={1} color={tab === 1 ? 'uni.secondary' : ''}>
            Cursos
          </Tabs.Trigger>

        {/** <Tabs.Trigger value={2} color={tab === 2 ? 'uni.secondary' : ''}>
            Horarios
          </Tabs.Trigger> */} 
        </Tabs.List>

        <Tabs.Content value={1}>
          <Stack>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={{ base: 'start', sm: 'center' }}
              justify='space-between'
            >
              <Heading size='md'>Gestión de cursos</Heading>

              <HStack>
                <InputGroup flex='1' startElement={<FiSearch />}>
                  <Input
                    ml='1'
                    minW={{ base: 'auto', md: '400px' }}
                    size='sm'
                    placeholder='Buscar por nombre de curso'
                    value={searchCourseName}
                    onChange={(e) => setSearchCourseName(e.target.value)}
                  />
                </InputGroup>
              </HStack>
            </Stack>
            
            <CoursesTable
              data={filteredCourses}
              fetchData={fetchCourses}
              isLoading={isLoadingCourses}
              //professorsOptions={professorsOptions}
            />

          </Stack>
        </Tabs.Content>

        <Tabs.Content value={2}>
          <Stack>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={{ base: 'start', sm: 'center' }}
              justify='space-between'
            >
              <Heading size='md'>Gestión de horarios</Heading>

              <HStack>
                <InputGroup flex='1' startElement={<FiSearch />}>
                  <Input
                    ml='1'
                    size='sm'
                    placeholder='Buscar por nombre de curso'
                    value={searchCourseName}
                    onChange={(e) => setSearchCourseName(e.target.value)}
                  />
                </InputGroup>
              </HStack>
            </Stack>
             
             { isLoadingSchedules 
              ? (
                  <Spinner />
              ) : (
                <Text>{JSON.stringify(dataSchedules)}</Text>
              )}
          </Stack>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  )
}