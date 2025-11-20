import LoginPage from "@/components/pages/(auth)/Login";
import React, { Suspense } from "react";

async function page() {
	return (
		<Suspense fallback="Loading...">
			<LoginPage />
		</Suspense>
	);
}

export default page;
