import PropTypes from 'prop-types';
import { Badge, Box, Card, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { FiBookOpen, FiTrendingUp } from 'react-icons/fi';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { LuGoal } from 'react-icons/lu';

export const AcademicProgressSection = ({ academicProgress, isLoading }) => {
	if (isLoading) {
		return (
			<Card.Root mx="auto" bg="white" borderRadius="lg" w="full">
				<Card.Header
					py={4}
					bg="blue.50"
					borderBottom="1px solid"
					borderColor="blue.200"
				>
					<Flex align="center" gapX={3}>
						<Icon as={FiBookOpen} boxSize={5} />
						<Text fontSize="lg" fontWeight="bold" color="blue.700">
							Resumen Académico
						</Text>
					</Flex>
				</Card.Header>
				<Card.Body p={6}>
					<Text color="gray.500">Cargando información académica...</Text>
				</Card.Body>
			</Card.Root>
		);
	}

	if (!isLoading && !academicProgress) {
		return (
			<Card.Root mx="auto" bg="white" borderRadius="lg" w="full">
				<Card.Header
					py={4}
					bg="blue.50"
					borderBottom="1px solid"
					borderColor="blue.200"
				>
					<Flex align="center" gapX={3}>
						<Icon as={FiBookOpen} boxSize={5} />
						<Text fontSize="lg" fontWeight="bold" color="blue.700">
							Resumen Académico
						</Text>
					</Flex>
				</Card.Header>
				<Card.Body p={6}>
					<Text color="gray.500">No se encontró información académica.</Text>
				</Card.Body>
			</Card.Root>
		);
	}

	const { credits, averages, milestones } = academicProgress;

	return (
		<Flex
			direction={{ base: 'column', xl: 'row' }}
			gap={4}
			align="stretch"
			w="full"
		>
			{/* Resumen de créditos */}
			<Card.Root
				w="full"
				maxW={{ base: '100%', xl: '33%' }}
				flex={1}
				borderRadius="md"
			>
				<Card.Header
					py={3}
					borderBottom="1px solid"
					borderColor="gray.200"
				>
					<HStack spacing={2}>
						<Icon as={LuGoal} color="blue.500" />
						<Text fontSize="lg" fontWeight="bold" color="blue.700">
							Resumen de Créditos
						</Text>
					</HStack>
				</Card.Header>

				<Card.Body px={6} py={3} gapY={2}>
					<HStack justify="space-between" align="center" py={1}>
						<Text fontSize="sm" color="blue.600">
							Aprobados
						</Text>
						<Badge justifyContent={"center"} colorPalette="blue" fontSize="sm" boxSize={7}>
							{credits.total_approved}
						</Badge>
					</HStack>
					<HStack justify="space-between" align="center" py={1}>
						<Text fontSize="sm" color="blue.600">
							Matriculados totales
						</Text>
						<Badge justifyContent={"center"} colorPalette="blue" fontSize="sm" boxSize={7}>
							{credits.total_enrolled}
						</Badge>
					</HStack>
					<HStack justify="space-between" align="center" py={1}>
						<Text fontSize="sm" color="blue.600">
							Matriculados ciclo actual
						</Text>
						<Badge justifyContent={"center"} colorPalette="blue" fontSize="sm" boxSize={7}>
							{credits.current_cycle_enrolled}
						</Badge>
					</HStack>
					<HStack justify="space-between" align="center" py={1}>
						<Text fontSize="sm" color="blue.600">
							Restantes para Diploma
						</Text>
						<Badge justifyContent={"center"} colorPalette="blue" variant="solid" fontSize="sm" boxSize={7}>
							{milestones.credits_to_diploma}
						</Badge>
					</HStack>
					<HStack justify="space-between" align="center" py={1}>
						<Text fontSize="sm" color="blue.600">
							Restantes para Egresar
						</Text>
						<Badge justifyContent={"center"} colorPalette="blue" variant="solid" fontSize="sm" boxSize={7}>
							{milestones.credits_to_graduate}
						</Badge>
					</HStack>
				</Card.Body>

				<Card.Footer
					borderTop="1px solid"
					borderColor="gray.200"
					px={6}
					py={2}
				>
					<Box flex={1}>
						<HStack justify="space-between" align="center" py={1}>
							<Text fontSize="sm" color="green.600">
								Promedio Ponderado
							</Text>
							<Badge
                justifyContent={"center"}
								colorPalette="green"
								variant="solid"
								fontSize="sm"
								px={5}
								boxSize={7}
							>
								{averages.cumulative_weighted_average || 0}
							</Badge>
						</HStack>
						<HStack justify="space-between" align="center" py={1}>
							<Text fontSize="sm" color="green.600">
								Promedio Ciclo Actual
							</Text>
							<Badge
                justifyContent={"center"}
								colorPalette="green"
								variant="solid"
								fontSize="sm"
								px={5}
								boxSize={7}
							>
								{averages.current_cycle_average || 0}
							</Badge>
						</HStack>
					</Box>
				</Card.Footer>
			</Card.Root>

			{/* Gráfico */}
			<Card.Root
				w="full"
				flex={2}
				maxW={{ base: '100%', xl: '66%' }}
				borderRadius="md"
			>
				<Card.Header py={3} borderBottom="1px solid" borderColor="gray.200">
					<HStack spacing={2} align="flex-start">
						<Icon as={FiTrendingUp} color="blue.500" mt={1} />
						<Text
							fontSize={{ base: 'md', md: 'lg' }}
							fontWeight="bold"
							color="blue.700"
						>
							Gráfico comparativo entre Período Académico y Promedio
						</Text>
					</HStack>
				</Card.Header>
				<Card.Body p={{ base: 3, md: 4 }}>
					<Box h={{ base: '250px', md: '300px' }} w="100%">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={(() => {
									if (!credits?.by_cycle) return [];
									return Object.entries(credits?.by_cycle).map(
										([cycle, data]) => {
											const rawAverage =
												data.average ||
												data.weighted_sum / data.grade_credits;
											return {
												periodo: data.period || `Ciclo ${cycle}`,
												promedio: rawAverage,
											};
										}
									);
								})()}
								margin={{
									top: 20,
									right: 30,
									left: 10,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
								<XAxis
									dataKey="periodo"
									stroke="#4a5568"
									fontSize={12}
									tick={{ fill: '#4a5568' }}
								/>
								<YAxis
									stroke="#4a5568"
									fontSize={12}
									tick={{ fill: '#4a5568' }}
									ticks={[0, 5, 10, 15, 20]}
									label={{
										value: 'Promedio',
										angle: -90,
										position: 'insideLeft',
									}}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#fff',
										border: '1px solid #e2e8f0',
										borderRadius: '8px',
										boxShadow:
											'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
									}}
									labelStyle={{ color: '#2d3748' }}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="promedio"
									stroke="#3182ce"
									strokeWidth={3}
									dot={{ fill: '#3182ce', strokeWidth: 2, r: 4 }}
									activeDot={{ r: 6, fill: '#2b6cb0' }}
									name="Promedio"
								/>
							</LineChart>
						</ResponsiveContainer>
					</Box>
				</Card.Body>
			</Card.Root>
		</Flex>
	);
};

AcademicProgressSection.propTypes = {
	academicProgress: PropTypes.object,
	isLoading: PropTypes.bool,
};
