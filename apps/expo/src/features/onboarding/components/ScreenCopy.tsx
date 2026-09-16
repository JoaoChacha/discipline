import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function ScreenCopy({
  eyebrow,
  title,
  description,
  welcome = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  welcome?: boolean;
}) {
  const { type } = useTheme();

  return (
    <View>
      <Text style={[type.eyebrow, { marginBottom: 10 }]}>{eyebrow}</Text>
      <Text style={welcome ? type.welcomeTitle : type.title}>{title}</Text>
      <Text style={type.description}>{description}</Text>
    </View>
  );
}
