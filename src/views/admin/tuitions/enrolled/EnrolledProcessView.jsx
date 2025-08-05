import { EnrolledProcessTable } from "@/components/tables/tuition/enrolled";
import { InputGroup } from "@/components/ui";
import { useReadEnrollments } from "@/hooks/enrollments_proccess";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { Box, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export const EnrolledProcessView = () => {
  const {
      data: dataEnrollments,
      isLoading,
    } = useReadEnrollments();
    const { data: profile } = useReadUserLogged();
    const roles = profile?.roles || [];
    const permissions = roles
      .flatMap((r) => r.permissions || [])
      .map((p) => p.guard_name);
  
    const [searchValue, setSearchValue] = useState('');
  
    const filteredEnrolledProcesses = dataEnrollments?.results?.filter((item) => {
      const matchesSearch = item.academic_period_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
      return matchesSearch; // && matchesStatus;
    });
  
    return (
      <Box spaceY='5'>
        <Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>
          Matrículados
        </Heading>
  
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'start', sm: 'center' }}
          justify='space-between'
          flexWrap={'wrap'}
          gap={22}
        >
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'start', sm: 'center' }}
            flexWrap={'wrap'}
            flex={1}
          >
            <InputGroup
              startElement={<FiSearch />}
              flex={1}
              minW={'240px'}
              maxW={'400px'}
            >
              <Input
                size='sm'
                bg={'white'}
                maxWidth={'450px'}
                placeholder='Buscar por período'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </InputGroup>
          </Stack>
        </Stack>
  
        <EnrolledProcessTable
          data={filteredEnrolledProcesses}
          isLoading={isLoading}
          permissions={permissions}
        />
      </Box>
    );
}