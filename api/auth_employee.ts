import { createClient } from "@supabase/supabase-js";

// ======================================================
// DEBUG LOGS — Pour vérifier que Vercel charge bien les variables
// ======================================================
console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SERVICE_ROLE:", process.env.SUPABASE_SERVICE_ROLE_KEY);

// ======================================================
// Configuration de l’API en mode Edge
// ======================================================
export const config = {
  runtime: "edge",
};

// ======================================================
// Handler principal
// ======================================================
export default async function handler(req: Request) {
  try {
    const { token } = await req.json().catch(() => ({}));

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Token manquant" }),
        { status: 400 }
      );
    }

    // ======================================================
    // Connexion Supabase
    // ======================================================
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ======================================================
    // Vérification de l’employé via le token
    // ======================================================
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

    // ======================================================
    // Succès
    // ======================================================
    return new Response(JSON.stringify({ success: true, employee: data }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur interne",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
