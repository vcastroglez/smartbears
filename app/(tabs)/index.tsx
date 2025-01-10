import {useImage} from "@shopify/react-native-skia";
import {
	Animated,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View
} from "react-native";
import {router} from "expo-router";
import {ALL_IMAGES} from "@/hooks/useDownloadBase64";

const ImageDemo = () => {
	const {width} = useWindowDimensions();

	const AllTasks = () => {
		let toReturn = [];
		for (let i = 0; i < ALL_IMAGES.length; i++) {
			toReturn.push(
				<TouchableOpacity key={i} onPress={() => router.push({pathname: "/draw", params: {task: i}})} >
					<Image resizeMethod={'auto'} style={styles.taskImg} source={ALL_IMAGES[i]} />
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
			<Text >All tasks:</Text >
			<View style={[styles.scrollView, StyleSheet.absoluteFill]} >
				<AllTasks />
			</View >
		</>
	);
};

export default ImageDemo
