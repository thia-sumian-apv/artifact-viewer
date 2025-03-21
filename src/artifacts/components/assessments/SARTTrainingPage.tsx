import SARTTraining from "./sart/SARTTraining";

const SARTTrainingPage: React.FC = () => {
	return (
		<div className="h-screen w-full">
			<SARTTraining onClose={() => console.log("Training closed")} />
		</div>
	);
};

export default SARTTrainingPage;
