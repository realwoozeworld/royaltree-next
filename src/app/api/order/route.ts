import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (record && record.resetAt > now) {
      if (record.count >= 5) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
      record.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    }

    const body = await req.json();
    const { fullName, phone, region, notes, quantities, website } = body;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const t1 = Number(quantities?.tier1 || 0);
    const t2 = Number(quantities?.tier2 || 0);
    const t3 = Number(quantities?.tier3 || 0);
    const totalTrees = t1 + t2 + t3;
    const totalPrice = t1 * 10 + t2 * 20 + t3 * 50;

    const receiver =
      process.env.ORDER_RECEIVER_EMAIL || "infopaulownia1@gmail.com";

    const { error } = await resend.emails.send({
      from: "Royal Tree <onboarding@resend.dev>",
      to: [receiver],
      subject: `ახალი შეკვეთა: ${fullName} (${totalTrees} ნერგი — ${totalPrice} ₾)`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #16241b;">
          <h2 style="color: #8a6414;">ახალი შეკვეთა — Royal Tree (სამეფო ხე)</h2>
          <p><strong>დამკვეთი:</strong> ${fullName}</p>
          <p><strong>ტელეფონი:</strong> ${phone}</p>
          <p><strong>რეგიონი / მდებარეობა:</strong> ${region || "არ არის მითითებული"}</p>
          <hr />
          <h3>შეკვეთის დეტალები:</h3>
          <ul>
            <li>1-წლიანი ნერგი (10₾): <strong>${t1} ცალი</strong></li>
            <li>ელიტარული ნერგი (20₾): <strong>${t2} ცალი</strong></li>
            <li>სამეფო ეგზემპლარი (50₾): <strong>${t3} ცალი</strong></li>
          </ul>
          <p><strong>სულ ნერგები:</strong> ${totalTrees} ცალი</p>
          <p><strong>ჯამური ღირებულება:</strong> ${totalPrice.toLocaleString()} ₾</p>
          ${notes ? `<p><strong>კომენტარი:</strong> ${notes}</p>` : ""}
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process order." },
      { status: 500 }
    );
  }
}