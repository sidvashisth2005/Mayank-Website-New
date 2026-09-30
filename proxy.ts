import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// The public site stays public. Member areas require a session; the pages
// themselves still check ownership and the admin list on every request.
const isMemberArea = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isMemberArea(request)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|avif|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
