import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { SearchWrapper } from './Searchbar.styled';

export function Searchbar({ onSubmit }) {
    const [searchValue, setSearchValue] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const correctSearchValue = searchValue.trim().toLowerCase();

        if (correctSearchValue === '') {
            toast.error('Введіть якесь значення в пошук.');
            return;
        }

        onSubmit(correctSearchValue);

        setSearchValue('');
    }

    return (
        <SearchWrapper>
            <form className="form" onSubmit={handleSubmit}>
                <button type="submit" className="button">
                    <AiOutlineSearch className="button-label" />
                </button>

                <input
                    className="input"
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    onChange={e => {
                        setSearchValue(e.target.value);
                    }}
                    value={searchValue}
                />
            </form>
        </SearchWrapper>
    );
}

Searchbar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};
