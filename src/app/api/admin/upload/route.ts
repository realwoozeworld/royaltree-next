import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY აკლია .env.local-ში" },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, serviceKey);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ფაილი ვერ მოიძებნა" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await adminSupabase.storage
      .from("royal-tree-media")
      .upload(fileName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = adminSupabase.storage
      .from("royal-tree-media")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "ატვირთვის შეცდომა" },
      { status: 500 }
    );
  }
}