import React, { FC, useEffect, useState } from "react";
import { Pit } from "../../interfaces/Point";
import { ImagesBlock, SelectedPointContaciner, UploadedImage } from "../../styles/SelectedPointBlock";
import toBase64 from "../../utils/toBase64";
import DragAndDrop from "../UploadFile/DragAndDrop";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import ClearIcon from '@mui/icons-material/Clear';

interface SelectedPointProps {
    point: Pit | null,
    update: (images: string[]) => void;
    deleteImage: (idx: number) => void;
    hideSelectedPoint: () => void;
}

let skipScrollHandle = false;
let currentImageIdx: number | null = null;

//create your forceUpdate hook
function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

const SelectedPoint: FC<SelectedPointProps> = ({ point, update, deleteImage, hideSelectedPoint }) => {
    const [images, setImages] = useState<string[]>(point?.images ?? []);
    const [start, setStart] = useState<boolean>(false);
    // const [files, setFiles] = useState
    const myRef = React.createRef<HTMLImageElement>();

    // call your hook here
    const forceUpdate = useForceUpdate();

    const handleDrop = async (files: FileList) => {
        const promises = [];
        for (var i = 0; i < files.length; i++) {
            if (!files[i].name) return;
            promises.push(toBase64(files[i]));
        }
        const convertedImages: string[] = await Promise.all(promises);

        const currFiles = point?.images ?? [];
        currFiles.push(...convertedImages);

        setImages([...currFiles]);
        update(currFiles);
        currentImageIdx = currFiles.length - 1;
        forceUpdate();
    }

    const onWheel = (e: any) => {
        e = e || window.event;

        // wheelDelta не даёт возможность узнать количество пикселей
        var delta = e.deltaY || e.detail || e.wheelDelta;

        if (!skipScrollHandle) {
            skipScrollHandle = true;

            if (currentImageIdx !== null) {
                let setIdx = 0;
                if (delta > 0) {
                    setIdx = currentImageIdx + 1 >= point!.images.length ? 0 : currentImageIdx + 1;
                } else {
                    setIdx = currentImageIdx - 1 === -1 ? point!.images.length - 1 : currentImageIdx - 1;
                }
                currentImageIdx = setIdx;
                
                // eslint-disable-next-line react-hooks/rules-of-hooks
                forceUpdate();
            }

            setTimeout(() => {
                skipScrollHandle = false;
            }, 500);
        }

        myRef?.current?.removeEventListener("wheel", onWheel)

        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

    const handleHideSelectedPoint = () => {
        setStart(false);
        hideSelectedPoint();
    };

    const deleteImg = () => {
        const currImages = images;
        if (typeof currentImageIdx === 'number') {
            currImages.splice(currentImageIdx!, 1);
            deleteImage(currentImageIdx!);

            setImages([...currImages]);
            if (currImages.length === 0) {
                currentImageIdx = null;
            } else {
                if (currentImageIdx === 0) {
                    currentImageIdx = currImages.length - 1;
                } else {
                    currentImageIdx = currentImageIdx! - 1;
                }
            }
        }
    }

    console.log('images', images.length);
    console.log('currentImageIdx', currentImageIdx);
    
    useEffect(() => {
        let img = myRef.current

        if (img) {
            img.addEventListener("wheel", onWheel);
        }
    }, [currentImageIdx]);

    useEffect(() => {
        if (point && !images.length) {
            setImages([...point.images]);

            if (!currentImageIdx) {
                currentImageIdx = 0;
            }
                        
            setTimeout(() => {
                setStart(true);
            }, 200);
        }
    }, [point])
    return (
        <>
            {point && <DragAndDrop handleDropProps={handleDrop} styles={{ marginLeft: '25px' }} >

                {Boolean(images.length) && <ImagesBlock>
                    {currentImageIdx !== null &&
                        <>
                            <UploadedImage
                                ref={myRef}
                                src={images[currentImageIdx]}
                            />

                            <ClearIcon fontSize="medium" style={{ cursor: 'pointer ' }} onClick={deleteImg} />
                        </>
                    }
                </ ImagesBlock>}

                {!images.length &&
                    <SelectedPointContaciner start={start} >Upload images</SelectedPointContaciner>
                }

                <UnfoldLessIcon onClick={handleHideSelectedPoint} style={{ cursor: 'pointer ' }} />
            </DragAndDrop>
            }

        </>
    )
}

export default SelectedPoint;