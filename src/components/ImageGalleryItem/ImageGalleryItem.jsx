import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { Modal } from 'components/Modal/Modal';
import { getImages } from 'services/pixabayApi';
import { ImageItem } from './ImageGalleryItem.styled';

export function ImageGalleryItem({ searchValue, getCardsAndLoadStatus, page }) {
    const [images, setImages] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalImgUrl, setModalImgUrl] = useState('');

    let isFirstUpdate = useRef(true);

    useEffect(() => {
        if (isFirstUpdate.current) {
            isFirstUpdate.current = false;
            return;
        }

        if (searchValue !== '') {
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    useEffect(() => {
        if (isFirstUpdate.current) {
            isFirstUpdate.current = false;
            return;
        }

        if (page !== 1 && images !== null) {
            getCardsAndLoadStatus(false, true);

            getImages(searchValue, page)
                .then(res => res.json())
                .then(({ hits }) => {
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

                    setImages(prevImages => {
                        return [...prevImages, ...images];
                    });

                    getCardsAndLoadStatus(true, false);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchValue]);

    useEffect(() => {
        if (isFirstUpdate.current) {
            isFirstUpdate.current = false;
            return;
        }

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
    getCardsAndLoadStatus: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
};
