import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Token manquant" }),
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("employees")
      .select("id, name")
      .eq("token", token)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ success: false, message: "Employé introuvable" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: data.id,
          nom: data.name,
        },
      }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, message: String(e) }),
      { status: 500 }
    );
  }
}
