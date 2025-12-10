import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get("employee_id");

    if (!employeeId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "employee_id manquant",
        }),
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("projects")
      .select("id, titre, description, semaine_debut")
      .eq("employe_id", Number(employeeId));

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Erreur lors de la récupération des projets",
          error: error.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: data ?? [],
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur interne du serveur",
        error: err?.message,
      }),
      { status: 500 }
    );
  }
}
