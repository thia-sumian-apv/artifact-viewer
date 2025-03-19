import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Assessment } from "../../AssessmentCard";

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

const SARTConfig = () => (
	<div className="space-y-6">
		<Card className="p-4 space-y-4">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label>Noise Level</Label>
					<Slider defaultValue={[50]} max={100} step={1} />
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

const VisualRXNConfig = () => (
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
					<Slider defaultValue={[50]} max={100} step={1} />
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

const SpatialPlanningConfig = () => (
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
							/>
						</div>
					))}
				</div>
			</div>
		</Card>
	</div>
);

const PsychologicalConfig = () => (
	<div className="space-y-6">
		<Card className="p-4">
			<div className="space-y-4">
				<p className="text-sm text-gray-500">
					Configure survey questions and responses for psychological assessments
				</p>
				{/* Add survey configuration UI here */}
			</div>
		</Card>
	</div>
);

export function ConfigureAssessmentsStep({
	assessments,
}: ConfigureAssessmentsStepProps) {
	return (
		<div className="space-y-6">
			<Tabs defaultValue={assessments[0]?.id}>
				<TabsList className="w-full">
					{assessments.map((assessment) => (
						<TabsTrigger key={assessment.id} value={assessment.id}>
							{assessment.title}
						</TabsTrigger>
					))}
				</TabsList>

				{assessments.map((assessment) => (
					<TabsContent key={assessment.id} value={assessment.id}>
						{assessment.id === "sart" && <SARTConfig />}
						{assessment.id === "visual-rxn" && <VisualRXNConfig />}
						{assessment.id === "spatial-planning" && <SpatialPlanningConfig />}
						{["ml360", "team-resilience", "self-determination"].includes(
							assessment.id,
						) && <PsychologicalConfig />}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
