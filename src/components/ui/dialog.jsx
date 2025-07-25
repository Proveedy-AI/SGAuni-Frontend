import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react';
import { CloseButton } from './close-button';
import * as React from 'react';

export const DialogContent = React.forwardRef(
	function DialogContent(props, ref) {
		const {
			children,
			portalled = true,
			portalRef,
			backdrop = true,
			positionerProps,
			...rest
		} = props;

		return (
			<Portal disabled={!portalled} container={portalRef}>
				{backdrop && <ChakraDialog.Backdrop />}
				<ChakraDialog.Positioner {...positionerProps}>
					<ChakraDialog.Content ref={ref} {...rest} asChild={false}>
						{children}
					</ChakraDialog.Content>
				</ChakraDialog.Positioner>
			</Portal>
		);
	}
);

export const DialogCloseTrigger = React.forwardRef(
	function DialogCloseTrigger(props, ref) {
		return (
			<ChakraDialog.CloseTrigger
				position='absolute'
				top='2'
				insetEnd='2'
				{...props}
				asChild
			>
				<CloseButton size='sm' ref={ref}>
					{props.children}
				</CloseButton>
			</ChakraDialog.CloseTrigger>
		);
	}
);

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;
