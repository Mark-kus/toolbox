import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedToolRoot, ToolName } from "../../components/Tool";
import { LogInIcon } from "../../components/Icons";
import { BorrowedTool } from "../../types";
import Screen from "../../containers/Screen";
import { use, useState } from "react";
import { ToolsContext, ToolsContextType } from "../../contexts/ToolsContext";
import ModalWrapper from "../../containers/ModalWrapper";
import ReturnModal from "../../components/modals/ReturnModal";

export default function Borrowed() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);
  const { borrowedTools, isLoading, returnTool } = use(
    ToolsContext,
  ) as ToolsContextType;

  const handleOpenModal = (toolId: number) => {
    setSelectedToolId(toolId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedToolId(null);
    setOpenModal(false);
  };

  const handleSubmitReturn = async (borrowerId: number) => {
    if (!selectedToolId) return;
    handleCloseModal();
    await returnTool(selectedToolId, borrowerId);
  };

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ModalWrapper visible={openModal} handleClose={handleCloseModal}>
        <ReturnModal
          handleClose={handleCloseModal}
          handleSubmit={handleSubmitReturn}
          toolId={selectedToolId as number}
        />
      </ModalWrapper>
      <Text style={styles.h2}>Prestadas</Text>
      {borrowedTools.length === 0 ? (
        <Text style={styles.emptyText}>No hay herramientas prestadas</Text>
      ) : (
        <FlatList
          style={styles.flatList}
          keyExtractor={(item) => String(item.id)}
          data={borrowedTools}
          renderItem={({
            item,
            index,
          }: {
            item: BorrowedTool;
            index: number;
          }) => {
            return (
              <AnimatedToolRoot index={index}>
                <View style={styles.itemSubContainer}>
                  <View>
                    <ToolName name={item.name} />
                  </View>
                  <Pressable
                    style={styles.toolButton}
                    onPress={() => handleOpenModal(item.id)}
                  >
                    <LogInIcon color="black" />
                  </Pressable>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
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
});
