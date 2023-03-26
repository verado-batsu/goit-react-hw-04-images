import { useEffect, useLayoutEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Triangle } from 'react-loader-spinner';
import { toast } from 'react-toastify';

import { Container } from './App.styled';

import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';

import { getImages } from 'services/pixabayApi';

export function App() {
    const [images, setImages] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isRepeatSearch, setIsRepeatSearch] = useState(false);

    useEffect(() => {
        if (searchValue === '') return;
        if (isRepeatSearch) return;

        setLoading(true);
        getImages(searchValue, page)
            .then(res => res.json())
            .then(({ hits }) => {
                if (hits.length === 0) {
                    toast.error(
                        `За запитом '${searchValue}' не знайдено картинок!`
                    );
                    setImages([]);
                    setLoading(false);
                    return;
                }

                const images = hits.map(
                    ({ id, webformatURL, largeImageURL }) => ({
                        id,
                        webformatURL,
                        largeImageURL,
                    })
                );

                if (page === 1) {
                    document.body.scrollIntoView({
                        block: 'start',
                        behavior: 'smooth',
                    });
                    setImages(images);
                } else {
                    setImages(prevImages => {
                        return [...prevImages, ...images];
                    });
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    }, [searchValue, page, isRepeatSearch]);

    useLayoutEffect(() => {
        if (images.length > 12) {
            document.body.scrollIntoView({
                block: 'end',
                behavior: 'smooth',
            });
        }
    }, [images]);

    function getSearchValue(value) {
        setSearchValue(prevSearchValue => {
            if (prevSearchValue === value) {
                setIsRepeatSearch(true);
            } else {
                setIsRepeatSearch(false);
            }
            return value;
        });
        setPage(1);
    }

    function loadMoreClick(e) {
        setPage(prevPage => {
            return prevPage + 1;
        });
    }

    return (
        <Container>
            <ToastContainer autoClose={3000} />

            <Searchbar onSubmit={getSearchValue} />
            <ImageGallery searchValue={searchValue} images={images} />

            <Triangle
                height="60"
                width="60"
                color="#4fa94d"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={loading}
            />

            {images.length > 0 && <Button onClick={loadMoreClick} />}
        </Container>
    );
}
