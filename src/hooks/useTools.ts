import { useCallback, useMemo, useState } from "react";
import { supabaseClient } from "../lib/supabase";

export const useTools = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchToolById = useCallback(async (toolId: number) => {
    setIsLoading(true);
    try {
      const { data } = await supabaseClient
        .from("tools")
        .select("*")
        .eq("id", toolId)
        .maybeSingle();
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchToolByName = useCallback(
    async (name: string, ignoreId?: number) => {
      setIsLoading(true);
      try {
        const { data } = await supabaseClient
          .from("tools")
          .select("*")
          .eq("name", name)
          .neq("id", ignoreId ? ignoreId : "0")
          .maybeSingle();
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const hasActiveBorrows = useCallback(async (toolId: number) => {
    setIsLoading(true);
    try {
      const { count } = await supabaseClient
        .from("borrower_tool")
        .select("id", { count: "exact", head: true })
        .eq("tool_id", toolId);
      return (count ?? 0) > 0;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      isLoading,
      fetchToolByName,
      fetchToolById,
      hasActiveBorrows,
    }),
    [isLoading, fetchToolByName, fetchToolById, hasActiveBorrows],
  );
};
