import RegisterPage from "@/components/pages/(auth)/Register";
import React, { Suspense } from "react";

function page() {
	return (
		<Suspense fallback="Loading...">
			<RegisterPage />
		</Suspense>
	);
}

export default page;
