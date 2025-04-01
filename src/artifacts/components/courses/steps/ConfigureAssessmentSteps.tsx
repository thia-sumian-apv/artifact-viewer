import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Assessment } from "../../AssessmentCard";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export interface AssessmentConfigs {
	sart?: {
		noiseLevel: number;
		practiceQuestions: number;
		mainQuestions: number;
		displayTime: number;
		initialCrossDuration: number;
	};
	"visual-rxn"?: {
		gameMode: string;
		memorizeTime: number;
		questionDisplayTime: number;
		roundConfigs: Record<
			string,
			{
				imagesToMemorize: number;
				questionsCount: number;
				noiseLevel: number;
			}
		>;
	};
	"spatial-planning"?: {
		timePerQuestion: number;
		practiceRounds: number;
		questionsPerRound: number;
		moveDistribution: Array<{ moves: number; percentage: number }>;
	};
	ml360?: PsychologicalConfig;
	"team-resilience"?: PsychologicalConfig;
	"self-determination"?: PsychologicalConfig;
}

interface PsychologicalConfig {
	questions: Array<{
		text: string;
		type: "multiple-choice" | "likert-scale" | "text";
		options?: string[];
	}>;
}

interface ConfigureAssessmentsStepProps {
	assessments: Assessment[];
	configs: AssessmentConfigs;
	onUpdate: (configs: AssessmentConfigs) => void;
	onBack: () => void;
	onComplete: () => void;
}

