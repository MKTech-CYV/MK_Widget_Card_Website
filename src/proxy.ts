import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match localized public pages, excluding API routes, share pages, admin, and static assets.
  matcher: ["/((?!api|admin|ecard|share|_next|_vercel|.*\\..*).*)"],
};
