import React, { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { Pit } from "../../interfaces/Point";
import { ImagesBlock, SelectedPointContaciner, UploadedImage } from "../../styles/SelectedPointBlock";
import toBase64 from "../../utils/toBase64";
import DragAndDrop from "../UploadFile/DragAndDrop";
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import ClearIcon from '@mui/icons-material/Clear';

interface SelectedPointProps {
    images: string[],
    isChange: boolean,
    changeAddImgSelectedPoint: (imgs: string[]) => void;
    deleteImage: (idx: number) => void;
    hideSelectedPoint: () => void;
}

let skipScrollHandle = false;
let countImages = 0;
let selectedImg = 0;
let selectedIdx = 0;

const SelectedPoint: FC<SelectedPointProps> = ({
    images,
    isChange,
    changeAddImgSelectedPoint,
    deleteImage,
    hideSelectedPoint,
}) => {
    console.log('selectedImg', selectedImg);
    console.log('images', images.length);
    countImages = images.length;
    
    const [selectedPitIdx, setSelectedPitIdx] = useState<number>(0);
    // const [files, setFiles] = useState
    const myRef = React.createRef<HTMLImageElement>();


    const handleDrop = async (files: FileList) => {
        const promises = [];
        for (var i = 0; i < files.length; i++) {
            if (!files[i].name) return;
            promises.push(toBase64(files[i]));
        }
        const convertedImages: string[] = await Promise.all(promises);

        const currentImageIdx = countImages + convertedImages.length - 1;
        selectedImg = currentImageIdx;
        setSelectedPitIdx(currentImageIdx);
        changeAddImgSelectedPoint(convertedImages);
    }

    const onWheel = (e: any) => {
        e = e || window.event;

        // wheelDelta не даёт возможность узнать количество пикселей
        var delta = e.deltaY || e.detail || e.wheelDelta;

        if (!skipScrollHandle) {
            skipScrollHandle = true;
            const currentImageIdx = selectedImg;
            let setIdx = 0;
            if (delta > 0) {
                setIdx = currentImageIdx + 1 === countImages ? 0 : currentImageIdx + 1;
            } else {
                setIdx = currentImageIdx - 1 === -1 ? countImages - 1 : currentImageIdx - 1;
            }
            selectedImg = setIdx;
            setSelectedPitIdx(setIdx);

            
            setTimeout(() => {
                skipScrollHandle = false;
            }, 500);
        }

        myRef?.current?.removeEventListener("wheel", onWheel)

        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

    const handleHideSelectedPoint = () => {
        hideSelectedPoint();
    };

    const deleteImg = () => {
        if (typeof selectedPitIdx === 'number') {
            deleteImage(selectedImg);

            if (countImages - 1 === 0) {
                selectedImg = 0;
                setSelectedPitIdx(0);
            } else {
                if (selectedImg === 0) {
                    selectedImg = countImages - 2;
                    setSelectedPitIdx(countImages - 2);
                } else {
                    selectedImg = selectedImg - 1;
                    setSelectedPitIdx(countImages - 1);
                }
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            let img = myRef.current

            if (img) {
                img.addEventListener("wheel", onWheel);
            }
        }, 300);
    }, [selectedPitIdx, images, images.length, myRef]);

    useEffect(() => {
        selectedImg = 0;
        setSelectedPitIdx(0);
    }, [isChange]);
    return (
        <>
            {<DragAndDrop handleDropProps={handleDrop} styles={{ marginLeft: '25px' }} >

                {Boolean(images?.length) && <ImagesBlock>
                    {selectedImg !== null &&
                        <>
                            <UploadedImage
                                ref={myRef}
                                src={images[selectedImg ?? 0]}
                            />

                            <ClearIcon fontSize="medium" style={{ cursor: 'pointer ' }} onClick={deleteImg} />
                        </>
                    }
                </ ImagesBlock>}

                {!images.length &&
                    <SelectedPointContaciner start={true}>Upload images</SelectedPointContaciner>
                }

                <UnfoldLessIcon onClick={handleHideSelectedPoint} style={{ cursor: 'pointer ' }} />
            </DragAndDrop>
            }

        </>
    )
}

// const areEqual = (prevState: SelectedPointProps, nextState: SelectedPointProps) => {
//     const { point: prevPoint, selectedPitIdx: prevSelectedPitIdx } = prevState;
//     const { point: nextPoint, selectedPitIdx: nextSelectedPitIdx } = nextState;

//     countImages = nextPoint?.images?.length ?? 0;
//     selectedImg = nextPoint?.selectedImg ?? 0;
//     selectedIdx = nextSelectedPitIdx;

//     if (!prevPoint || !nextPoint) {
//         return false;
//     }

//     if (!prevPoint !== !nextPoint) {
//         return false;
//     }

//     if (!prevSelectedPitIdx !== !nextSelectedPitIdx) {
//         return false;
//     }

//     const { images: prevImages, selectedImg: prevSelectedImg, _id: prevId } = prevPoint;
//     const { images: nextImages, selectedImg: nextSelectedImg, _id: nextId } = nextPoint;

//     if (prevId !== nextId) {
//         return false;
//     }

//     if (prevImages?.length !== nextImages?.length) {
//         return false;
//     }

//     if (prevSelectedImg !== nextSelectedImg) {
//         return false;
//     }

//     return true;
// }

// export default memo(SelectedPoint, areEqual);
export default SelectedPoint;