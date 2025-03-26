import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Network } from "lucide-react";
import CrossDomainCorrelationMatrix from "./correlation-matrices/CrossDomainCorrelationMatrix";

interface CorrelationMatrixData {
	matrices: {
		physical_cognitive: number[][];
		physical_psychological: number[][];
		cognitive_psychological: number[][];
	};
	domains: {
		physical: string[];
		cognitive: string[];
		psychological: string[];
	};
	metadata: {
		min_value: number;
		max_value: number;
	};
	cross_domain_correlation: {
		data: Array<{
			source: string;
			source_domain: string;
			target: string;
			target_domain: string;
			value: number;
		}>;
		metadata?: {
			min_value: number;
			max_value: number;
		};
	};
}

interface CorrelationMatrixProps {
	data: CorrelationMatrixData | null; // Match what's passed from CommanderDashboard
	loading: boolean;
	error: string | null;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({
	data,
	loading,
	error,
}) => {
	if (loading) {
		return (
			<div className="flex justify-center items-center h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
			</div>
		);
	}

	if (!data || error) return null;

	return (
		<Card className="col-span-2 overflow-hidden shadow-lg transform hover:scale-[1.01] transition-all duration-200">
			<div className="h-40 bg-gradient-to-r from-red-500 to-blue-600 relative overflow-hidden">
				<div
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3')",
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<div className="absolute bottom-4 left-6">
					<h3 className="text-2xl font-bold text-white">Correlations</h3>
					<p className="text-white/80 text-sm">Relationship Analysis</p>
				</div>
				<Network className="absolute top-4 right-4 h-8 w-8 text-white/80" />
			</div>

			<CardContent className="p-6">
				<CrossDomainCorrelationMatrix data={data.cross_domain_correlation} />
			</CardContent>
		</Card>
	);
};

export default CorrelationMatrix;
