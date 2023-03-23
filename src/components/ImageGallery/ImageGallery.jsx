import { GalleryList } from "./ImageGallery.styled";

export function ImageGallery({children}) {
	return (
			<GalleryList className="gallery">
				{children}
			</GalleryList>
	);
}