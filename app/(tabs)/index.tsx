import {
	Image, ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View
} from "react-native";
import {router} from "expo-router";
import {useTaskImages} from "@/hooks/useTaskImages";
import React, {useEffect} from "react";

const ImageDemo = () => {
	const {width} = useWindowDimensions();
	const {
		images,
		isLoading,
		refreshImages,
	} = useTaskImages();

	useEffect(() => {
		if (images.length) return;
		refreshImages();
	}, [images]);

	if (isLoading || !images) return (
		<Text >IS LOADING</Text >
	);

	const AllTasks = () => {
		let toReturn = [];
		for (let i = 0; i < images.length; i++) {
			const fullUrl = images[i].full_url;
			toReturn.push(
				<TouchableOpacity key={i} onPress={() => router.push({pathname: "/draw", params: {task: fullUrl}})} >
					<Image resizeMethod={'auto'} style={styles.taskImg} source={{uri: fullUrl}} />
				</TouchableOpacity >
			)
		}

		return toReturn;
	}

	const styles = StyleSheet.create({
		scrollView: {
			flex: 1,
			backgroundColor: 'white',
			padding: 30,
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		taskImg: {
			width: width / 2.4,
			height: (width / 2) * 1.5,
			resizeMode: 'center',
			borderWidth: 1,
			borderColor: 'lightgray',
			marginBottom: 10,
		}
	})

	return (
		<>
			<ScrollView >
				<View style={[styles.scrollView]} >
					<AllTasks />
				</View >
			</ScrollView >
		</>
	);
};

export default ImageDemo
