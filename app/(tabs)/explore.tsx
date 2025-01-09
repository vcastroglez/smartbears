import React from "react";
import { StyleSheet, View } from "react-native";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

import { Canvas, Path, Skia, notifyChange } from "@shopify/react-native-skia";

export default function() {
	const currentPath = useSharedValue(Skia.Path.Make().moveTo(0, 0));

	const pan = Gesture.Pan()
		.averageTouches(true)
		.maxPointers(1)
		.onBegin((e) => {
			currentPath.value.moveTo(e.x, e.y);
			currentPath.value.lineTo(e.x, e.y);
			notifyChange(currentPath);
		})
		.onChange((e) => {
			currentPath.value.lineTo(e.x, e.y);
			notifyChange(currentPath);
		});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={pan}>
				<Canvas style={StyleSheet.absoluteFill}>
					<Path
						path={currentPath}
						style="stroke"
						strokeWidth={40}
						strokeCap="round"
						strokeJoin="round"
						color="rgba(0, 0, 0, 0.5)"
					/>
				</Canvas>
			</GestureDetector>
		</GestureHandlerRootView>
	);
};
