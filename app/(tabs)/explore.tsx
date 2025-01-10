import React from "react";
import {
	SafeAreaView,
} from "react-native";
import TaskPainter from "@/components/TaskPainter";

export default function () {

	return (
		<SafeAreaView style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}} >
			<TaskPainter></TaskPainter>
		</SafeAreaView >
	);
};
