import { phasionApi } from "@/lib/phasion/api"

export const revalidate = 30

export async function GET() {
  try {
    return Response.json(await phasionApi.getTeam())
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
