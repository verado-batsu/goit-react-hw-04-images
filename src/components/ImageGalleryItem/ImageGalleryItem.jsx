import PropTypes from 'prop-types';
import { Component } from "react";
import { toast } from 'react-toastify';

import { Modal } from "components/Modal/Modal";
import { getImages } from "services/pixabayApi";
import { ImageItem } from "./ImageGalleryItem.styled";

export class ImageGalleryItem extends Component {
	state = {
		images: null,
		modal: false,
		modalImgUrl: '',
	}

	componentDidUpdate(prevProps, prevState) {
		const { searchValue, getCardsAndLoadStatus, page } = this.props;

		if (prevProps.searchValue !== searchValue) {
			getCardsAndLoadStatus(false, true);

			document.body.scrollIntoView({
				block: 'start',
				behavior: 'smooth',
			});

			getImages(searchValue)
				.then(res => {
					return res.json();
				})
				.then(({ hits }) => {
					if (hits.length === 0) {
						toast.error(`За запитом '${searchValue}' не знайдено картинок!`);
						this.setState({
							images: null,
						});

						getCardsAndLoadStatus(false, false);
						return;
					}

					const images = hits.reduce((acc, { id, webformatURL, largeImageURL }) => {
						const image = {
							id,
							webformatURL,
							largeImageURL,
						}
						return [...acc, image]
					}, [])
					
					// console.log('search ',images);

					this.setState({ images });

					getCardsAndLoadStatus(true, false);
				})
				.catch(error => {
					console.log(error);
				});
		}

		if (page !== 1 && prevProps.page !== page && this.state.images !== null) {
			getCardsAndLoadStatus(false, true);

			getImages(searchValue, page)
				.then(res => res.json())
				.then(({ hits }) => {
					const images = hits.reduce((acc, { id, webformatURL, largeImageURL }) => {
						const image = {
							id,
							webformatURL,
							largeImageURL,
						}
						return [...acc, image]
					}, [])

					// console.log('page ',images);

					this.setState(prevState => {
						return {
							images: [...prevState.images, ...images]
						}
					});

					getCardsAndLoadStatus(true, false);
				})
				.catch(error => {
					console.log(error)
				});
		}

		if (prevState?.images?.length !== this?.state?.images?.length && this?.state?.images?.length > 12) {
				document.body.scrollIntoView({
				block: 'end',
				behavior: 'smooth',
			})
		}
	}

	handleImgClick = (e) => {
		const currentId = +(e?.target?.id);

		if (e?.target?.id === 'largeImg') {	
			return;
		}

		if (currentId) {
			this.takeModalUrl(currentId);
		}

		this.setState(prevState => {
			return {
				modal: !prevState.modal,
			}
		})
	}


	takeModalUrl = (id) => {
		const modalImg = this.state.images.find(img => {
			return img.id === id
		});

		this.setState({
			modalImgUrl: modalImg.largeImageURL,
		})
	}

	render() {
		const { images, modal, modalImgUrl } = this.state;
		const { searchValue } = this.props;

		return (
			<>
				{images && (
						images.map(({ id, webformatURL}) => {
							return (
								<ImageItem key={id} className="gallery-item">
									<img
										id={id}
										src={webformatURL}
										alt={searchValue}
										onClick={this.handleImgClick}
									/>
								</ImageItem>
							)
						})
				)}

				{modal &&
					<Modal
						url={modalImgUrl}
						alt={searchValue}
						onClick={this.handleImgClick}
					/>
				}
			</>	
		)
	}
}

ImageGalleryItem.propTypes = {
	searchValue: PropTypes.string.isRequired,
	getCardsAndLoadStatus: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
}
