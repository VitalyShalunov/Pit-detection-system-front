import { useEffect, DependencyList } from 'react';

type AsyncCallback = () => Promise<unknown>;

/**
 * @description аналог useEffect для асинхронных функций
 */
// eslint-disable-next-line import/prefer-default-export
export const useAsyncEffect = (asyncCallback: AsyncCallback, deps: DependencyList = []) => {
    useEffect(() => {
        asyncCallback();
    }, deps);
};