import {useLocalSearchParams} from "expo-router";
import TaskPainter from "@/components/TaskPainter";
import React from "react";
import {getTaskImage} from "@/hooks/useDownloadBase64";

export default function Index() {
	const {task} = useLocalSearchParams();
	const imagePath = getTaskImage(task);
	return (
		<TaskPainter imagePath={imagePath} ></TaskPainter >
	);
}
