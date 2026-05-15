import { supabase } from "@/lib/supabase/client";
import { analyzeMernProfile } from "@/lib/ai/mern-analyzer";

export async function getCurrentUserAnalysis() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      profile: null,
      completions: [],
      analysis: null,
      error: "لم يتم العثور على جلسة المستخدم",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      user,
      profile: null,
      completions: [],
      analysis: null,
      error: "لم يتم العثور على ملف المستخدم",
    };
  }

  const { data: completions } = await supabase
    .from("course_completions")
    .select("*")
    .eq("user_id", user.id);

  const analysis = analyzeMernProfile(profile, completions || []);

  return {
    user,
    profile,
    completions: completions || [],
    analysis,
    error: null,
  };
}