const SARTConfig = () => {
	const [noiseLevel, setNoiseLevel] = useState(50);

	return (
		<div className="space-y-6">
			<Card className="p-4 space-y-4">
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Noise Level</Label>
						<div className="flex items-center gap-4">
							<Slider
								defaultValue={[50]}
								max={100}
								step={1}
								onValueChange={(value) => setNoiseLevel(value[0])}
							/>
							<span className="min-w-[3rem] text-sm  text-right">
								{noiseLevel}%
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Practice Questions</Label>
							<Input type="number" defaultValue={25} />
						</div>
						<div className="space-y-2">
							<Label>Main Questions</Label>
							<Input type="number" defaultValue={180} />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Display Time (ms)</Label>
							<Input type="number" defaultValue={1150} />
						</div>
						<div className="space-y-2">
							<Label>Initial Cross Duration (ms)</Label>
							<Input type="number" defaultValue={100} />
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

const VisualRXNConfig = () => {
	const [noiseLevel, setNoiseLevel] = useState(50);

	return (
		<div className="space-y-6">
			<Card className="p-4 space-y-4">
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Memorize Time (s)</Label>
							<Input type="number" defaultValue={60} />
						</div>
						<div className="space-y-2">
							<Label>Question Display Time (s)</Label>
							<Input type="number" defaultValue={3} />
						</div>
					</div>

					<div className="space-y-2">
						<Label>Noise Level</Label>
						<div className="flex items-center gap-4">
							<Slider
								defaultValue={[50]}
								max={100}
								step={1}
								onValueChange={(value) => setNoiseLevel(value[0])}
							/>
							<span className="min-w-[3rem] text-sm  text-right">
								{noiseLevel}%
							</span>
						</div>
					</div>

					{["Practice", "Round 1", "Round 2", "Round 3"].map((round) => (
						<Card key={round} className="p-3 space-y-3">
							<h4 className="font-medium">{round}</h4>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label>Images to Memorize</Label>
									<Input type="number" defaultValue={3} />
								</div>
								<div className="space-y-2">
									<Label>Questions Count</Label>
									<Input type="number" defaultValue={20} />
								</div>
							</div>
						</Card>
					))}
				</div>
			</Card>
		</div>
	);
};

const SpatialPlanningConfig = () => {
	const [moveDistribution, setMoveDistribution] = useState({
		3: 40,
		4: 40,
		5: 20,
		6: 0,
		7: 0,
		8: 0,
	});

	const handleDistributionChange = (moves: number, value: number[]) => {
		setMoveDistribution((prev) => ({
			...prev,
			[moves]: value[0],
		}));
	};

	return (
		<div className="space-y-6">
			<Card className="p-4 space-y-4">
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Time Per Question (s)</Label>
						<Input type="number" defaultValue={60} />
					</div>

					<div className="space-y-2">
						<Label>Practice Rounds</Label>
						<Input type="number" defaultValue={1} />
					</div>

					<div className="space-y-2">
						<Label>Questions Per Round</Label>
						<Input type="number" defaultValue={5} />
					</div>

					<div className="space-y-3">
						<Label>Move Distribution</Label>
						{[3, 4, 5, 6, 7, 8].map((moves) => (
							<div key={moves} className="flex items-center gap-4">
								<span className="w-20">{moves} moves:</span>
								<Slider
									defaultValue={[
										moves === 3 || moves === 4 ? 40 : moves === 5 ? 20 : 0,
									]}
									max={100}
									step={5}
									onValueChange={(value) =>
										handleDistributionChange(moves, value)
									}
								/>
								<span className="min-w-[3rem] text-sm  text-right">
									{moveDistribution[moves as keyof typeof moveDistribution]}%
								</span>
							</div>
						))}
					</div>
				</div>
			</Card>
		</div>
	);
};

const PsychologicalConfig = ({ assessmentId }: { assessmentId: string }) => {
	type Question =
		| {
				id: string;
				text: string;
				type: "likert-scale" | "frequency-scale";
				options: string[];
		  }
		| { id: string; text: string; type: "slider"; value: number };

	const [questions, setQuestions] = useState<Question[]>([]);
	const [prompt, setPrompt] = useState("");

	// Use effect to update state when assessmentId changes
	useEffect(() => {
		// Reset questions based on assessment type
		// Reset questions based on assessment type
		if (assessmentId === "self-determination") {
			setQuestions([
				{
					id: "q1",
					text: "I feel that my opinions are valued in the team",
					type: "likert-scale",
					options: [
						"Strongly Disagree",
						"Disagree",
						"Neutral",
						"Agree",
						"Strongly Agree",
					],
				},
			]);
			setPrompt("");
		} else if (assessmentId === "ml360") {
			setQuestions([
				{
					id: "q1",
					text: "Acknowledge own gaps and limitations",
					type: "frequency-scale",
					options: [
						"Almost Never",
						"Rarely",
						"Once In A While",
						"Occasionally",
						"Usually",
						"Very Frequently",
						"Almost Always",
					],
				},
			]);
			setPrompt(
				"Rate how often you demonstrate these behaviours. Choose the response that best describes you, there are no right or wrong answers.",
			);
		} else if (assessmentId === "team-resilience") {
			setQuestions([
				{
					id: "q1",
					text: "Energy",
					type: "slider",
					value: 50,
				},
			]);
			setPrompt(
				"Using the scale below, choose the number that describes your team's current resource level.",
			);
		}
	}, [assessmentId]); // Re-run when assessmentId changes

	// Add a new option to a question
	const addOption = (questionId: string) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId && "options" in q) {
					return {
						...q,
						options: [...q.options, "New Option"],
					};
				}
				return q;
			}),
		);
	};

	// Update option text
	const updateOption = (
		questionId: string,
		optionIndex: number,
		value: string,
	) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId && "options" in q) {
					const newOptions = [...q.options];
					newOptions[optionIndex] = value;
					return {
						...q,
						options: newOptions,
					};
				}
				return q;
			}),
		);
	};

	// Remove an option
	const removeOption = (questionId: string, optionIndex: number) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId && "options" in q) {
					const newOptions = [...q.options];
					newOptions.splice(optionIndex, 1);
					return {
						...q,
						options: newOptions,
					};
				}
				return q;
			}),
		);
	};

	// Toggle question type between slider and scale
	const toggleQuestionType = (questionId: string) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId) {
					if ("options" in q) {
						return {
							id: q.id,
							text: q.text,
							type: "slider",
							value: 50,
						};
					}
					return {
						id: q.id,
						text: q.text,
						type: assessmentId === "ml360" ? "frequency-scale" : "likert-scale",
						options:
							assessmentId === "ml360"
								? ["Almost Never", "Occasionally", "Very Frequently"] // Simplified options
								: ["Disagree", "Neutral", "Agree"],
					};
				}
				return q;
			}),
		);
	};

	const addQuestion = () => {
		if (assessmentId === "team-resilience") {
			setQuestions([
				...questions,
				{
					id: `q${questions.length + 1}`,
					text: "",
					type: "slider" as const,
					value: 50,
				},
			]);
		} else {
			setQuestions([
				...questions,
				{
					id: `q${questions.length + 1}`,
					text: "",
					type:
						assessmentId === "ml360"
							? "frequency-scale"
							: ("likert-scale" as "frequency-scale" | "likert-scale"),
					options:
						assessmentId === "self-determination"
							? [
									"Strongly Disagree",
									"Disagree",
									"Neutral",
									"Agree",
									"Strongly Agree",
								]
							: [
									"Almost Never",
									"Rarely",
									"Once In A While",
									"Occasionally",
									"Usually",
									"Very Frequently",
									"Almost Always",
								],
				},
			]);
		}
	};

	const updateQuestion = (
		id: string,
		field: string,
		value: string | number | string[],
	) => {
		setQuestions(
			questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
		);
	};

	const removeQuestion = (id: string) => {
		setQuestions(questions.filter((q) => q.id !== id));
	};

	return (
		<div className="space-y-6">
			<Card className="p-4 space-y-6">
				{/* Survey Prompt */}
				<div className="space-y-2">
					<Label>Survey Prompt</Label>
					<Textarea
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Enter prompt text that will appear at the top of the survey"
						className="min-h-[80px] resize-y"
					/>
				</div>

				{/* Questions List */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<Label>Questions</Label>
						<Button
							variant="outline"
							size="sm"
							onClick={addQuestion}
							className="gap-1"
						>
							<span className="text-xs">+</span> Add Question
						</Button>
					</div>

					{questions.map((question, index) => (
						<Card
							key={question.id}
							className="p-3 space-y-3 border border-muted"
						>
							<div className="flex justify-between items-center mb-2">
								<CardDescription>Question {index + 1}</CardDescription>
								<div className="flex items-center gap-2">
									<div className="flex items-center space-x-2">
										<span className="text-xs ">
											{question.type === "slider" ? "Slider" : "Scale"}
										</span>
										<Switch
											checked={question.type === "slider"}
											onCheckedChange={() => toggleQuestionType(question.id)}
											aria-label="Toggle question type"
										/>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeQuestion(question.id)}
										className="h-8 w-8 rounded-full  hover:text-destructive hover:bg-destructive/10"
									>
										×
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Textarea
									value={question.text}
									onChange={(e) =>
										updateQuestion(question.id, "text", e.target.value)
									}
									placeholder="Enter question text"
									className="min-h-[60px] resize-y"
								/>
							</div>

							{question.type === "slider" ? (
								<div className="space-y-2">
									<Label className="text-xs ">Default Value</Label>
									<div className="flex items-center gap-4">
										<Slider
											defaultValue={[question.value || 50]}
											value={[question.value || 50]}
											max={100}
											step={1}
											onValueChange={(value) =>
												updateQuestion(question.id, "value", value[0])
											}
										/>
										<span className="min-w-[3rem] text-sm  text-right">
											{question.value || 50}%
										</span>
									</div>
								</div>
							) : (
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<Label className="text-xs ">Response Options</Label>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => addOption(question.id)}
											className="h-7 text-primary hover:text-primary hover:bg-primary/10"
										>
											<span className="text-xs mr-1">+</span> Add Option
										</Button>
									</div>
									<div className="space-y-2">
										{question.options.map((option, optionIndex) => (
											<div
												key={`${question.id}-option-${optionIndex}`}
												className="flex items-center gap-2"
											>
												<Input
													value={option}
													onChange={(e) =>
														updateOption(
															question.id,
															optionIndex,
															e.target.value,
														)
													}
													placeholder={`Option ${optionIndex + 1}`}
													className="flex-1"
												/>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => removeOption(question.id, optionIndex)}
													disabled={question.options.length <= 2}
													className="h-8 w-8 rounded-full  hover:text-destructive hover:bg-destructive/10"
												>
													×
												</Button>
											</div>
										))}
									</div>
								</div>
							)}
						</Card>
					))}
				</div>
			</Card>
		</div>
	);
};

