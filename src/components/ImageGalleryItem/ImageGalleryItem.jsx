import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { Modal } from 'components/Modal/Modal';
import { getImages } from 'services/pixabayApi';
import { ImageItem } from './ImageGalleryItem.styled';

export function ImageGalleryItem({ searchValue, getStatus, page }) {
    const [images, setImages] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalImgUrl, setModalImgUrl] = useState('');

    const getStatusRef = useRef(getStatus);
    const getCardsAndLoadStatus = getStatusRef.current;

    useEffect(() => {
        if (searchValue === '') {
            return;
        }

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
                    toast.error(
                        `За запитом '${searchValue}' не знайдено картинок!`
                    );
                    setImages(null);

                    getCardsAndLoadStatus(false, false);
                    return;
                }

                const images = hits.reduce(
                    (acc, { id, webformatURL, largeImageURL }) => {
                        const image = {
                            id,
                            webformatURL,
                            largeImageURL,
                        };
                        return [...acc, image];
                    },
                    []
                );

                setImages(images);

                getCardsAndLoadStatus(true, false);
            })
            .catch(error => {
                console.log(error);
            });
    }, [getCardsAndLoadStatus, searchValue]);

    useEffect(() => {
        if (page !== 1) {
            getCardsAndLoadStatus(false, true);

            getImages(searchValue, page)
                .then(res => res.json())
                .then(({ hits }) => {
                    const imagesData = hits.reduce(
                        (acc, { id, webformatURL, largeImageURL }) => {
                            const image = {
                                id,
                                webformatURL,
                                largeImageURL,
                            };
                            return [...acc, image];
                        },
                        []
                    );

                    setImages(prevImages => {
                        return [...prevImages, ...imagesData];
                    });

                    getCardsAndLoadStatus(true, false);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [getCardsAndLoadStatus, page, searchValue]);

    useLayoutEffect(() => {
        if (images?.length > 12) {
            document.body.scrollIntoView({
                block: 'end',
                behavior: 'smooth',
            });
        }
    }, [images, images?.length]);

    function handleImgClick(e) {
        const currentId = +e?.target?.id;

        if (e?.target?.id === 'largeImg') {
            return;
        }

        if (currentId) {
            takeModalUrl(currentId);
        }

        setModal(prevModal => {
            return !prevModal;
        });
    }

    function takeModalUrl(id) {
        const modalImg = images.find(img => {
            return img.id === id;
        });

        setModalImgUrl(modalImg.largeImageURL);
    }

    return (
        <>
            {images &&
                images.map(({ id, webformatURL }) => {
                    return (
                        <ImageItem key={id} className="gallery-item">
                            <img
                                id={id}
                                src={webformatURL}
                                alt={searchValue}
                                onClick={handleImgClick}
                            />
                        </ImageItem>
                    );
                })}

            {modal && (
                <Modal
                    url={modalImgUrl}
                    alt={searchValue}
                    onClick={handleImgClick}
                />
            )}
        </>
    );
}

ImageGalleryItem.propTypes = {
    searchValue: PropTypes.string.isRequired,
    getStatus: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
};
