import React, {Children, useCallback, useRef, useState} from "react";
import {Canvas, Group, PaintStyle, Path, Skia, SkPaint, SkPath} from "@shopify/react-native-skia";
import {SafeAreaView, StyleSheet} from "react-native";

interface IPath {
	path: SkPath;
	paint: SkPaint;
}

const paint = () => {
	const paint = Skia.Paint();
	paint.setStyle(PaintStyle.Stroke);
	paint.setStrokeWidth(4);
	paint.setColor(Skia.Color('#606'))

	return paint;
}
const App = () => {
	const styles = StyleSheet.create({
		container: {
			paddingVertical: '10%',
			flex: 1,
		},
	})

	const [paths, setPaths] = useState<IPath[]>([]);
	const currentPath = useRef<SkPath | null>(null)
	const onTouchStart = (event: any) => {
		const {locationX, locationY} = event.nativeEvent;
		currentPath.current = Skia.Path.Make()
		currentPath.current.moveTo(locationX, locationY)
		currentPath.current.lineTo(locationX, locationY)
	}
	const onTouchMove = (event: any) => {
		if (!currentPath.current) return;

		const {locationX, locationY} = event.nativeEvent;
		currentPath.current?.lineTo(locationX, locationY)
	}
	const onTouchEnd = useCallback(() => {
		if (!currentPath.current) return;
		console.log(currentPath.current, paint());//vla

		setPaths((values) => values.concat({
			path: currentPath.current!,
			paint: paint()
		}))

		currentPath.current = null;
	}, [currentPath])

	return (
		<SafeAreaView style={styles.container} >
			<Canvas style={styles.container}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
					onTouchCancel={onTouchEnd}
			>
				{!!currentPath.current && <Path
					path={currentPath.current!}
					paint={paint()}
				/>}
				<Group blendMode="multiply" >
					{
						Children.toArray(
							paths.map((value) => (
								<Path
									path={value.path}
									paint={value.paint}
								/>
							))
						)
					}
				</Group >
			</Canvas >
		</SafeAreaView >
	);
};

export default App;
