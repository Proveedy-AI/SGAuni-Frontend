import { CheckboxCard as ChakraCheckboxCard } from '@chakra-ui/react';
import * as React from 'react';

export const CheckboxCard = React.forwardRef(function CheckboxCard(props, ref) {
	const {
		inputProps,
		label,
		description,
		icon,
		addon,
		indicator = <ChakraCheckboxCard.Indicator />,
		indicatorPlacement = 'end',
		...rest
	} = props;

	const hasContent = label || description || icon;
	const ContentWrapper = indicator
		? ChakraCheckboxCard.Content
		: React.Fragment;

	return (
		<ChakraCheckboxCard.Root {...rest}>
			<ChakraCheckboxCard.HiddenInput ref={ref} {...inputProps} />
			<ChakraCheckboxCard.Control>
				{indicatorPlacement === 'start' && indicator}
				{hasContent && (
					<ContentWrapper>
						{icon}
						{label && (
							<ChakraCheckboxCard.Label>
								{label}
							</ChakraCheckboxCard.Label>
						)}
						{description && (
							<ChakraCheckboxCard.Description>
								{description}
							</ChakraCheckboxCard.Description>
						)}
						{indicatorPlacement === 'inside' && indicator}
					</ContentWrapper>
				)}
				{indicatorPlacement === 'end' && indicator}
			</ChakraCheckboxCard.Control>
			{addon && (
				<ChakraCheckboxCard.Addon>{addon}</ChakraCheckboxCard.Addon>
			)}
		</ChakraCheckboxCard.Root>
	);
});

export const CheckboxCardIndicator = ChakraCheckboxCard.Indicator;
