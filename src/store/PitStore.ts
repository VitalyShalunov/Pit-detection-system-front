import { Pit } from '../interfaces/Point';
import { deleteFunctionApi, fetchFunctionApi, patchFunctionApi, postFunctionApi } from '../requests/fetchFunction';

export class PitStore {
    public static async loadPits() {
        try {
            const pits = await fetchFunctionApi<Pit[]>('/pits');
            console.log(pits);
            
            if (pits && Array.isArray(pits)) {
                return pits;
            } else {
                console.error('Could not get pits from the response payload.');
                return [];
            }
        } catch (error) {
            console.error('Unexpected error has occurred when loading pits.', error);
            
            return [];
        }
    }

    public static editPit = async (id: string, editedPit: Pit) => {
        if (editedPit) {
            try {
                delete (editedPit as any).id;
                const answer = await patchFunctionApi<any>(`/pits/${id}`, editedPit);
                if (answer.status === 204) {
                    return true;
                }
            } catch (error) {
                console.error('Unexpected error has occurred when editing client.', error);
                return false;
            }
        }
    }

    public static createPit = async (pit: Omit<Pit, '_id'>) => {
        try {
            if ((pit as any)._id) {
                delete (pit as any)._id;
            }
            const createdPit = await postFunctionApi<Pit>(`/pits`, pit);
            if (createdPit) {
                return createdPit._id;
            }
        } catch (error) {
            console.error('Unexpected error has occurred when editing client.', error);
            return false;
        }
    }

    public static deletePit = async (id: string) => {
        if (id) {
            try {
                const answer = await deleteFunctionApi<any>(`/pits/${id}`);
                if (answer.status === 204) {
                    return true;
                }
            } catch (error) {
                console.error('Unexpected error has occurred when deleting client.', error);
                return false;
            }
        }
    }
}

