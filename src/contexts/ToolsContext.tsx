import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { supabaseClient } from "../lib/supabase";
import { BorrowedTool, ToolData, ToolEntity, ToolInfo } from "../types";

export type ToolsContextType = {
  tools: ToolInfo[];
  borrowedTools: BorrowedTool[];
  isLoading: boolean;
  borrowTool: (
    toolId: number,
    borrower: string,
    quantity: number,
  ) => Promise<void>;
  updateTool: (tool: ToolEntity) => Promise<void>;
  createTool: (tool: ToolData) => Promise<void>;
  deleteTool: (toolId: number) => Promise<void>;
  returnTool: (
    toolId: number,
    borrowerId: number,
    quantity: number,
  ) => Promise<void>;
};

export const ToolsContext = createContext<ToolsContextType | null>(null);

export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [borrowedTools, setBorrowedTools] = useState<BorrowedTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTools = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await supabaseClient.from("tools").select(`
        id,
        name,
        stock,
        borrower_tool(count)
      `);

      if (!data) return;

      const newTools = data
        .map((tool) => ({
          id: tool.id,
          name:
            tool.name.charAt(0).toUpperCase() +
            tool.name.slice(1).toLowerCase(),
          stock: tool.stock,
          borrowed: tool.borrower_tool[0].count ?? 0,
        }))
        .sort((a, b) => {
          const aCondition = a.stock > a.borrowed ? 1 : 0;
          const bCondition = b.stock > b.borrowed ? 1 : 0;

          if (bCondition !== aCondition) {
            return bCondition - aCondition;
          }

          return a.name.localeCompare(b.name);
        });

      setTools(newTools as ToolInfo[]);

      const borrowedTools = newTools
        .filter((tool) => tool.borrowed > 0)
        .map(({ id, name, borrowed }) => ({ id, name, borrowed }));

      setBorrowedTools(borrowedTools);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const borrowTool = useCallback(
    async (toolId: number, borrower: string, quantity: number) => {
      setIsLoading(true);
      try {
        // Buscar al cliente
        let { data: client } = await supabaseClient
          .from("borrowers")
          .select()
          .eq("name", borrower)
          .maybeSingle();

        // Si no existe, crearlo
        if (!client) {
          await supabaseClient.from("borrowers").insert({ name: borrower });
          const { data } = await supabaseClient
            .from("borrowers")
            .select()
            .eq("name", borrower)
            .single();

          client = data;
        }

        // Crear la(s) relación(es) de préstamo según quantity
        const rows = Array.from({ length: quantity }, () => ({
          borrower_id: client.id,
          tool_id: toolId,
        }));
        await supabaseClient.from("borrower_tool").insert(rows);

        await fetchTools();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTools],
  );

  const returnTool = useCallback(
    async (toolId: number, borrowerId: number, quantity: number) => {
      setIsLoading(true);
      try {
        // Borra el pedido actual la cantidad de veces especificada
        await supabaseClient
          .from("borrower_tool")
          .delete()
          .eq("tool_id", toolId)
          .eq("borrower_id", borrowerId)
          .limit(quantity);

        // Check if the borrower has more tools
        const { count } = await supabaseClient
          .from("borrower_tool")
          .select("id", { count: "exact", head: true })
          .eq("borrower_id", borrowerId)
          .limit(1);

        // Si el prestatario no tiene mas herramientas, lo borramos
        if (count === 0) {
          await supabaseClient.from("borrowers").delete().eq("id", borrowerId);
        }

        await fetchTools();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTools],
  );

  const updateTool = useCallback(
    async (tool: ToolEntity) => {
      setIsLoading(true);
      try {
        // If new stock is less than current borrowed, remove all borrows for this tool
        const nextStock = Number((tool as any).stock);
        if (!Number.isNaN(nextStock)) {
          const { count } = await supabaseClient
            .from("borrower_tool")
            .select("id", { count: "exact", head: true })
            .eq("tool_id", tool.id);

          const currentBorrowed = count ?? 0;
          if (nextStock < currentBorrowed) {
            await supabaseClient
              .from("borrower_tool")
              .delete()
              .eq("tool_id", tool.id);
          }
        }

        await supabaseClient
          .from("tools")
          .update(tool)
          .eq("id", tool.id)
          .single();

        await fetchTools();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTools],
  );

  const createTool = useCallback(
    async (tool: ToolData) => {
      setIsLoading(true);
      try {
        await supabaseClient.from("tools").insert(tool);

        await fetchTools();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTools],
  );

  const deleteTool = useCallback(
    async (toolId: number) => {
      setIsLoading(true);
      try {
        // Remove all borrow relations for this tool before deleting it
        await supabaseClient
          .from("borrower_tool")
          .delete()
          .eq("tool_id", toolId);

        await supabaseClient.from("tools").delete().eq("id", toolId);
        await fetchTools();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTools],
  );

  // Fetch tools on mount
  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const value = useMemo(
    () => ({
      tools,
      borrowedTools,
      isLoading,
      borrowTool,
      returnTool,
      updateTool,
      createTool,
      deleteTool,
    }),
    [
      tools,
      borrowedTools,
      isLoading,
      borrowTool,
      returnTool,
      updateTool,
      createTool,
      deleteTool,
    ],
  );

  return (
    <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>
  );
}
