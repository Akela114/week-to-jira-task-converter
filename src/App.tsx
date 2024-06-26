import { useProjectsList } from "./api/weeek/hooks/use-projects-list";

function App() {
	const { data } = useProjectsList();

	return JSON.stringify(data);
}

export default App;
