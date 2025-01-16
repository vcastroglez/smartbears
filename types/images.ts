import {SkPaint, SkPath} from "@shopify/react-native-skia";

export interface TaskImageType {
	filename: string;
	url: string;
	full_url: string;
	uploaded_at: number;
}

export interface TaskImagesResponseType {
	status: string;
	count: number;
	images: TaskImageType[];
}

export interface UseTaskImagesReturnType {
	images: TaskImageType[];
	isLoading: boolean;
	error: string | null;
	refreshImages: () => Promise<TaskImageType[]>;
}

export interface IPathType {
	path: SkPath;
	paint: SkPaint;
}
