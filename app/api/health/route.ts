export async function GET() {
  return Response.json({ status: "ok", mode: "local", aiProvider: "mock", database: "not-configured" });
}
