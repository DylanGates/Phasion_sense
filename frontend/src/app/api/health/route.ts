import { getServerConfig } from "@/lib/server/config"

export const dynamic = "force-dynamic"

export async function GET() {
  const { apiBase } = getServerConfig()
  try {
    const res = await fetch(`${apiBase}/health`, { cache: "no-store" })
    const data = await res.json()
    return Response.json({ status: "ok", upstream: data })
  } catch {
    return Response.json({ status: "ok", upstream: "unreachable" })
  }
}
