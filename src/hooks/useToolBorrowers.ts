import { useCallback, useEffect, useState } from "react";
import { Borrower } from "../types";
import { supabaseClient } from "../lib/supabase";

export const useToolBorrowers = (toolId: number) => {
  const [toolBorrowers, setToolBorrowers] = useState<Borrower[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchToolBorrowers = useCallback(async (toolId: number) => {
    setIsLoading(true);
    try {
      const { data } = await supabaseClient
        .from("borrower_tool")
        .select("borrower_id")
        .eq("tool_id", toolId);

      const ids = Array.from(new Set((data ?? []).map((i) => i.borrower_id)));
      if (ids.length === 0) {
        setToolBorrowers([]);
        return;
      }

      const { data: borrowers } = await supabaseClient
        .from("borrowers")
        .select("*")
        .in("id", ids);
      setToolBorrowers((borrowers as Borrower[]) ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToolBorrowers(toolId);
  }, [toolId, fetchToolBorrowers]);

  return { toolBorrowers, isLoading, fetchToolBorrowers };
};
