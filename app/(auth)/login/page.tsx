import LoginPage from "@/components/pages/(auth)/Login";
import React, { Suspense } from "react";

async function page() {
	<Suspense fallback="Loading...">
		return <LoginPage />;
	</Suspense>;
}

export default page;
