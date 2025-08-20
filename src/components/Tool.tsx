import { Animated, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef } from "react";

export const ToolRoot = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.toolRoot}>{children}</View>
);

export const ToolName = ({ name }: { name: string }) => (
  <Text style={styles.toolName}>{name}</Text>
);

export const ToolAvailability = ({ quantity }: { quantity: number }) =>
  quantity > 0 ? (
    <Text style={styles.greenText}>Disponibles: {quantity}</Text>
  ) : (
    <Text style={styles.redText}>No disponible</Text>
  );

export const ToolStock = ({ stock }: { stock: number }) => (
  <Text style={styles.stockText}>Stock: {stock}</Text>
);

export const AnimatedToolRoot = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  return (
    <Animated.View style={{ ...styles.toolRoot, opacity }}>
      {children}
    </Animated.View>
  );
};

export const SkeletonToolRoot = ({ style }: { style?: any }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <View style={{ ...styles.toolRoot, ...style }}>
      <Animated.View style={{ ...styles.skeleton, opacity }} />
    </View>
  );
};

const styles = StyleSheet.create({
  toolRoot: {
    width: "100%",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 4,
  },
  greenText: {
    color: "#016992",
    fontWeight: "600",
    fontSize: 14,
  },
  stockText: {
    color: "#016992",
    fontWeight: "600",
    fontSize: 14,
  },
  redText: {
    color: "#e53e3e",
    fontWeight: "600",
    fontSize: 14,
  },
  toolImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  skeleton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
});
