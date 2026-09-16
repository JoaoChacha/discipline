import { useQuery } from "@tanstack/react-query";

import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export function useCommitments() {
  const { data: session } = authClient.useSession();
  const query = useQuery(trpc.commitment.list.queryOptions());
  const mine = (query.data ?? []).flatMap((row) => (row ? [row] : []));
  const owned = mine.filter((row) => row.ownerId === session?.user.id);
  const open = owned.filter((row) =>
    ["draft", "awaiting_verifier", "active", "proof_submitted"].includes(
      row.status,
    ),
  );
  return {
    ...query,
    mine,
    owned,
    active: open[0] ?? null,
  };
}
