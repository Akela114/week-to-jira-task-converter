import { useJiraProjectsList } from "./api/jira/hooks/use-projects";
import { WeekProjectSelectionStep } from "./components/steps/weeek-project-selection-step";
import { WeekBoardSelectionStep } from "./components/steps/week-board-selection-step";

function App() {

	const { data: jiraData } = useJiraProjectsList();

	return (
		<div className="px-[100px] py-[50px]">
			<div className="space-y-[20px]">
				<WeekProjectSelectionStep />
				<WeekBoardSelectionStep />
			</div>
		</div>
	);
}

export default App;
