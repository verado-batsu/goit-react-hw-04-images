import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Triangle } from 'react-loader-spinner';

import { Container } from './App.styled';

import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Button } from 'components/Button/Button';

export function App() {
    const [searchValue, setSearchValue] = useState('');
    const [cards, setCards] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    function getSearchValue(value) {
        setSearchValue(value);
        setPage(1);
    }

    function getCardsAndLoadStatus(newCards, loadingStatus) {
        setCards(newCards);
        setLoading(loadingStatus);
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
            <ImageGallery>
                <ImageGalleryItem
                    searchValue={searchValue}
                    getStatus={getCardsAndLoadStatus}
                    page={page}
                />
            </ImageGallery>

            <Triangle
                height="60"
                width="60"
                color="#4fa94d"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={loading}
            />

            {cards && <Button onClick={loadMoreClick} />}
        </Container>
    );
}
