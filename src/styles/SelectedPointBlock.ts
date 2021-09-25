import styled, { css } from 'styled-components';

interface SelectedPointContacinerProps {
    start: boolean;
}
export const SelectedPointContaciner = styled.div<SelectedPointContacinerProps>`
    display: flex;
    flex: auto;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-left: 25px;

    ${({ start }) => {
        if (start) {
            css`
            transform: translateY(0%);
            opacity: 1.0;
            `;
        } else {
            return css`
                transform: translateY(42%);
                opacity: 0.0;
            `;
        }
    }}
    transition: transform 1.0s ease, opacity 0.5s ease;
`;

export const ImagesBlock = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const UploadedImage = styled.img`
    max-width: 100%;
    max-height: 100%;
`;