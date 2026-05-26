import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Get secret from environment
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_do_not_use_in_production";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

// Paths that require admin authentication
const ADMIN_PATH_REGEX = /^\/api\/admin\//;
// Paths to exclude from admin authentication (public admin routes)
const PUBLIC_ADMIN_PATHS = ["/api/admin/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if it's an admin API route
    if (ADMIN_PATH_REGEX.test(pathname)) {
        // 2. exclude public paths (like login)
        if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
            return NextResponse.next();
        }

        // 3. Check for admin-token cookie
        const token = request.cookies.get("admin-token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            );
        }

        // 4. Verify token using jose (Edge-compatible)
        try {
            await jwtVerify(token, SECRET_KEY);
            // Valid token, proceed
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware Auth Error:", error);
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            );
        }
    }

    // Allow all other requests
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all API routes
        "/api/:path*",
    ],
};
