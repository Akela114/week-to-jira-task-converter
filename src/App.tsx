import { WeekProjectSelectionStep } from "./components/steps/weeek-project-selection-step";
import { WeekBoardSelectionStep } from "./components/steps/week-board-selection-step";

function App() {
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
