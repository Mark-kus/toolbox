import { useCallback, useEffect, useState } from "react";
import { Borrower } from "../types";
import { supabaseClient } from "../lib/supabase";

export const useToolBorrowers = (toolId: number) => {
  const [toolBorrowers, setToolBorrowers] = useState<Borrower[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchToolBorrowers = useCallback(async (toolId: number) => {
    setIsLoading(true);
    try {
      const { data: borrowData } = await supabaseClient
        .from("borrower_tool")
        .select("borrower_id, tool_id")
        .eq("tool_id", toolId);

      const borrowCounts = (borrowData ?? []).reduce(
        (acc, curr) => {
          acc[curr.borrower_id] = (acc[curr.borrower_id] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      const ids = Object.keys(borrowCounts).map(Number);
      if (ids.length === 0) {
        setToolBorrowers([]);
        return;
      }

      const { data: borrowers } = await supabaseClient
        .from("borrowers")
        .select("*")
        .in("id", ids);

      const borrowersWithCount = (borrowers ?? []).map((borrower) => ({
        ...borrower,
        borrowCount: borrowCounts[borrower.id],
      }));

      setToolBorrowers(
        borrowersWithCount as (Borrower & { borrowCount: number })[],
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToolBorrowers(toolId);
  }, [toolId, fetchToolBorrowers]);

  return { toolBorrowers, isLoading, fetchToolBorrowers };
};
