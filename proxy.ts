import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

const authBypass = false;

export async function proxy(request: NextRequest) {
  // if (process.env.NODE_ENV === "development" && authBypass) {
  //   return NextResponse.next();
  // }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
