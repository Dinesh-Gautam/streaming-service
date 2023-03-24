import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // return NextResponse
    console.log("User is admin");
    console.log(req.url);
    return NextResponse.rewrite(new URL(req.url));
  },
  {
    callbacks: {
      authorized({ token }) {
        console.log(token);
        return token?.role === "admin";
      },
    },
  }
);

export const config = { matcher: ["/admin", "/admin/:path*"] };
