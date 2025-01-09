import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {Share} from "react-native";

export const shareImage = async (base64String: string) => {
	await Share.share({
		url: `data:image/png;base64,${base64String}`
	});
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
