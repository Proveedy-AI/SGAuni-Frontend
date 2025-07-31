import { Encryptor } from "@/components/CrytoJS/Encryptor";
import { useReadMyEnrollments } from "@/hooks/person";
import { useReadUserLogged } from "@/hooks/users/useReadUserLogged";
import { Box, Heading, Text, Spinner, Badge, Flex, Card, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export const MyEnrollmentsToViewCourses = () => {
  const navigate = useNavigate()
  const { data: profile } = useReadUserLogged();
  const roles = profile?.roles || [];
  const permissions = roles
  .flatMap((r) => r.permissions || [])
  .map((p) => p.guard_name);

  const { data: myEnrollments, isLoading: isLoadingEnrollments } = useReadMyEnrollments();
  
  /*
  {
    "id": 1,
    "student": 1,
    "enrollment_period_program": 1,
    "program_id": 2,
    "program_name": "Maestria en Administración",
    "program_period": "2025-1",
    "payment_verified": true,
    "is_first_enrollment": true,
    "status": 1,
    "status_display": "Pago pendiente",
    "verified_at": "2025-07-17T16:04:20.478000-05:00",
    "uuid": "60980045-6cab-40ff-b5ec-b8b9773b76f6",
    "max_installments": 3,
    "min_payment_percentage": "0.40",
    "is_current_enrollment": false
  }
  */

  const handleCardClick = (item) => {
    console.log(item)
    const encrypted = Encryptor.encrypt(item.id); // id enrollment
    const encoded = encodeURIComponent(encrypted);
    if (permissions.includes('enrollments.mycourses.view')) navigate(`/mycourses/enrollment/${encoded}`);
    };

  return (
    <Box p={4}>
      <Heading as="h2" size="md" mb={4}>
        Mis Inscripciones
      </Heading>
      {isLoadingEnrollments ? (
        <Spinner />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {myEnrollments?.map((enrollment) => (
            <Card.Root
              key={enrollment.id}
              mb={4}
              p={0}
              cursor={"pointer"}
              onClick={(e) => {
              if (e.target.closest('button') || e.target.closest('a')) return;
              handleCardClick(enrollment);
            }}
            >
              <Card.Header bg={"red.300"} pt={36}></Card.Header>
              <Card.Body>
                <Flex justify="space-between" align="center" mb={2}>
                  <Heading as="h3" size="sm">
                    {enrollment.program_name}
                  </Heading>
                  <Badge colorScheme="blue">{enrollment.program_period}</Badge>
                </Flex>
                {enrollment.verified_at && (
                  <Text fontSize="xs" color="gray.500">
                    Verificado el: {new Date(enrollment.verified_at).toLocaleString()}
                  </Text>
                )}
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};