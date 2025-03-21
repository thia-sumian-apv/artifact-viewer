import { useState, useEffect } from "react";

export function useKeyPress(targetKey: string, onPress?: () => void) {
	const [keyPressed, setKeyPressed] = useState(false);

	useEffect(() => {
		const downHandler = (event: KeyboardEvent) => {
			if (event.code === targetKey) {
				setKeyPressed(true);
				onPress?.();
			}
		};

		const upHandler = (event: KeyboardEvent) => {
			if (event.code === targetKey) {
				setKeyPressed(false);
			}
		};

		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);

		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
	}, [targetKey, onPress]);

	return keyPressed;
}
