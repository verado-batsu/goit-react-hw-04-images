import { useEffect } from 'react';
import { Overlay } from './Modal.styled';

export function Modal({ url, alt, onClick }) {
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.code === 'Escape') {
                onClick();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClick]);

    return (
        <div onClick={onClick}>
            <Overlay>
                <div className="modal">
                    <img id="largeImg" src={url} alt={alt} />
                </div>
            </Overlay>
        </div>
    );
}
