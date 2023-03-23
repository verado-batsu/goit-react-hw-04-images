import PropTypes from 'prop-types';

import { LoadMoreBtn } from './Button.styled';

export function Button({ onClick }) {
    return (
        <LoadMoreBtn>
            <button onClick={onClick}>Load more</button>
        </LoadMoreBtn>
    );
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
};
