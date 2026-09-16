import type { NextRequest } from "next/server";

import { applyCors, corsOptions } from "~/app/api/cors";
import { auth } from "~/auth/server";

export const OPTIONS = (req: NextRequest) => corsOptions(req);

const handler = async (req: NextRequest) =>
  applyCors(req, await auth.handler(req));

export { handler as GET, handler as POST };
