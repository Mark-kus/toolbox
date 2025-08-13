import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, View } from "react-native";
import { ToolboxIcon } from "../components/Icons";
import { ToolsProvider } from "../contexts/ToolsContext";

export default function Layout() {
  return (
    <ToolsProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#016992",
            },
            headerTintColor: "white",
            headerTitle: "Toolbox",
            headerRight: () => (
              <Link asChild href={"/tools"}>
                <Pressable style={styles.widePressable}>
                  <ToolboxIcon />
                </Pressable>
              </Link>
            ),
          }}
        />
      </View>
    </ToolsProvider>
  );
}

const styles = StyleSheet.create({
  widePressable: {
    paddingHorizontal: 16,
  },
});
