import { useState, useCallback } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface FullscreenButtonProps {
	containerRef: React.RefObject<HTMLDivElement>;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
	containerRef,
}) => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			containerRef.current
				?.requestFullscreen()
				.then(() => {
					setIsFullscreen(true);
				})
				.catch((err) => {
					console.error(
						`Error attempting to enable fullscreen: ${err.message}`,
					);
				});
		} else {
			document
				.exitFullscreen()
				.then(() => {
					setIsFullscreen(false);
				})
				.catch((err) => {
					console.error(`Error attempting to exit fullscreen: ${err.message}`);
				});
		}
	}, [containerRef]);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						onClick={toggleFullscreen}
					>
						{isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
						<span className="sr-only">
							{isFullscreen ? "Exit fullscreen" : "Full screen"}
						</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Click here for full screen</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default FullscreenButton;
