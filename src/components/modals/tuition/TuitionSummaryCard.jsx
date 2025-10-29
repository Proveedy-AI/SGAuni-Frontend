import {
	Card,
	Flex,
	Text,
	Heading,
	Icon,
	Badge,
	Separator,
} from '@chakra-ui/react';
import { FaCalculator, FaPercentage } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

export default function TuitionSummaryCard({
	title,
	credits,
	pricePerCredit,
	baseAmount: providedBaseAmount,
	discounts,
	setDescription,
}) {
	// 1. Calcular baseAmount
	const baseAmount =
		typeof providedBaseAmount === 'number'
			? providedBaseAmount
			: (credits || 0) * (pricePerCredit || 0);

	// 2. Acumular porcentajes y montos fijos
	const totalPercentage = discounts.reduce(
		(acc, d) => acc + (Number(d.percentage / 100) || 0),
		0
	);
	const totalFixed = discounts.reduce((acc, d) => acc + (d.amount || 0), 0);

	// 3. Aplicar descuento
	const percentageAmount = baseAmount * totalPercentage;
	const totalDiscountAmount = percentageAmount + totalFixed;
	const finalAmount = baseAmount - totalDiscountAmount;

	// 4. Descripción generada para enviar arriba
	useEffect(() => {
		const summaryText = `
${credits ? `Créditos: ${credits}\n` : ''}${
			pricePerCredit
				? `Precio por crédito: S/ ${pricePerCredit.toFixed(2)}\n`
				: ''
		}Subtotal: S/ ${baseAmount.toFixed(2)}
${discounts
	.map((d) => {
		const parts = [];
		if (d.percentage) parts.push(`${Number(d.percentage).toFixed(0)}%`);
		if (d.amount) parts.push(`S/ ${d.amount.toFixed(2)}`);
		return `- ${d.label} (${parts.join(' + ')})`;
	})
	.join('\n')}
Total descuento: -S/ ${totalDiscountAmount.toFixed(2)}
Monto final: S/ ${finalAmount.toFixed(2)}
`.trim();

		setDescription?.(summaryText);
	}, [credits, pricePerCredit, providedBaseAmount, discounts, setDescription]);

	return (
		<Card.Root
			bg='green.50'
			border='1px solid'
			borderColor='green.200'
			borderRadius='xl'
		>
			<Card.Header pb={2}>
				<Flex align='center' gap={2} color='green.800'>
					<Icon as={FaCalculator} boxSize={5} />
					<Heading fontSize='lg'>{title}</Heading>
				</Flex>
			</Card.Header>

			<Card.Body pt={0}>
				{typeof credits === 'number' && (
					<Flex justify='space-between' mb={2}>
						<Text fontSize='sm' color='gray.600'>
							Créditos
						</Text>
						<Badge variant='subtle' colorPalette='green'>
							{credits}
						</Badge>
					</Flex>
				)}

				{typeof pricePerCredit === 'number' && (
					<Flex justify='space-between' mb={2}>
						<Text fontSize='sm' color='gray.600'>
							Precio por crédito
						</Text>
						<Text fontWeight='medium'>S/ {pricePerCredit.toFixed(2)}</Text>
					</Flex>
				)}

				<Separator my={3} />

				<Flex justify='space-between' mb={2}>
					<Text fontSize='sm' color='gray.600'>
						Subtotal
					</Text>
					<Text fontWeight='medium'>S/ {baseAmount.toFixed(2)}</Text>
				</Flex>

				{discounts.map((d, i) => (
					<Flex justify='space-between' mb={1} color='green.700' key={i}>
						<Flex align='center' gap={1} fontSize='sm'>
							<Icon as={FaPercentage} boxSize={4} />
							{d.label}
						</Flex>
						<Text>
							{[
								d.percentage ? `${Number(d.percentage).toFixed(0)}%` : '',
								d.amount ? `S/ ${d.amount.toFixed(2)}` : '',
							]
								.filter(Boolean)
								.join(' + ')}
						</Text>
					</Flex>
				))}

				<Flex
					justify='space-between'
					mb={2}
					mt={2}
					fontWeight='medium'
					color='green.700'
				>
					<Text>Total descuento</Text>
					<Text>-S/ {totalDiscountAmount.toFixed(2)}</Text>
				</Flex>

				<Separator my={3} />

				<Flex
					justify='space-between'
					mt={2}
					fontWeight='bold'
					fontSize='lg'
					color='green.800'
				>
					<Text>Monto Final</Text>
					<Text>S/ {finalAmount.toFixed(2)}</Text>
				</Flex>
			</Card.Body>
		</Card.Root>
	);
}

TuitionSummaryCard.propTypes = {
	title: PropTypes.string,
	credits: PropTypes.number,
	pricePerCredit: PropTypes.number,
	baseAmount: PropTypes.number,
	discounts: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			percentage: PropTypes.number,
			amount: PropTypes.number,
		})
	),
	setDescription: PropTypes.func,
};
