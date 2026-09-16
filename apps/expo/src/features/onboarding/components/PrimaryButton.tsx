import { CapsuleButton } from "~/ui/CapsuleButton";

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <CapsuleButton
      label={label}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    />
  );
}
