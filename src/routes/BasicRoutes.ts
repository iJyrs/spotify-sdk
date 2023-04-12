import { BearerRoutes } from "./BearerRoutes";

// I know this structure seems a bit weird but essentially
// BasicRoutes is just a subset of BearerRoutes. We can
// use Omit<T, K> to remove unsupported functions.

export type BasicRoutes = Omit<BearerRoutes,
    "getCurrentProfile"
>;