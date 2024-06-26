import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainerProvider } from "./components/toast-container-provider.tsx";

const queryClient = new QueryClient();

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ToastContainerProvider>
				<App />
			</ToastContainerProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
