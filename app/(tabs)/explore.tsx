import React, {useCallback, useEffect, useState} from "react";
import {Alert, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions} from "react-native";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import {runOnJS, useSharedValue} from "react-native-reanimated";
import {downloadBase64, shareImage} from "@/hooks/useDownloadBase64";

import {
	Canvas,
	Group,
	Image,
	ImageFormat,
	notifyChange,
	PaintStyle,
	Path,
	Skia,
	SkPaint,
	SkPath,
	StrokeCap,
	StrokeJoin,
	useCanvasRef, useImage
} from "@shopify/react-native-skia";
import ScrollView = Animated.ScrollView;
import {IconSymbol} from "@/components/ui/IconSymbol";

interface IPath {
	path: SkPath;
	paint: SkPaint;
}

const paint = (color = '#000000', stroke = 4) => {
	const paint = Skia.Paint();
	paint.setStyle(PaintStyle.Stroke);
	paint.setStrokeWidth(stroke);
	paint.setColor(Skia.Color(color))
	paint.setStrokeCap(StrokeCap.Round);
	paint.setStrokeJoin(StrokeJoin.Round);

	return paint;
}
export default function () {
	const currentPath = useSharedValue(Skia.Path.Make().moveTo(0, 0));
	const [currentColor, setCurrentColor] = useState('#000000');
	const [currentStroke, setCurrentStroke] = useState(4);
	const [currentPaint, setCurrentPaint] = useState<SkPaint>(paint());
	const [paths, setPaths] = useState<IPath[]>([]);
	const pathsCanvas = useCanvasRef();
	const image = useImage(require("@/assets/images/task1.jpeg"));

	const changeStroke = (diff: number) => {
		setCurrentStroke((old) => {
			const newValue = old + diff;
			if (newValue < 1) return 1;
			return newValue;
		})
	}

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
		setCurrentPaint(paint(currentColor, currentStroke));
	}, [currentColor, currentStroke]);

	const savePath = (pathToSave: SkPath) => {
		setPaths((old) => {
			return [...old, {
				path: pathToSave,
				paint: paint(currentColor, currentStroke),
			}]
		})
	}

	const shareCanvas = () => {
		if (!pathsCanvas) return;

		let pngURL = pathsCanvas.current?.makeImageSnapshot().encodeToBase64(ImageFormat.PNG)
		console.log(pngURL);//vla
		shareImage(pngURL!).then(r => console.log(r));
	}

	const saveCanvas = () => {
		if (!pathsCanvas) return;

		let pngURL = pathsCanvas.current?.makeImageSnapshot().encodeToBase64(ImageFormat.PNG)
		console.log(pngURL);//vla
		downloadBase64(pngURL!).then(r => {
			Alert.alert(
				"Success",
				"Image saved to gallery successfully!",
				[{text: "OK"}]
			);
		});
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
		selectedColorBox: {
			borderRadius: 20,
			width: 30,
			height: 30,
			marginHorizontal: 5,
			borderColor: "#000",
			borderWidth: 3,
		},
		simpleBtn: {
			marginLeft: 25,
			paddingLeft: 2,
			borderRadius: 5,
			backgroundColor: 'white',
			width: 30,
			height: 30,
			justifyContent: 'center',
		}
	})

	const transparency = 'DF';
	const colors = [
		'#ffffff' + transparency,
		'#777777' + transparency,
		'#000000' + transparency,
		'#ff0000' + transparency,
		'#ff7777' + transparency,
		'#00ff00' + transparency,
		'#77ff77' + transparency,
		'#0000ff' + transparency,
		'#7777ff' + transparency,
	];

	const {width, height} = useWindowDimensions();

	// @ts-ignore
	return (
		<SafeAreaView style={{flex: 1, flexDirection: 'column'}} >
			<GestureHandlerRootView style={{flex: 1, flexGrow: 1}} >
				<GestureDetector gesture={pan} >
					<Canvas style={{flex: 1}} ref={pathsCanvas} >
						<Group blendMode="multiply" >
							<Image image={image} fit="contain"
								   x={0} y={0}
								   rect={{x: 0, y: 0, width: width, height: height}} height={height} width={width} />
							{
								paths.map((path, index) => <Path key={index} path={path.path} paint={path.paint} />)
							}
							<Path
								path={currentPath}
								paint={currentPaint}
							/>
						</Group >
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
					}}
															style={[{backgroundColor: color}, currentColor == color ? styles.selectedColorBox : null, styles.colorBox]} />)
				}
			</ScrollView >
			<ScrollView horizontal={true} style={{
				flex: 1,
				maxHeight: '5%',
				flexDirection: 'row',
				width: '100%',
			}} >
				<TouchableOpacity style={styles.simpleBtn} onPress={undo} >
					<IconSymbol color={'#000'} size={28} name={"undo"} ></IconSymbol >
				</TouchableOpacity >
				<TouchableOpacity style={styles.simpleBtn} onPress={() => setPaths([])} >
					<IconSymbol color={'#000'} size={28} name={"refresh"} ></IconSymbol >
				</TouchableOpacity >
				{/*<TouchableOpacity style={styles.simpleBtn} onPress={shareCanvas} >*/}
				{/*	<Text >Share</Text >*/}
				{/*</TouchableOpacity >*/}
				<TouchableOpacity style={styles.simpleBtn} onPress={saveCanvas} >
					<IconSymbol color={'#000'} size={28} name={"save"} ></IconSymbol >
				</TouchableOpacity >
				<TouchableOpacity style={styles.simpleBtn} onPress={() => changeStroke(-2)} >
					<IconSymbol color={'#000'} size={28} name={"remove"} ></IconSymbol >
				</TouchableOpacity >
				<TouchableOpacity style={styles.simpleBtn} onPress={() => changeStroke(2)} >
					<IconSymbol color={'#000'} size={28} name={"add"} ></IconSymbol >
				</TouchableOpacity >
			</ScrollView >
		</SafeAreaView >
	);
};
