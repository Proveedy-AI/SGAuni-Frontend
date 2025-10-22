import { Button, Field, ModalSimple } from '@/components/ui';
import {
	Stack,
	Heading,
	Card,
	Badge,
	SimpleGrid,
	Input,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { BsBook } from 'react-icons/bs';
import { CreateCurriculumMaps } from './curriculum_maps';
import { CurriculumMapsTable } from '@/components/tables/curriculum_maps';
import { useReadCurriculumMaps } from '@/hooks/curriculum_maps';
import { FiBook } from 'react-icons/fi';

export const ViewCurriculumMaps = ({ item }) => {
	const contentRef = useRef();
	const [open, setOpen] = useState(false);

	const {
		data: curriculumMaps,
		isLoading,
		refetch: fetchCurriculumMaps,
	} = useReadCurriculumMaps(
    { program: item.id },
    { enabled: open && !!item.id }
  );

	const filteredCurriculumMaps = curriculumMaps?.results || [];
	const filteredCurrentMap = filteredCurriculumMaps.filter((map) => map.is_current);

	return (
		<Stack css={{ '--field-label-width': '180px' }}>
			<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
				<ModalSimple
					trigger={
						<Button colorPalette='purple' size='xs'>
							<BsBook /> Ver mallas
						</Button>
					}
					placement='center'
					size='5xl'
					open={open}
					onOpenChange={(e) => setOpen(e.open)}
					hiddenFooter={true}
					contentRef={contentRef}
				>
					<Stack spacing={6}>
						<Card.Root>
							<Card.Header>
								<Heading
									size='md'
									display='flex'
									alignItems='center'
									gap={2}
									color='green.500'
									fontSize='lg'
									fontWeight='semibold'
								>
									<FiBook size={24} /> Información del programa
								</Heading>
							</Card.Header>
							<Card.Body>
								<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
									<Stack>
										<Heading size='md'>Programa</Heading>
										<Input value={item.name} readOnly variant='flushed' />
									</Stack>
									<Stack>
										<Heading size='md'>Malla Actual</Heading>
										<Input
											value={
												filteredCurrentMap.length > 0
													? `${filteredCurrentMap[0].year} - ${filteredCurrentMap[0].code}`
													: 'No hay malla actual'
											}
											readOnly
											variant='flushed'
										/>
									</Stack>
								</SimpleGrid>
							</Card.Body>
						</Card.Root>

						<CreateCurriculumMaps
							program={item}
							curriculumMaps={filteredCurriculumMaps}
							fetchData={fetchCurriculumMaps}
						/>

						<Card.Root>
							<Card.Header>
                <Heading
                  size='md'
                  display='flex'
                  alignItems='center'
                  gap={2}
                  color='blue.500'
                  fontSize='lg'
                  fontWeight='semibold'
                >
                  <FiBook size={24} />
                  Mallas Curriculares{' '}
                  <Badge ml={2} bg='blue.100' color='blue.500' size='lg' fontSize='md'>
                    {filteredCurriculumMaps?.length}
                  </Badge>
                </Heading>
              </Card.Header>

              <Card.Body>
                <CurriculumMapsTable
                  data={filteredCurriculumMaps}
                  fetchData={fetchCurriculumMaps}
                  isLoading={isLoading}
                />
              </Card.Body>

						</Card.Root>
					</Stack>
				</ModalSimple>
			</Field>
		</Stack>
	);
};

ViewCurriculumMaps.propTypes = {
	item: PropTypes.object,
};
