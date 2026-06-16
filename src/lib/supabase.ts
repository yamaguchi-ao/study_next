// supabase client
import { createClient } from "@supabase/supabase-js";
import { getSing } from "@/app/actions/action";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_URL!;

type SupabaseClientSingleton = ReturnType<typeof supabaseClientSingleton>;

const globalForSupabase = global as unknown as {
    supabase: SupabaseClientSingleton | undefined;
}

const supabaseClientSingleton = () => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            accessToken: async () => {
                const jwtUrl = await getSing();
                return jwtUrl!.toString();
            }
        });
    return supabase;
}

const supabase = globalForSupabase.supabase ?? supabaseClientSingleton();

export default supabase;

if (process.env.NODE_ENV !== "production") globalForSupabase.supabase = supabase;