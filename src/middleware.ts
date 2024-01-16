import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
	// A list of all locales that are supported
	locales: ["en", "es"],

	// Used when no locale matches
	defaultLocale: "es",
});

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
	// publicRoutes: ["/:locale", "/:locale/sign-in", "/api/webhooks(.*)"],
	publicRoutes: (req) =>
		!req.url.includes("/panel") ||
		req.url.endsWith("/panel") ||
		req.url.endsWith("/panel/solicitar"),
	beforeAuth: (req) => {
		if (req.nextUrl.pathname.startsWith("/api")) {
			return;
		}

		return intlMiddleware(req);
	},
	afterAuth(auth, req, evt) {
		// Handle users who aren't authenticated
		if (!auth.userId && !auth.isPublicRoute) {
			return redirectToSignIn({ returnBackUrl: req.url });
		}
		// Redirect logged in users to organization selection page if they are not active in an organization
		if (
			auth.userId &&
			!auth.orgId &&
			!auth.isPublicRoute &&
			!req.nextUrl.pathname.endsWith("/org-selection")
		) {
			const orgSelection = new URL("/panel/org-selection", req.url);
			return NextResponse.redirect(orgSelection);
		}

		// If the user is logged in and trying to access a protected route, allow them to access route
		if (auth.userId && !auth.isPublicRoute) {
			return NextResponse.next();
		}

		// Allow users visiting public routes to access them
		return NextResponse.next();
	},
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
