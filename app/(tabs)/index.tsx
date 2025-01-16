import {
	Button,
	Image, ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View
} from "react-native";
import {router} from "expo-router";
import {getFiles, useTaskImages} from "@/hooks/useTaskImages";
import React, {useEffect, useState} from "react";

const ImageDemo = () => {
	const [internalLoading, setInternalLoading] = useState(true);
	const [existingFiles, setExistingFiles] = useState<string[]>();
	useEffect(() => {
		getFiles().then(r=>{
			const files = r.filter((file)=>{
				const fileName = file.split('/').pop() || "";
				const [name, extension] = fileName.split('.');
				return parseInt(name).toString() === name && extension === 'png';
			});
			setExistingFiles(files);
			setInternalLoading(false);
		})
	}, []);
	
	const {width} = useWindowDimensions();
	const {
		images,
		isLoading,
		refreshImages,
	} = useTaskImages();
	
	const [displayImages, setDisplayImages] = useState<any>([])

	useEffect(() => {
		if (images.length || internalLoading) return;
		if(existingFiles?.length){
			setDisplayImages(existingFiles);
		} else {
			refreshImages().then(r => setDisplayImages(images));
		}
	}, [images, internalLoading]);

	if (isLoading || !images) return (
		<Text >IS LOADING</Text >
	);

	const AllTasks = () => {
		let toReturn = [];
		for (let i = 0; i < displayImages.length; i++) {
			const fullUrl = typeof displayImages[i] === 'string' ? displayImages[i] : displayImages[i].full_url;
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
	if(internalLoading || isLoading){
		return (<Text>Loading</Text>);
	}
	
	return (
		<>
			<ScrollView >
				<View style={[styles.scrollView]} >
					<AllTasks />
					<Button title={"Refresh images"}></Button>
				</View >
			</ScrollView >
		</>
	);
};

export default ImageDemo
