import {useState, useCallback} from 'react';
import {TaskImagesResponseType, TaskImageType, UseTaskImagesReturnType} from "@/types/images";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from 'expo-file-system';

const API_BASE_URL = 'https://vmi1481757.contaboserver.net';

export const useTaskImages = (): UseTaskImagesReturnType => {
	const [images, setImages] = useState<TaskImageType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const refreshImages = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`${API_BASE_URL}/api/tasks/images`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: TaskImagesResponseType = await response.json();

			if (data.status === 'success') {
				const imagesToPrefetch = data.images;
				setImages(imagesToPrefetch);
				await Promise.all(
					imagesToPrefetch.map(async (image) => {
						try {
							await handleDownload(image.full_url);
						} catch (err) {
							console.warn(`Failed to prefetch ${image.filename}:`, err);
						}
					})
				);
			} else {
				throw new Error('Failed to fetch images');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}

		return images;
	}, []);

	return {
		images,
		isLoading,
		error,
		refreshImages
	};
};

const handleDownload = async (uri: string) => {
	const name = uri.split('/')?.pop() || 'unknown.png';
	let fileUri = FileSystem.documentDirectory + name;
	try {
		const res = await FileSystem.downloadAsync(uri, fileUri)
		saveFile(res.uri)
	} catch (err) {
		console.log("FS Err: ", err)
	}
}

export const getFiles = async () => {
	const images = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory!);
	return images.map((image) => {
		return `${FileSystem.documentDirectory}${image}`;
	})
}

const saveFile = async (fileUri: string) => {
	const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
	if (permissionResponse?.status !== 'granted') {
		await requestPermission();
	}
	
		try {
			const asset = await MediaLibrary.createAssetAsync(fileUri);
			const album = await MediaLibrary.getAlbumAsync('Tasks');
			if (album == null) {
				await MediaLibrary.createAlbumAsync('Tasks', asset, false);
			} else {
				await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
			}
			console.log("Image saved to Tasks album");//vla
		} catch (err) {
			console.log("Save err: ", err)
		}
}
