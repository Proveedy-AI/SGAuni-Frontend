import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { EnrolledCourseGroupsTable } from "@/components/tables/tuition/enrolled";
import { InputGroup } from "@/components/ui";
import ResponsiveBreadcrumb from "@/components/ui/ResponsiveBreadcrumb";
import { useReadEnrollmentProgramCourses } from "@/hooks/enrollments_programs/courses";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { Box, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useParams } from "react-router";

export const EnrolledCourseGroupsView = () => {
  const { id } = useParams();
  const decoded = decodeURIComponent(id);
  const decrypted = Encryptor.decrypt(decoded);

  const { data: profile } = useReadUserLogged();
    const roles = profile?.roles || [];
    const permissions = roles
      .flatMap((r) => r.permissions || [])
      .map((p) => p.guard_name);

  const {
    data: dataCourseGroups,
		fetchNextPage: fetchNextCourseGroups,
		hasNextPage: hasNextPageCourseGroups,
		isFetchingNextPage: isFetchingNextCourseGroups,
		refetch: fetchCourseGroups,
		isLoading,
  } = useReadEnrollmentProgramCourses(
    { /*enrollment_id: decrypted*/ },
    {}
  );

  const [searchName, setSearchName] = useState('');

  const allCourseGroups =
		dataCourseGroups?.pages?.flatMap((page) => page.results) ?? [];

  const isFiltering = searchName.length > 0;

  const filteredCourseGroups = allCourseGroups.filter(
    (group) =>
    (!searchName ||
      group.course_group_name
        .toLowerCase()
        .includes(searchName.toLowerCase())
    )
  );

  const totalCount = isFiltering
    ? filteredCourseGroups.length
    : (allCourseGroups?.length ?? 0);

  return (
    <Box spaceY='5' p={{ base: 4, md: 6 }} maxW="8xl" mx="auto">
      <ResponsiveBreadcrumb
        items={[
          { label: 'Matriculados', to: '/enrollments/enrolled' },
          { label: id ? id : 'Cargando...' },
        ]}
      />

      <Stack
        Stack
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
          Grupos de Cursos
        </Heading>
      </Stack>

      <Stack
        Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'center', sm: 'center' }}
        justify='space-between'
      >
        <InputGroup flex='1' startElement={<FiSearch />}>
          <Input
            ml='1'
            size='sm'
            bg={'white'}
            maxWidth={'550px'}
            placeholder='Buscar por nombre del programa ...'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value) }
          />
        </InputGroup>
      </Stack>

      <EnrolledCourseGroupsTable
        data={filteredCourseGroups}
        fetchData={fetchCourseGroups}
        isLoading={isLoading}
        hasNextPage={hasNextPageCourseGroups}
        fetchNextPage={fetchNextCourseGroups}
        isFetchingNextPage={isFetchingNextCourseGroups}
        totalCount={totalCount}
        permissions={permissions}
      />
    </Box>
  )
}