import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

export default async function handler() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ----------------------------------------------------
    // 1) CREATE TEST EMPLOYEE
    // ----------------------------------------------------
    const testToken = "123456789_TEST_TOKEN";

    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .insert([
        {
          name: "Employé Test",
          token: testToken,
        },
      ])
      .select()
      .single();

    if (employeeError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Erreur insertion employé",
          error: employeeError.message,
        }),
        { status: 500 }
      );
    }

    // ----------------------------------------------------
    // 2) INSERT SAMPLE PROJECTS
    // ----------------------------------------------------
    const { error: projectsError } = await supabase.from("projects").insert([
      {
        titre: "Projet Alpha",
        description: "Analyse du système biométrique",
        semaine_debut: "Semaine 44",
        employe_id: employee.id,
      },
      {
        titre: "Projet Beta",
        description: "Développement du module QR-Code",
        semaine_debut: "Semaine 46",
        employe_id: employee.id,
      },
      {
        titre: "Projet Gamma",
        description: "Test d’intégration Supabase",
        semaine_debut: "Semaine 47",
        employe_id: employee.id,
      },
    ]);

    if (projectsError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Erreur insertion projets",
          error: projectsError.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Seed completed",
        token_to_use_in_flutter: testToken,
        employee_id: employee.id,
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
