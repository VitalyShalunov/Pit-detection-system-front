import React, { FC, useEffect, useState } from 'react'

type DragAndDropProps = {
    handleDropProps: (files: FileList) => void;
    styles?: any;
    children: React.ReactNode;
}

const DragAndDrop: FC<DragAndDropProps> = ({ styles = {}, handleDropProps, children }) => {
    let dragCounter = 0;

    const [drag, setDrag] = useState<boolean>(false);

    const dropRef = React.createRef<HTMLDivElement>();

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('handleDrag');
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('handleDragIn');
        e.preventDefault();
        e.stopPropagation();
        dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDrag(true);
        }
    };

    const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('handleDragOut');
        e.preventDefault();
        e.stopPropagation();
        dragCounter--;
        if (dragCounter === 0) {
            setDrag(false);
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        console.log('handleDrop');
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleDropProps(e.dataTransfer.files);
            e.dataTransfer.clearData();
            dragCounter = 0;
        }
    }

    useEffect(() => {
        let div = dropRef.current
        
        if (div) {
            div.addEventListener('dragenter', (e: Event) => { handleDragIn(e as any); });
            div.addEventListener('dragleave', (e: Event) => { handleDragOut(e as any); });
            div.addEventListener('dragover', (e: Event) => { handleDrag(e as any); });
            div.addEventListener('drop', (e: Event) => { handleDrop(e as any); });
        }
    }, []);

    useEffect(() => {
        return () => {
            let div = dropRef.current
            if (div) {
                div.removeEventListener('dragenter', (e: Event) => { handleDragIn(e as any); })
                div.removeEventListener('dragleave', (e: Event) => { handleDragOut(e as any); })
                div.removeEventListener('dragover', (e: Event) => { handleDrag(e as any); })
                div.removeEventListener('drop', (e: Event) => { handleDrop(e as any); })
            }
        }
    }, [])

    return (
        <div
            style={{ ...styles, display: 'flex', position: 'relative', width: '100%', }}
            ref={dropRef}
        >
            {drag &&
                <div
                    style={{
                        border: '4px dashed #689ae3',
                        backgroundColor: 'rgb(255 255 255 / 24%)',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: 0,
                            left: 0,
                            textAlign: 'center',
                            color: 'grey',
                            fontSize: 36
                        }}
                    />
                </div>
            }
            {children}
        </div>
    );
}
export default DragAndDrop