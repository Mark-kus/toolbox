import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const BorrowModal = ({
  handleClose,
  handleSubmit,
  quantityLimit,
}: {
  handleClose: () => void;
  handleSubmit: (borrower: string, quantity: number) => void;
  quantityLimit: number;
}) => {
  const [borrower, setBorrower] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [errors, setErrors] = useState({ quantity: "" });

  const handleQuantityChange = (value: string) => {
    setQuantity(value);

    if (value === "") {
      setErrors({ ...errors, quantity: "Debe prestarse al menos una unidad" });
      return;
    }

    const parsedValue = parseInt(value);
    if (parsedValue > quantityLimit) {
      setErrors({
        ...errors,
        quantity: `No se puede superar el limite disponible`,
      });
      return;
    }

    if (!/^[1-9]\d*$/.test(value)) {
      setErrors({
        ...errors,
        quantity: "La cantidad solo puede ser un numero entero",
      });
      return;
    }

    setErrors({ ...errors, quantity: "" });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={borrower}
        onChangeText={setBorrower}
        placeholder="Nombre Completo"
        style={styles.input}
      />
      <View style={styles.quantityContainer}>
        <TextInput
          value={quantity}
          onChangeText={handleQuantityChange}
          keyboardType="numeric"
          placeholder="Cantidad"
          style={styles.quantityInput}
        />
        <View style={styles.quantityButtons}>
          <Pressable
            onPress={() =>
              handleQuantityChange(
                Math.max(1, parseInt(quantity || "2") - 1).toString(),
              )
            }
            disabled={parseInt(quantity) <= 1}
            style={{
              ...styles.quantityButton,
              ...(parseInt(quantity) <= 1 && styles.buttonDisabled),
            }}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              handleQuantityChange(
                Math.min(
                  quantityLimit,
                  parseInt(quantity || "0") + 1,
                ).toString(),
              )
            }
            disabled={parseInt(quantity) >= quantityLimit}
            style={{
              ...styles.quantityButton,
              ...(parseInt(quantity) >= quantityLimit && styles.buttonDisabled),
            }}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.textError}>{errors.quantity}</Text>
      <Pressable
        disabled={
          !borrower ||
          !quantity ||
          parseInt(quantity) <= 0 ||
          Object.values(errors).some((e) => !!e)
        }
        onPress={() =>
          handleSubmit(borrower.trim().toLowerCase(), parseInt(quantity))
        }
        style={{
          ...styles.button,
          ...styles.buttonSubmit,
          ...((Object.values(errors).some((e) => !!e) ||
            !quantity ||
            !borrower) &&
            styles.buttonDisabled),
        }}
      >
        <Text style={styles.textButton}>Prestar</Text>
      </Pressable>
      <Pressable
        onPress={handleClose}
        style={{ ...styles.button, ...styles.buttonCancel }}
      >
        <Text style={styles.textButton}>Cancelar</Text>
      </Pressable>
    </View>
  );
};

export default BorrowModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textButton: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  buttonCancel: {
    backgroundColor: "#718096",
  },
  buttonSubmit: {
    backgroundColor: "#016992",
    marginVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: "#0169928a",
  },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    color: "#2d3748",
    borderRadius: 8,
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  quantityContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#2d3748",
    borderRadius: 8,
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 8,
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
  textError: {
    textAlign: "left",
    color: "#da3e3ede",
  },
});
