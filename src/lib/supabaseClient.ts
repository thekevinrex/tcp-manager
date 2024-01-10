import { auth, useAuth } from "@clerk/nextjs";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

declare global {
	var supabase: SupabaseClient | undefined;
}

export const supabaseServerClient = () => {
	try {
		return supabaseClient();
	} catch (err) {
		return null;
	}
};

export const supabaseBrowserClient = async () => {
	try {
		return supabaseClient();
	} catch (err) {
		return null;
	}
};

const supabaseClient = () => {
	if (global.supabase) {
		return global.supabase;
	}

	const supabase = createClient(supabaseUrl, supabaseKey);

	if (process.env.NODE_ENV !== "production") {
		global.supabase = supabase;
	}

	return supabase;
};

function GetClerkToken() {
	const { getToken } = auth();

	try {
		return getToken({ template: "supabase_auth" });
	} catch (err: any) {
		console.log(err.message);

		if (err.message == "fetch failed") {
			return GetClerkToken();
		}
	}

	return null;
}

function GetClerkTokenBrowser() {
	const { getToken } = useAuth();

	try {
		return getToken({ template: "supabase_auth" });
	} catch (err: any) {
		console.log(err.message);

		if (err.message == "fetch failed") {
			return GetClerkTokenBrowser();
		}
	}

	return null;
}

export default supabaseServerClient;
