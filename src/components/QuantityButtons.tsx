import { Pressable, StyleSheet, Text, View } from "react-native";

const QuantityButtons = ({
  quantity,
  maxQuantity,
  minQuantity,
  handleChange,
  disabledMinus = false,
  disabledPlus = false,
}: {
  quantity: string;
  maxQuantity?: number;
  minQuantity?: number;
  handleChange: (value: string) => void;
  disabledMinus?: boolean;
  disabledPlus?: boolean;
}) => {
  return (
    <View style={styles.quantityButtons}>
      <Pressable
        onPress={() =>
          handleChange(
            Math.max(
              minQuantity ?? 1,
              parseInt(quantity || "2") - 1,
            ).toString(),
          )
        }
        disabled={
          disabledMinus ||
          (minQuantity !== undefined && parseInt(quantity) <= minQuantity)
        }
        style={{
          ...styles.quantityButton,
          ...((disabledMinus ||
            (minQuantity !== undefined && parseInt(quantity) <= minQuantity)) &&
            styles.buttonDisabled),
        }}
      >
        <Text style={styles.quantityButtonText}>-</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          handleChange(
            (maxQuantity !== undefined
              ? Math.min(maxQuantity, parseInt(quantity || "0") + 1)
              : parseInt(quantity || "0") + 1
            ).toString(),
          )
        }
        disabled={
          disabledPlus ||
          (maxQuantity !== undefined && parseInt(quantity) >= maxQuantity)
        }
        style={{
          ...styles.quantityButton,
          ...((disabledPlus ||
            (maxQuantity !== undefined && parseInt(quantity) >= maxQuantity)) &&
            styles.buttonDisabled),
        }}
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonDisabled: {
    backgroundColor: "#0169928a",
  },
  quantityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  quantityButton: {
    width: 46,
    height: 46,
    backgroundColor: "#016992",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 46,
  },
});

export default QuantityButtons;
