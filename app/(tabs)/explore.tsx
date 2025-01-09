import React, {useCallback, useEffect, useState} from "react";
import {Animated, Button, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import {runOnJS, useSharedValue} from "react-native-reanimated";

import {
	Canvas, Group,
	notifyChange,
	PaintStyle,
	Path,
	Skia,
	SkPaint,
	SkPath,
	StrokeCap,
	StrokeJoin, useCanvasRef
} from "@shopify/react-native-skia";
import ScrollView = Animated.ScrollView;

interface IPath {
	path: SkPath;
	paint: SkPaint;
}

const paint = (color = '#000000') => {
	const paint = Skia.Paint();
	paint.setStyle(PaintStyle.Stroke);
	paint.setStrokeWidth(4);
	paint.setColor(Skia.Color(color))
	paint.setStrokeCap(StrokeCap.Round);
	paint.setStrokeJoin(StrokeJoin.Round);

	return paint;
}
export default function () {
	const currentPath = useSharedValue(Skia.Path.Make().moveTo(0, 0));
	const [currentColor, setCurrentColor] = useState('#000000');
	const [currentPaint, setCurrentPaint] = useState<SkPaint>(paint());
	const [paths, setPaths] = useState<IPath[]>([]);
	const pathsCanvas = useCanvasRef();

	const undo = useCallback(() => {
		if (!paths.length) return;
		console.log(paths.length);//vla

		setPaths((old) => {
			old.pop();
			return [...old];
		});
		if (pathsCanvas.current) {
			pathsCanvas.current.redraw(); // or any other color you prefer
		}
	}, [paths]);

	useEffect(() => {
		setCurrentPaint(paint(currentColor));
	}, [currentColor]);

	const savePath = (pathToSave: SkPath) => {
		setPaths((old) => {
			return [...old, {
				path: pathToSave,
				paint: paint(currentColor),
			}]
		})
	}

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
		})
		.onEnd((e) => {
			runOnJS(savePath)(currentPath.value.copy());
			currentPath.value.reset();
			notifyChange(currentPath);
		});

	const styles = StyleSheet.create({
		colorBox: {
			borderRadius: 20,
			width: 30,
			height: 30,
			marginHorizontal: 5,
		},
		simpleBtn: {
			marginLeft: 20,
			paddingLeft: 7,
			borderRadius: 5,
			backgroundColor: 'white',
			width: 50,
			height: 30,
			justifyContent: 'center',
		}
	})

	const colors = [
		'#ffffff',
		'#777777',
		'#000000',
		'#ff0000',
		'#ff7777',
		'#00ff00',
		'#77ff77',
		'#0000ff',
		'#7777ff',
	];

	return (
		<SafeAreaView style={{flex: 1, flexDirection: 'column', backgroundColor: 'lightgray'}} >
			<Canvas style={StyleSheet.absoluteFill} ref={pathsCanvas} >
				<Group blendMode="multiply" >
					{
						paths.map((path, index) => <Path key={index} path={path.path} paint={path.paint} />)
					}
				</Group >
			</Canvas >
			<GestureHandlerRootView style={{flex: 1, flexGrow: 1}} >
				<GestureDetector gesture={pan} >
					<Canvas style={StyleSheet.absoluteFill} >
						<Path
							path={currentPath}
							paint={currentPaint}
						/>
					</Canvas >
				</GestureDetector >
			</GestureHandlerRootView >
			<ScrollView horizontal={true} style={{
				flex: 1,
				maxHeight: '5%',
				padding: '2%',
				paddingLeft: '5%',
				flexDirection: 'row',
				width: '100%'
			}} >
				{
					colors.map((color) => <TouchableOpacity key={color} onPress={() => {
						setCurrentColor(color)
					}} style={[{backgroundColor: color}, styles.colorBox]} />)
				}
			</ScrollView >
			<ScrollView horizontal={true} style={{
				flex: 1,
				maxHeight: '5%',
				flexDirection: 'row',
				width: '100%',
			}} >
				<TouchableOpacity style={styles.simpleBtn} onPress={undo} >
					<Text >Undo</Text >
				</TouchableOpacity >
				<TouchableOpacity style={styles.simpleBtn} onPress={() => setPaths([])} >
					<Text >Reset</Text >
				</TouchableOpacity >
			</ScrollView >
		</SafeAreaView >
	);
};
