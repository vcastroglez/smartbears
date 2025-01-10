import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {Share} from "react-native";

export const shareImage = async (base64String: string) => {
	await Share.share({
		url: `data:image/png;base64,${base64String}`
	});
}
export const ALL_IMAGES = [
	require('@/assets/images/tasks/1.png'),
	require('@/assets/images/tasks/2.png'),
	require('@/assets/images/tasks/3.png'),
	require('@/assets/images/tasks/4.png'),
	require('@/assets/images/tasks/5.png'),
	require('@/assets/images/tasks/6.png'),
	require('@/assets/images/tasks/7.png'),
	require('@/assets/images/tasks/8.png'),
	require('@/assets/images/tasks/9.png'),
	require('@/assets/images/tasks/10.png'),
	require('@/assets/images/tasks/11.png'),
	require('@/assets/images/tasks/12.png'),
	require('@/assets/images/tasks/13.png'),
	require('@/assets/images/tasks/14.png'),
]

export const getTaskImage = (index: any) => {


	return ALL_IMAGES[index] ?? ALL_IMAGES[0]
}
export const downloadBase64 = async (base64String: string) => {
	try {
		// Request permissions
		const {status} = await MediaLibrary.requestPermissionsAsync();
		if (status !== 'granted') {
			throw new Error('Permission denied');
		}

		// Create file path
		const filepath = `${FileSystem.documentDirectory}image.png`;

		// Write base64 to file
		await FileSystem.writeAsStringAsync(filepath, base64String, {
			encoding: FileSystem.EncodingType.Base64,
		});

		// Save to gallery
		const asset = await MediaLibrary.createAssetAsync(filepath);

		// Clean up
		await FileSystem.deleteAsync(filepath);

		return asset;
	} catch (error) {
		console.error('Failed to save image:', error);
		throw error;
	}
};
