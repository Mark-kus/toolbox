import { use, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import {
  AnimatedToolRoot,
  SkeletonToolRoot,
  ToolAvailability,
  ToolName,
} from "../../components/Tool";
import { LogOutIcon } from "../../components/Icons";
import Screen from "../../containers/Screen";
import BorrowModal from "../../components/modals/BorrowModal";
import { ToolsContext, ToolsContextType } from "../../contexts/ToolsContext";
import ModalWrapper from "../../containers/ModalWrapper";
import { ToolInfo } from "../../types";

export default function Available() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);
  const { tools, isLoading, borrowTool } = use(
    ToolsContext,
  ) as ToolsContextType;

  const handleOpenModal = (id: number) => {
    setSelectedToolId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitBorrower = async (borrower: string, quantity: number) => {
    if (!selectedToolId) return;
    handleCloseModal();
    await borrowTool(selectedToolId, borrower, quantity);
  };

  const selectedTool = tools.find((tool) => tool.id === selectedToolId);
  const availableQuantity = selectedTool
    ? selectedTool.stock - selectedTool.borrowed
    : 0;

  return (
    <Screen>
      <ModalWrapper visible={openModal} handleClose={handleCloseModal}>
        <View style={styles.borrowInfo}>
          <ToolName
            name={`Prestando ${selectedTool ? selectedTool.name : "Herramienta"}`}
          />
          <ToolAvailability quantity={availableQuantity} />
        </View>
        <BorrowModal
          handleClose={handleCloseModal}
          handleSubmit={handleSubmitBorrower}
          quantityLimit={availableQuantity}
        />
      </ModalWrapper>
      <Text style={styles.h2}>Disponibles</Text>
      {isLoading ? (
        <>
          <SkeletonToolRoot />
          <SkeletonToolRoot />
          <SkeletonToolRoot />
          <SkeletonToolRoot />
          <SkeletonToolRoot />
        </>
      ) : (
        <FlatList
          style={styles.flatList}
          keyExtractor={(item) => String(item.id)}
          data={tools}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No hay herramientas disponibles
            </Text>
          }
          renderItem={({ item, index }: { item: ToolInfo; index: number }) => {
            const available = item.stock - item.borrowed;
            return (
              <AnimatedToolRoot index={index}>
                <View style={styles.itemSubContainer}>
                  <View>
                    <ToolName name={item.name} />
                    <ToolAvailability quantity={available} />
                  </View>
                  {!!available && (
                    <Pressable
                      style={styles.toolButton}
                      onPress={() => handleOpenModal(item.id)}
                    >
                      <LogOutIcon color="black" />
                    </Pressable>
                  )}
                </View>
              </AnimatedToolRoot>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
    color: "#718096",
    fontWeight: "500",
  },
  flatList: {
    width: "100%",
    marginTop: 16,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2d3748",
    textAlign: "left",
    width: "100%",
    marginBottom: 8,
  },
  itemSubContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
    padding: 10,
    borderRadius: 8,
  },
  borrowInfo: {
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
    marginBottom: 8,
  },
});
