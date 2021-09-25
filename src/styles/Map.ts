import styled, { css } from "styled-components";

export const MapContainerWrapper = styled.div`
    display: flex;
    flex-flow: column;
    width: 80%;
    height: 60vh;
    justify-content: center;

    hr { 
        margin: 20px;
        background: #ffffff45;
    }

    .transition-enter {
        opacity: 0.01;
        transform: translate(0, -10px);
      }
      .transition-enter-active {
        opacity: 1;
        transform: translate(0, 0);
        transition: all 300ms ease-in;
      }
      .transition-exit {
        opacity: 1;
        transform: translate(0, 0);
      }
      .transition-exit-active {
        opacity: 0.01;
        transform: translate(0, 10px);
        transition: all 300ms ease-in;
      }
`;

export const MapContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

export const AddNewPoint = styled.button`
    position: absolute;
    color: transparent;
    background: transparent;
    bottom: 10px;
    right: 10px;

    button {
        &:focus {
            outline: none;
        }
        max-width: 45px;
        max-height: 45px;
    }
`;

interface EditContainerProps {
    isVisible: boolean;
}

export const EditContainer = styled.div<EditContainerProps>`
    ${({ isVisible }) => isVisible ? css`opacity: 1;display: flex;` : css`display: none; opacity: 0;`}
    margin-top: 25px;
    padding: 10px;
    
    flex-flow: row;

    input {
        text-align: center;
        color: white;
    }
    
    label {
        color: white;
    }

    svg {
        cursor: pointer;
        color: white;
    }

    margin: 0 15%;

    fieldset {
        display: none;
    }

    .MuiSelect-outlined {
        color: white !important;
    }

    transition: opacity 0.5s ease;
`;