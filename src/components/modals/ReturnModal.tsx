import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useToolBorrowers } from "../../hooks/useToolBorrowers";
import { useEffect, useState } from "react";
import { Borrower } from "../../types";
import { Picker } from "@react-native-picker/picker";
import QuantityButtons from "../QuantityButtons";
import { SkeletonToolRoot } from "../Tool";

const ReturnModal = ({
  handleClose,
  handleSubmit,
  toolId,
}: {
  handleClose: () => void;
  handleSubmit: (borrowerId: number, quantity: number) => void;
  toolId: number;
}) => {
  const { toolBorrowers, isLoading } = useToolBorrowers(toolId);
  const [selectedBorrower, setSelectedBorrower] = useState<
    Borrower | undefined
  >();
  const [quantity, setQuantity] = useState("1");
  const [errors, setErrors] = useState({ quantity: "" });

  useEffect(() => {
    if (toolBorrowers) setSelectedBorrower(toolBorrowers[0]);
  }, [toolBorrowers]);

  const handleSelect = (borrowerId: number) => {
    setSelectedBorrower(
      toolBorrowers.find((b) => b.id === borrowerId) || toolBorrowers[0],
    );
    setQuantity("1");
  };

  const maxQuantity = selectedBorrower?.borrowCount;

  const handleQuantityChange = (value: string) => {
    setQuantity(value);

    if (value === "") {
      setErrors({ ...errors, quantity: "Debe devolverse al menos una unidad" });
      return;
    }

    const parsedValue = parseInt(value);
    if (maxQuantity && parsedValue > maxQuantity) {
      setErrors({
        ...errors,
        quantity: `No se puede devolver más de lo que se pidió`,
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
      {isLoading ? (
        <SkeletonToolRoot />
      ) : (
        <Picker
          style={styles.selectContainer}
          selectedValue={selectedBorrower ? selectedBorrower.id : 0}
          onValueChange={handleSelect}
          dropdownIconColor={"#a0aec0"}
          mode="dropdown"
        >
          {toolBorrowers.map((borrower) => (
            <Picker.Item
              key={borrower.id}
              label={
                borrower.name.charAt(0).toUpperCase() + borrower.name.slice(1)
              }
              value={borrower.id}
              color={"#4da5c1"}
            />
          ))}
        </Picker>
      )}
      <Text style={styles.borrowerInfo}>
        {selectedBorrower && (
          <>
            {selectedBorrower.name.charAt(0).toUpperCase() +
              selectedBorrower.name.slice(1)}{" "}
            tiene {selectedBorrower.borrowCount} unidades por devolver
          </>
        )}
      </Text>
      <View style={styles.quantityContainer}>
        <TextInput
          value={quantity}
          onChangeText={handleQuantityChange}
          keyboardType="numeric"
          placeholder="Cantidad"
          style={styles.quantityInput}
        />
        <QuantityButtons
          quantity={quantity}
          maxQuantity={maxQuantity}
          minQuantity={1}
          handleChange={handleQuantityChange}
        />
      </View>
      <Text style={styles.textError}>{errors.quantity}</Text>

      <Pressable
        onPress={() => {
          if (selectedBorrower)
            handleSubmit(selectedBorrower.id, Number(quantity));
        }}
        disabled={isLoading || !selectedBorrower || !quantity}
        style={{
          ...styles.button,
          ...styles.buttonSubmit,
          ...((isLoading || !selectedBorrower || !quantity) &&
            styles.buttonDisabled),
        }}
      >
        <Text style={styles.textButton}>Devolver</Text>
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

export default ReturnModal;

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
  selectContainer: {
    width: "100%",
    backgroundColor: "#f7fafc",
    borderRadius: 8,
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
    opacity: 0.6,
  },
  borrowerInfo: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#4a5568",
    textAlign: "center",
  },
  textError: {
    textAlign: "left",
    color: "#da3e3ede",
  },
});
