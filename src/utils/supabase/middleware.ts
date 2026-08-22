import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    if (user.user_metadata?.is_admin) {
      isAdmin = true
    } else {
      // Check profiles table (fails gracefully if table doesn't exist yet)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile?.role === 'admin') {
        isAdmin = true
      }
    }
  }

  // Admin route protection in middleware
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // allow /admin/login page
    if (request.nextUrl.pathname === '/admin/login') {
      if (isAdmin) {
        // already admin, redirect to dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    // if not logged in or not admin, redirect to login
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Customer Account route protection
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Checkout route protection
  if (request.nextUrl.pathname === '/checkout') {
    if (!user) {
      // Don't strictly block in middleware because we might want to show the login UI
      // inside the checkout page itself. Let the checkout page handle it.
    }
  }

  return supabaseResponse
}
