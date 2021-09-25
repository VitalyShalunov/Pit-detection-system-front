import React, { FC, useEffect, useState } from 'react';
import './App.css';
import Loader from './components/Loader/Loader';
import MapWithAMarker from './components/Map/Map';

const App: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                {isLoading && <Loader />}
                {!isLoading && <MapWithAMarker />}
            </header>
        </div>
    );
}

export default App;
