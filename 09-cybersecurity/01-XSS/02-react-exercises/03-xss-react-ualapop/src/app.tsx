import React from "react";
import { RouterComponent } from "./core";
import { Layout } from "./layouts";

export const App: React.FC = () => {
	return (
		<Layout>
			<RouterComponent />
		</Layout>
	);
};
