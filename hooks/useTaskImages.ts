import {useState, useCallback} from 'react';
import {TaskImagesResponseType, TaskImageType, UseTaskImagesReturnType} from "@/types/images";
import {Image} from "react-native";

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
							await Image.prefetch(image.full_url);
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
	}, []);

	return {
		images,
		isLoading,
		error,
		refreshImages
	};
};
