import { Image } from "react-native";

export function LogoMark({ size }: { size: number }) {
  return (
    <Image
      accessibilityLabel="Disciplined Stake"
      source={require("../../../../assets/logo-mark.png")}
      style={{ height: size, width: size }}
    />
  );
}
