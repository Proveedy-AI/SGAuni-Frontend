'use client';

import {
	HStack,
	Portal,
	Select,
	createListCollection,
	useSelectContext,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

export const CustomSelect = ({
	label,
	placeholder = 'Seleccione una opción',
	value,
	onChange,
	items = [],
	groupBy,
	stringifyItem,
	renderLeft, // ícono o imagen en el listado
	renderValue, // ícono o imagen en el valor seleccionado
	...rest
}) => {
	const collection = createListCollection({
		items,
		itemToValue: (item) => item.value,
		itemToString: stringifyItem ?? ((item) => item.label),
	});

	const SelectValue = () => {
		const { selectedItems } = useSelectContext();
		const selected = selectedItems[0];

		return (
			<Select.ValueText placeholder={placeholder}>
				<HStack className='flex items-center gap-2'>
					{selected
						? renderValue
							? renderValue(selected)
							: collection.stringifyItem(selected)
						: placeholder}
				</HStack>
			</Select.ValueText>
		);
	};

	const groupedItems = groupBy
		? Object.entries(
				items.reduce((acc, item) => {
					const key = groupBy(item);
					acc[key] = acc[key] || [];
					acc[key].push(item);
					return acc;
				}, {})
			)
		: null;

	const selectedItem = collection.items.find((item) => item.value === value);

	return (
		<Select.Root
			collection={collection}
			selectedItems={selectedItem ? [selectedItem] : []}
			onChange={(e) => {
				const selected = e.target.value;
				if (selected) {
					onChange(selected);
				} else {
					onChange(undefined); // si no hay selección
				}
			}}
			{...rest}
		>
			<Select.HiddenSelect />
			<Select.Label>{label}</Select.Label>
			<Select.Control mb={2}>
				<Select.Trigger>
					<SelectValue />
				</Select.Trigger>
				<Select.IndicatorGroup>
					<Select.ClearTrigger />
					<Select.Indicator />
				</Select.IndicatorGroup>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content>
						{groupedItems
							? groupedItems.map(([group, groupItems]) => (
									<Select.ItemGroup key={group}>
										<Select.ItemGroupLabel>{group}</Select.ItemGroupLabel>
										{groupItems.map((item) => (
											<Select.Item item={item} key={item.value}>
												<HStack className='flex items-center gap-2'>
													{renderLeft?.(item)}
													{collection.stringifyItem(item)}
												</HStack>
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.ItemGroup>
								))
							: items.map((item) => (
									<Select.Item item={item} key={item.value}>
										<HStack className='flex items-center gap-2'>
											{renderLeft?.(item)}
											{collection.stringifyItem(item)}
										</HStack>
										<Select.ItemIndicator />
									</Select.Item>
								))}
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	);
};

CustomSelect.propTypes = {
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	error: PropTypes.string,
	invalid: PropTypes.bool,
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object),
	groupBy: PropTypes.func,
	stringifyItem: PropTypes.func,
	renderLeft: PropTypes.func,
	renderValue: PropTypes.func,
	required: PropTypes.bool,
};