export function ConfigureAssessmentsStep({
	assessments,
}: ConfigureAssessmentsStepProps) {
	const [activeTab, setActiveTab] = useState<string>(assessments[0]?.id || "");

	// Render content based on active tab
	const renderContent = () => {
		const current = assessments.find(
			(assessment) => assessment.id === activeTab,
		);
		if (!current) return null;

		switch (current.id) {
			case "sart":
				return <SARTConfig />;
			case "visual-rxn":
				return <VisualRXNConfig />;
			case "spatial-planning":
				return <SpatialPlanningConfig />;
			case "ml360":
			case "team-resilience":
			case "self-determination":
				return <PsychologicalConfig assessmentId={current.id} />;
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Fixed tabs section - completely separate from Tabs component */}
			<div className="bg-background pb-4 flex">
				<div className="flex gap-2 relative w-full rounded-lg p-1 bg-muted overflow-hidden">
					{assessments.map((assessment) => (
						<Button
							key={assessment.id}
							variant={activeTab === assessment.id ? "default" : "ghost"}
							size="sm"
							onClick={() => setActiveTab(assessment.id)}
							className={`relative font-medium ${
								activeTab === assessment.id ? "shadow-sm" : ""
							}`}
						>
							{assessment.title}
						</Button>
					))}
				</div>
			</div>

			{/* Scrollable content section */}
			<div className="overflow-y-auto flex-1 mt-4 pr-1">{renderContent()}</div>
		</div>
	);
}
