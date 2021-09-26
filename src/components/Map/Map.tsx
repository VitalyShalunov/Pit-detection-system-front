import React, { FC, useEffect, useState } from 'react';
import { YMaps, Map, Placemark, Clusterer } from 'react-yandex-maps';

import { AddNewPoint, MapContainer, MapContainerWrapper } from '../../styles/Map';
import { Alert, Divider, Fab, Snackbar, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import POINTS from "./points";
import SelectedPoint from './SelectedPoint';
import { CreateNewTip } from '../CreateNewTip';
import { EditTip } from './EditBlock';
import { MapState, Notify, Pit } from '../../interfaces/Point';
import { PitStore } from '../../store/PitStore';
import { useAsyncEffect } from '../../utils/useAsyncEffect';

let images: string[] = [];

const YandexMap: FC<any> = () => {
    const [selectedPoint, setSelectedPoint] = useState<Pit | null>(null);
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [isChange, setIsChange] = useState<boolean>(false);

    const [isCreatePitOpen, setIsCreatePitOpen] = useState<boolean>(false);

    const [mapState, setMapState] = useState<MapState>({
        center: [55.751574, 37.573856],
        zoom: 5,
    });

    const [pits, setPits] = useState<Pit[]>([]);

    const [notify, setNotify] = useState<Notify>({
        msg: '',
        type: 'success',
        isShow: false,
    });

    const onPlacemarkClick = (point: Pit, index: number) => () => {
        console.log('prev', selectedPoint?._id);
        
        console.log('next', { ...point }._id);
        console.log('images', images);
        setIsChange(!isChange);
        setCurrentImages([...point.images]);
        setSelectedPoint({ ...point });
    };

    const myFunc = (x: any) => {
        console.log("click", x);
    };

    const closeCreateSitPopup = () => setIsCreatePitOpen(false);

    const onCreatePit = async (pit: Omit<Pit, '_id'>, markerIsCreated?: boolean) => {
        let answ = await PitStore.createPit(pit);
        if (answ) {
            const currPits = pits;

            (pit as any) = { ...pit, _id: answ, images: markerIsCreated ? currentImages : pit.images };

            if (markerIsCreated) {
                const idx = currPits.findIndex(({ coords }) => (
                    coords[0] === selectedPoint?.coords[0] && coords[1] === selectedPoint?.coords[1])
                );

                currPits.splice(idx, 1, (pit as any));
                setPits([...currPits]);
            } else {
                currPits.push(pit as any);
                setPits([...currPits]);
                closeCreateSitPopup()
            }
            setSelectedPoint({ ...pit } as any);
            showNotify('success', 'Pit was added');
        } else {
            showNotify('error', 'Pit wasn\'t added');
        }
    }

    const onEditPit = async (pit: Omit<Pit, 'images'>) => {
        if (selectedPoint) {
            let answ = await PitStore.editPit(pit._id, { ...pit, images: currentImages });
            if (answ) {
                const currPits = pits;
                const idx = currPits.findIndex(({ _id }) => _id === selectedPoint._id);

                currPits.splice(idx, 1, { ...pit, images: currentImages } as any);
                setPits([...currPits]);

                showNotify('success', 'Pit was updated');
            } else {
                showNotify('error', 'Pit wasn\'t updated');
            }
        }
    }

    const onEditCategoryPit = (newCategory: number) => {
        if (selectedPoint) {
            const currPits = pits;
            const idx = currPits.findIndex(({ _id }) => _id === selectedPoint._id);

            const pit = { ...selectedPoint, category: newCategory };

            currPits.splice(idx, 1, pit as any);
            setSelectedPoint({ ...pit });
            setPits([...currPits]);
        }
    }

    const onDragEnd = (coords: [number, number], index: number) => {
        if (selectedPoint) {
            const currPoint = { ...pits[index], coords };

            pits.splice(index, 1, currPoint as any);
            setPits([...pits]);
            setSelectedPoint({ ...currPoint });
            images = [];
            setCurrentImages([]);
        }
    }

    const onDeleteImage = (currentImageIdx: number) => {
        if (selectedPoint) {
            const cutArray = selectedPoint.images;
            cutArray.splice(currentImageIdx, 1);

            const newObj = { ...selectedPoint!, images: [...cutArray] };

            images = [...cutArray];
            console.log('currentImages', currentImages);
            console.log('images', images);
            setCurrentImages([...images]);
            setSelectedPoint({ ...newObj });
        }
    }

    const addNewPoint = (event: any) => {
        const coords = event.get("coords");
        const currPits = pits;

        const newPit: Pit = {
            _id: '0',
            coords,
            images: [],
            description: '',
            category: 1,
        };
        currPits.push(newPit);
        setPits([...currPits]);

        setSelectedPoint({ ...newPit });
    }

    const deletePit = async (id: string) => {
        const idx = pits.findIndex(({ _id }) => _id === id);

        pits.splice(idx, 1);
        setPits([...pits]);
        setSelectedPoint(null);
        if (id !== '0') {
            const answ = await PitStore.deletePit(id);

            if (answ) {
                showNotify('success', 'Pit was deleted');
            } else {
                showNotify('error', 'Pit wasn\'t deleted');
            }
        }
    }

    const getIconColor = (category: number) => {
        switch (category) {
            case 1:
                return '#68fc6f';
            case 2:
                return '#fab60a';
            case 3:
                return '#cc1d06';
            default:
                break;
        }
    }

    const showNotify = (type: 'success' | 'info' | 'error', msg: string) => {
        const not: Notify = {
            type,
            msg,
            isShow: true,
        }
        setNotify({ ...not });
    };

    const closeNotify = () => {
        const not: Notify = {
            type: 'success',
            msg: '',
            isShow: false,
        }
        setNotify({ ...not });
    }

    const changeAddImgSelectedPoint = (imgs: string[]) => {
        const imagesS = [ ...images, ...imgs ];
        const newObj = { ...selectedPoint!, images: [...images] };

        images = [...imagesS];
        console.log('currentImages', currentImages);
        console.log('images', images);
        setCurrentImages([...images]);
        setSelectedPoint({ ...newObj });
    }

    console.log(206, 'currentImages', currentImages);

    useAsyncEffect(async () => {
        const receivedPits = await PitStore.loadPits();
        setPits([...receivedPits])
    }, []);

    return (
        <MapContainerWrapper>
            <MapContainer>
                <YMaps query={{ lang: "ru_RU", load: "package.full" }}>
                    <Map
                        onClick={addNewPoint}
                        width={selectedPoint ? "90%" : "80%"}
                        height="100%"
                        defaultState={mapState}
                        modules={["control.ZoomControl", "control.FullscreenControl"]}
                    >
                        <Clusterer
                            options={{
                                preset: "islands#invertedVioletClusterIcons",
                                groupByCoordinates: false,
                                balloonPanelMaxMapArea: Infinity
                            }}
                        >
                            {pits.map((point, index) => (
                                <Placemark
                                    modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                                    key={index}
                                    geometry={point.coords}
                                    onClick={onPlacemarkClick(point, index)}
                                    // onDragEnd={(e: any) => console.log(e.get('target').geometry.getCoordinates())}
                                    onDragEnd={(e: any) => onDragEnd(e.get('target').geometry.getCoordinates(), index)}
                                    // onDragEnd={onDragEnd}
                                    properties={{
                                        item: index,
                                        balloonContentHeader: `Description`,
                                        balloonContentBody: `<div>${point.description}</div>`,
                                        // balloonContentFooter: `<input type="button" onclick="console.log('click'); boundGetX();"value="Remove"/>`
                                    }}
                                    options={{
                                        draggable: true,
                                        balloonPanelMaxMapArea: Infinity,
                                        iconColor: getIconColor(point.category), //'#ff0000'
                                    }}
                                />
                            ))}
                        </Clusterer>
                    </Map>
                </YMaps>

                {selectedPoint && <SelectedPoint
                    deleteImage={onDeleteImage}
                    isChange={isChange}
                    changeAddImgSelectedPoint={changeAddImgSelectedPoint}
                    images={currentImages}
                    hideSelectedPoint={() => setSelectedPoint(null)}
                />}

                <AddNewPoint>
                    <Tooltip
                        title="Add new pit"
                        aria-label="add"
                        onClick={() => setIsCreatePitOpen(true)}
                    >
                        <Fab color="secondary" >
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </AddNewPoint>

                <CreateNewTip
                    isOpen={isCreatePitOpen}
                    onClose={closeCreateSitPopup}
                    onCreate={onCreatePit}
                />
            </MapContainer>

            <Divider light />

            {selectedPoint &&
                <EditTip
                    tip={selectedPoint}
                    onEdit={(pit) => {
                        if (pit._id !== '0') {
                            onEditPit(pit)
                        } else {
                            onCreatePit(pit as any, true);
                        }
                    }}
                    onDelete={deletePit}
                    onEditCategoryPit={onEditCategoryPit}
                />}
            <Snackbar open={notify.isShow} autoHideDuration={3000} onClose={closeNotify} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={closeNotify} severity={notify.type} sx={{ width: '100%' }}>
                    {notify.msg}
                </Alert>
            </Snackbar>
        </MapContainerWrapper>
    );
}

export default (YandexMap);