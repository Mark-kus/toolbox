import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useToolBorrowers } from "../../hooks/useToolBorrowers";
import { useEffect, useState } from "react";
import { Borrower } from "../../types";
import { Picker } from "@react-native-picker/picker";

const ReturnModal = ({
  handleClose,
  handleSubmit,
  toolId,
}: {
  handleClose: () => void;
  handleSubmit: (borrowerId: number) => void;
  toolId: number;
}) => {
  const { toolBorrowers, isLoading } = useToolBorrowers(toolId);
  const [selectedBorrower, setSelectedBorrower] = useState<
    Borrower | undefined
  >();

  useEffect(() => {
    if (toolBorrowers) setSelectedBorrower(toolBorrowers[0]);
  }, [toolBorrowers]);

  const handleSelect = (borrowerId: number) => {
    setSelectedBorrower(
      toolBorrowers.find((b) => b.id === borrowerId) || toolBorrowers[0],
    );
  };

  return (
    <View style={styles.container}>
      {!!isLoading ? (
        <View style={styles.selectSkeleton}>
          <ActivityIndicator />
        </View>
      ) : (
        <Picker
          style={styles.selectContainer}
          selectedValue={selectedBorrower ? selectedBorrower.id : 0}
          onValueChange={handleSelect}
        >
          {toolBorrowers.map((borrower) => (
            <Picker.Item
              key={borrower.id}
              label={
                borrower.name.charAt(0).toUpperCase() + borrower.name.slice(1)
              }
              value={borrower.id}
            />
          ))}
        </Picker>
      )}
      <Pressable
        onPress={() => {
          if (selectedBorrower) handleSubmit(selectedBorrower.id);
        }}
        disabled={isLoading}
        style={{
          ...styles.button,
          ...styles.buttonSubmit,
          ...(isLoading && styles.buttonDisabled),
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
  selectContainer: {
    width: "100%",
  },
  selectSkeleton: {
    width: "100%",
    height: 216,
    justifyContent: "center",
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
});
