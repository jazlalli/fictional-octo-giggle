import React from "react";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";

type ConfirmDialogProps = {
  trigger: React.ReactElement;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export const ConfirmDialog = ({
  trigger,
  title,
  description = "",
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel = () => void 0,
  onConfirm = () => void 0,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        {description && (
          <AlertDialog.Description size="2">
            {description}
          </AlertDialog.Description>
        )}

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" onClick={() => onCancel()}>
              {cancelText}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={() => onConfirm()}>
              {confirmText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
