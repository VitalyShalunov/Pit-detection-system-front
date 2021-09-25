const NotificationType = ['success', 'info', 'error']

export const getBorderColor = (type: string) => {
    switch (type) {
        case 'error':
            return 'rgb(235, 87, 87);';
        case 'success':
            return 'rgb(39, 174, 96);';
        case 'info':
            return 'rgb(86, 204, 242);';
        default:
            return 'rgb(235, 87, 87);';
    }
};

export const getBackgroundColor = (type: string) => {
    switch (type) {
        case 'error':
            return 'rgb(247, 215, 215);';
        case 'success':
            return 'rgb(215, 247, 228);';
        case 'info':
            return 'rgb(229, 249, 255);';
        default:
            return 'rgb(247, 215, 215);';
    }
};

export const getTextColor = (type: string) => {
    switch (type) {
        case 'error':
            return 'rgb(140, 0, 0);';
        case 'success':
            return 'rgb(0, 90, 38);';
        case 'info':
            return 'rgb(0, 56, 87);';
        default:
            return 'rgb(140, 0, 0);';
    }
};

const stylesForNotificationToasts = NotificationType.map((toastTheme) => {
    const bgColor = getBackgroundColor(toastTheme);
    const brColor = getBorderColor(toastTheme);
    const fnColor = getTextColor(toastTheme);

    return `
        .Toastify__toast.Toastify__toast--${toastTheme} {
            min-height: auto;
            border: 1px solid ${brColor};
            background-color: ${bgColor};
            cursor: default;
        
            &:before {
                content: '';
                width: 16px;
                height: 16px;
                position: absolute;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
                background-size: 100%;
                background-repeat: no-repeat;
                background-position: center;
            }
        
            div.Toastify__toast-body {
                padding-left: 30px;
                font-size: 12px;
                color: ${fnColor};
            }
        
            button.Toastify__close-button {
                color: ${fnColor};
            }
        }
    `;
});

export default stylesForNotificationToasts;
