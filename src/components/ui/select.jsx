'use client';

import { Select as ChakraSelect, Portal } from '@chakra-ui/react';
import { CloseButton } from './close-button';
import * as React from 'react';

export const SelectTrigger = React.forwardRef(
	function SelectTrigger(props, ref) {
		const { children, clearable, ...rest } = props;
		return (
			<ChakraSelect.Control {...rest}>
				<ChakraSelect.Trigger ref={ref}>{children}</ChakraSelect.Trigger>
				<ChakraSelect.IndicatorGroup>
					{clearable && <SelectClearTrigger />}
					<ChakraSelect.Indicator />
				</ChakraSelect.IndicatorGroup>
			</ChakraSelect.Control>
		);
	}
);

const SelectClearTrigger = React.forwardRef(
	function SelectClearTrigger(props, ref) {
		return (
			<ChakraSelect.ClearTrigger asChild {...props} ref={ref}>
				<CloseButton
					size='xs'
					variant='plain'
					focusVisibleRing='inside'
					focusRingWidth='2px'
					pointerEvents='auto'
				/>
			</ChakraSelect.ClearTrigger>
		);
	}
);

export const SelectContent = React.forwardRef(
	function SelectContent(props, ref) {
		const { portalled = true, portalRef, ...rest } = props;
		return (
			<Portal disabled={!portalled} container={portalRef}>
				<ChakraSelect.Positioner>
					<ChakraSelect.Content {...rest} ref={ref} />
				</ChakraSelect.Positioner>
			</Portal>
		);
	}
);

export const SelectItem = React.forwardRef(function SelectItem(props, ref) {
	const { item, children, noCheck, ...rest } = props;
	return (
		<ChakraSelect.Item key={item.value} item={item} {...rest} ref={ref}>
			{children}
			{!noCheck && <ChakraSelect.ItemIndicator />}
		</ChakraSelect.Item>
	);
});

export const SelectValueText = React.forwardRef(
	function SelectValueText(props, ref) {
		const { children, ...rest } = props;
		return (
			<ChakraSelect.ValueText {...rest} ref={ref}>
				<ChakraSelect.Context>
					{(select) => {
						const items = select.selectedItems;
						if (items.length === 0) return props.placeholder;
						if (children) return children(items);
						if (items.length === 1)
							return select.collection.stringifyItem(items[0]);
						return `${items.length} selected`;
					}}
				</ChakraSelect.Context>
			</ChakraSelect.ValueText>
		);
	}
);

export const SelectRoot = React.forwardRef(function SelectRoot(props, ref) {
	return (
		<ChakraSelect.Root
			{...props}
			ref={ref}
			positioning={{ sameWidth: true, ...props.positioning }}
		>
			{props.asChild ? (
				props.children
			) : (
				<>
					<ChakraSelect.HiddenSelect />
					{props.children}
				</>
			)}
		</ChakraSelect.Root>
	);
});

export const SelectItemGroup = React.forwardRef(
	function SelectItemGroup(props, ref) {
		const { children, label, ...rest } = props;
		return (
			<ChakraSelect.ItemGroup {...rest} ref={ref}>
				<ChakraSelect.ItemGroupLabel>{label}</ChakraSelect.ItemGroupLabel>
				{children}
			</ChakraSelect.ItemGroup>
		);
	}
);

export const SelectLabel = ChakraSelect.Label;
export const SelectItemText = ChakraSelect.ItemText;
export const SelectPositioner = ChakraSelect.Positioner;
export const SelectIndicator = ChakraSelect.Indicator;
export const SelectIndicatorGroup = ChakraSelect.IndicatorGroup;
export const SelectItemIndicator = ChakraSelect.ItemIndicator;
export const SelectControl = ChakraSelect.Control;
export const SelectHiddenSelect = ChakraSelect.HiddenSelect;
export const SelectContext = ChakraSelect.Context;
export const SelectTriggerInternal = ChakraSelect.Trigger;
