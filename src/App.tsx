import { useJiraProjectsList } from "./api/jira/hooks/use-projects";
import { useProjectsList } from "./api/weeek/hooks/use-projects-list";

function App() {
	const { data } = useProjectsList();
	const { data: jiraData } = useJiraProjectsList();
	

	return <div>
		<div className="mb-20">
			{JSON.stringify(data)}
		</div>
		<div>
			{JSON.stringify(jiraData)}
		</div>

	</div>
}

export default App;
