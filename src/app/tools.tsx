import { Link, Stack } from "expo-router";
import { StyleSheet, Pressable, View } from "react-native";
import Screen from "../containers/Screen";
import {
  ToolRoot,
  ToolName,
  ToolStock,
  SkeletonToolRoot,
} from "../components/Tool";
import { useContext } from "react";
import { ToolsContext, ToolsContextType } from "../contexts/ToolsContext";
import { PlusIcon } from "../components/Icons";

const Tools = () => {
  const { tools, isLoading } = useContext(ToolsContext) as ToolsContextType;

  if (isLoading) {
    return (
      <ScreenWithStack>
        <View style={styles.grid}>
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
          <SkeletonToolRoot style={styles.gridItem} />
        </View>
      </ScreenWithStack>
    );
  }

  return (
    <ScreenWithStack>
      <View style={styles.grid}>
        {!isLoading &&
          tools.map((tool) => (
            <Link key={tool.id} asChild href={`/${tool.id}`}>
              <Pressable style={styles.gridItem}>
                <ToolRoot>
                  <ToolName name={tool.name} />
                  <ToolStock stock={tool.stock} />
                </ToolRoot>
              </Pressable>
            </Link>
          ))}
      </View>
    </ScreenWithStack>
  );
};

const ScreenWithStack = ({ children }: { children: React.ReactNode }) => (
  <Screen>
    <Stack.Screen
      options={{
        headerBackTitle: "Volver",
        title: "Herramientas",
        headerRight: () => (
          <Link asChild href={"/new"}>
            <Pressable style={styles.widePressable}>
              <PlusIcon />
            </Pressable>
          </Link>
        ),
      }}
    />
    {children}
  </Screen>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
    minWidth: 150,
    flexGrow: 1,
  },
  widePressable: {
    paddingHorizontal: 16,
  },
});

export default Tools;
