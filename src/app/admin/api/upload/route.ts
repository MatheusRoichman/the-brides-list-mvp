import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { uploadImageAsWebP } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();

  if (!authed) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();

  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "general";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo fornecido" }, { status: 400 });
  }

  try {
    const url = await uploadImageAsWebP(file, folder);
    
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload falhou";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
