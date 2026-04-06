import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/faq", "/terms", "/privacy"]
const PUBLIC_EXACT = ["/"]
const ONBOARDING_PATH = "/onboarding"

export async function proxy(request: NextRequest) {
  // Sin credenciales de Supabase (desarrollo sin .env.local), pasar sin auth
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión — SIEMPRE llamar getUser() antes de retornar
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicPath =
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const isOnboarding = pathname.startsWith(ONBOARDING_PATH)

  // Usuario no autenticado intenta acceder a ruta protegida
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Usuario autenticado intenta acceder a ruta de auth
  if (user && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Usuario autenticado sin workspace → onboarding
  // (solo verificamos si hay header de workspace que el layout setea)
  if (user && !isOnboarding && !isPublicPath) {
    const hasWorkspace = request.cookies.get("pt-workspace-id")?.value
    if (!hasWorkspace) {
      // El layout del dashboard verificará si tiene workspace vía DB.
      // El proxy solo redirige si hay cookie explícita de "sin workspace".
      const noWorkspace = request.cookies.get("pt-no-workspace")?.value
      if (noWorkspace === "1") {
        return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.mp4$|.*\\.png$|.*\\.jpg$|.*\\.svg$|mockups).*)",
  ],
}
