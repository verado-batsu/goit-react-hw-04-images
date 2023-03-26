import PropTypes from 'prop-types';
import { useState } from 'react';

import { Modal } from 'components/Modal/Modal';

import { GalleryList } from './ImageGallery.styled';

export function ImageGallery({ searchValue, images }) {
    const [modal, setModal] = useState(false);
    const [modalImgUrl, setModalImgUrl] = useState('');

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
        <GalleryList className="gallery">
            {images &&
                images.map(({ id, webformatURL }) => {
                    return (
                        <li key={id} className="gallery-item">
                            <img
                                id={id}
                                src={webformatURL}
                                alt={searchValue}
                                onClick={handleImgClick}
                            />
                        </li>
                    );
                })}

            {modal && (
                <Modal
                    url={modalImgUrl}
                    alt={searchValue}
                    onClick={handleImgClick}
                />
            )}
        </GalleryList>
    );
}

ImageGallery.propTypes = {
    searchValue: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.object),
};
