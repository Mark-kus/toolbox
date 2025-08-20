import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, use, useCallback, useMemo } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Screen from "../containers/Screen";
import { ToolsContext, ToolsContextType } from "../contexts/ToolsContext";
import { ToolData } from "../types";
import { useTools } from "../hooks/useTools";
import QuantityButtons from "../components/QuantityButtons";
import { SkeletonToolRoot } from "../components/Tool";

export default function Detail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    isLoading: isLoadingContext,
    updateTool,
    createTool,
    deleteTool,
    tools,
  } = use(ToolsContext) as ToolsContextType;
  const {
    isLoading: isLoadingHook,
    fetchToolById,
    fetchToolByName,
  } = useTools();
  const [formData, setFormData] = useState<ToolData>({
    name: "",
    stock: "",
  });
  const [errors, setErrors] = useState({ name: "", quantity: "" });
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  const toolId = Number(id);

  const borrowedCount = useMemo(() => {
    if (id === "new" || isNaN(toolId)) return 0;
    return tools.find((t) => t.id === toolId)?.borrowed ?? 0;
  }, [id, toolId, tools]);

  const fetchToolData = useCallback(async () => {
    if (id !== "new" && !isNaN(toolId)) {
      setIsLoadingInitial(true);
      const tool = await fetchToolById(toolId);

      if (!tool) return;
      setFormData({
        name:
          tool.name.charAt(0).toUpperCase() + tool.name.slice(1).toLowerCase(),
        stock: String(tool.stock),
      });
      setIsLoadingInitial(false);
    }
  }, [id, toolId, fetchToolById]);

  useEffect(() => {
    fetchToolData();
  }, [fetchToolData]);

  const handleQuantityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, stock: value }));

    if (value === "") {
      setErrors({ ...errors, quantity: "Este campo es requerido" });
      return;
    }

    if (!/^[0-9]\d*$/.test(value)) {
      setErrors({
        ...errors,
        quantity: "Stock solo puede ser un numero entero",
      });
      return;
    }

    setErrors({ ...errors, quantity: "" });
  };

  const handleSubmit = async () => {
    const lowerCaseName = formData.name.toLowerCase();

    // Update Tool
    if (toolId) {
      const existentTool = await fetchToolByName(lowerCaseName, toolId);

      if (existentTool) {
        setErrors({
          ...errors,
          name: "Ya existe una herramienta con este nombre",
        });
        return;
      }
      const nextStock = Number(formData.stock);
      if (nextStock === borrowedCount) {
        await updateTool({ id: toolId, ...formData });
        router.back();
        return;
      }

      const message =
        nextStock < borrowedCount
          ? `El nuevo stock (${nextStock}) es menor que la cantidad prestada (${borrowedCount}). Se eliminarán todos los préstamos activos de esta herramienta. ¿Deseas continuar?`
          : "¿Deseas continuar?";

      Alert.alert(`Actualizando ${formData.name}`, message, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Actualizar",
          onPress: async () => {
            await updateTool({ id: toolId, ...formData });
            router.back();
          },
        },
      ]);
      return;
    }

    // Create Tool
    const existentTool = await fetchToolByName(lowerCaseName);
    if (existentTool) {
      Alert.alert("Error", "Ya existe una herramienta con este nombre", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
      return;
    }

    await createTool({
      name: lowerCaseName,
      stock: formData.stock,
    });
    router.back();
  };

  const handleDeleteTool = async (toolId: number) => {
    Alert.alert(
      `Eliminar ${formData.name}`,
      `¿Estás seguro de que deseas eliminar esta herramienta? ${borrowedCount > 0 ? `Se eliminarán los préstamos activos (${borrowedCount})` : ""}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            await deleteTool(toolId);
            router.back();
          },
        },
      ],
    );
  };

  if (isLoadingInitial) {
    return (
      <Screen>
        <SkeletonToolRoot />
        <SkeletonToolRoot />
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <SkeletonToolRoot
            style={{
              width: "48%",
            }}
          />
          <SkeletonToolRoot
            style={{
              width: "48%",
            }}
          />
        </View>
      </Screen>
    );
  }

  const isLoadingButton = isLoadingHook || isLoadingContext;
  const canEnableButton =
    !isLoadingButton &&
    !Object.values(errors).some((v) => v) &&
    formData.name &&
    formData.stock;

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerBackTitle: "Volver",
          headerRight: undefined,
        }}
      />
      <View>
        <Text style={styles.title}>
          {id === "new" ? "Nueva Herramienta" : `Editando ${formData.name}`}
        </Text>
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Herramienta"
          />
          {!!errors.name && <Text style={styles.textError}>{errors.name}</Text>}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Stock</Text>
          <View style={styles.quantityContainer}>
            <TextInput
              style={styles.quantityInput}
              value={String(formData.stock)}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              placeholder="Cantidad"
            />
            <QuantityButtons
              quantity={formData.stock}
              minQuantity={0}
              handleChange={(value) => handleQuantityChange(value)}
              disabledMinus={Number(formData.stock) <= 0}
            />
          </View>
          {!!errors.quantity && (
            <Text style={styles.textError}>{errors.quantity}</Text>
          )}
        </View>
      </View>

      <View style={styles.actionsView}>
        <Pressable
          onPress={() => router.back()}
          style={{ ...styles.button, ...styles.buttonCancel }}
        >
          <Text style={styles.textButton}>Cancelar</Text>
        </Pressable>

        {!!toolId && (
          <Pressable
            onPress={() => handleDeleteTool(toolId)}
            disabled={isLoadingButton}
            style={{
              ...styles.button,
              ...styles.buttonDelete,
              ...(isLoadingButton ? styles.buttonDisabled : null),
            }}
          >
            <Text style={styles.textButton}>Eliminar</Text>
          </Pressable>
        )}

        <Pressable
          onPress={handleSubmit}
          disabled={!canEnableButton}
          style={{
            ...styles.button,
            ...styles.buttonSubmit,
            ...(!canEnableButton ? styles.buttonDisabled : null),
          }}
        >
          <Text style={styles.textButton}>
            {isLoadingButton
              ? "Cargando..."
              : toolId
                ? "Actualizar"
                : "Agregar"}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionsView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
  },
  quantityContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
  },
  button: {
    flex: 1,
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
  textError: {
    textAlign: "left",
    color: "#da3e3ede",
  },
  buttonCancel: {
    backgroundColor: "#718096",
  },
  buttonSubmit: {
    backgroundColor: "#016992",
  },
  buttonDelete: {
    backgroundColor: "#920601ff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
