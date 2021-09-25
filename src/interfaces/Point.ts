export interface Pit {
    _id: string;
    coords: [number, number];
    description: string;
    images: string[];
    category: number;
}

export interface MapState {
    center: [number, number],
    zoom: number,
}