import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark, Clusterer } from 'react-yandex-maps';

import { AddNewPoint, MapContainer, MapContainerWrapper } from '../../styles/Map';
import { Divider, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import POINTS from "./points";
import SelectedPoint from './SelectedPoint';
import { CreateNewTip } from '../CreateNewTip';
import { EditTip } from './EditBlock';
import { MapState, Pit } from '../../interfaces/Point';
import { PitStore } from '../../store/PitStore';
import { useAsyncEffect } from '../../utils/useAsyncEffect';

const YandexMap = () => {
    const [selectedPoint, setSelectedPoint] = useState<Pit | null>(null);

    const [isCreatePitOpen, setIsCreatePitOpen] = useState<boolean>(false);

    const [mapState, setMapState] = useState<MapState>({
        center: [55.751574, 37.573856],
        zoom: 5,
    });

    const [pits, setPits] = useState<Pit[]>([]);

    const onPlacemarkClick = (point: any) => () => {
        setSelectedPoint(point);
    };

    const myFunc = (x: any) => {
        console.log("click", x);
    };

    const closeCreateSitPopup = () => setIsCreatePitOpen(false);

    const onCreatePit = async (pit: Omit<Pit, '_id'>) => {
        let answ = await PitStore.createPit(pit);

        const currPits = pits;
        (pit as any) = { ...pit, _id: answ };
        currPits.push(pit as any);
        setPits([...currPits]);
        closeCreateSitPopup()
    }

    const onEditPit = async (pit: Omit<Pit, 'images'>) => {
        if (selectedPoint) {
            let answ = await PitStore.editPit(pit._id, { ...pit, images: selectedPoint.images });
            
            const currPits = pits;
            const idx = currPits.findIndex(({ _id }) => _id === selectedPoint._id);

            (pit as any) = { ...pit, _id: answ };

            currPits.splice(idx, 1, pit as any);
            setPits([...currPits]);
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

    const onDragEnd = (coords: [number, number]) => {
        if (selectedPoint) {
            const idx = pits.findIndex(({ _id }) => _id === selectedPoint._id);
            const currPoint = { ...selectedPoint, coords };
    
            pits.splice(idx, 1, currPoint as any);
            setPits([...pits]);
            setSelectedPoint({ ...currPoint })
        }
    }

    const onDeleteImage = (currentImageIdx: number) => {
        if (selectedPoint) {
            const images = selectedPoint.images;
            images.splice(currentImageIdx, 1);

            setSelectedPoint({ ...selectedPoint, images })
        }
    }

    const addNewPoint = (event: any) => {
        const coords = event.get("coords");
        const currPits = pits;

        const newPit = {
            _id: '0',
            coords,
            images: [],
            description: '',
            category: 1,
        };
        currPits.push(newPit);
        setPits([...currPits]);

        setSelectedPoint(newPit);
    }

    const deletePit = async (id: string) => {
        const idx = pits.findIndex(({ _id }) => _id === id);

        pits.splice(idx, 1);
        setPits([...pits]);
        setSelectedPoint(null);
        if (id !== '0') {
            await PitStore.deletePit(id);
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
                                    onClick={onPlacemarkClick(point)}
                                    // onDragEnd={(e: any) => console.log(e.get('target').geometry.getCoordinates())}
                                    onDragEnd={(e: any) => onDragEnd(e.get('target').geometry.getCoordinates())}
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

                <SelectedPoint
                    deleteImage={onDeleteImage}
                    update={(images) => setSelectedPoint({ ...selectedPoint!, images })}
                    point={selectedPoint}
                    hideSelectedPoint={() => setSelectedPoint(null)}
                />

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
                            onCreatePit(pit as any);
                        }
                    }}
                    onDelete={deletePit}
                    onEditCategoryPit={onEditCategoryPit}
                />}
        </MapContainerWrapper>
    );
}

export default (YandexMap);