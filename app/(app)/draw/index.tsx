import {useLocalSearchParams} from "expo-router";
import TaskPainter from "@/components/TaskPainter";
import React from "react";

export default function Index() {
	const {task} = useLocalSearchParams();
	return (
		<TaskPainter imagePath={task} ></TaskPainter >
	);
}
