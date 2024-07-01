import { JiraAddTasks } from "./components/steps/jira-add-tasks";
import { JiraProjectSelectionStep } from "./components/steps/jira-project-selection-step";
import { JiraStatusesStep } from "./components/steps/jira-statuses-step";
import { StatusesMappingStep } from "./components/steps/statuses-mapping-step";
import { UsersMappingStep } from "./components/steps/users-mapping-step";
import { WeekProjectSelectionStep } from "./components/steps/weeek-project-selection-step";
import { WeekBoardSelectionStep } from "./components/steps/week-board-selection-step";
import { WeekTaskFetchingStep } from "./components/steps/week-task-fetching-step";

function App() {
	return (
		<div className="px-[100px] py-[50px]">
			<div>
				<WeekProjectSelectionStep />
				<WeekBoardSelectionStep />
				<WeekTaskFetchingStep />
				<UsersMappingStep />
				<JiraProjectSelectionStep />
				<JiraStatusesStep />
				<StatusesMappingStep />
				<JiraAddTasks />
			</div>
		</div>
	);
}

export default App;
