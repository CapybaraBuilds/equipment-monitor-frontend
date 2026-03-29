import {useState, useEffect, useCallback, useRef} from 'react';
import axios, {AxiosError} from 'axios';

//use generic type T for this hook, so it can be used for any type of data
interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

//Module level cache shared across all components for the page's lifetime
const etagCache = new Map<string, {etag: string; data: unknown}>()

function useFetch<T>(url:string, intervalMs?:number){
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null
    });

    //Track whether this is the first fetch to avoid showing a loading flash on polls
    const isFirstLoad = useRef(true);

    const fetchData = useCallback(async () => {
        try{
            const cached = etagCache.get(url);
            const headers: Record<string, string> = {};

            // Attach a conditional request header if we have a cached ETag for this URL
            if(cached?.etag) {
                headers['If-None-Match'] = cached.etag;
            }

            const res = await axios.get<T>(url, {headers});

            // HTTP 200: fresh data returned - update the Etag cache and state
            const newEtag = res.headers['etag'] as string | undefined;
            if (newEtag) {
                etagCache.set(url, {etag: newEtag, data: res.data});
            }
            setState({data: res.data, loading: false, error: null});
            isFirstLoad.current = false;
        }catch(err){
            // HTTP 304: resource unchanged - serve from cache without triggering a loading state
            if(axios.isAxiosError(err) && err.response?.status === 304){
                const cached = etagCache.get(url);
                if (cached){
                    setState(prev => ({...prev, data: cached.data as T, loading: false}));
                    isFirstLoad.current = false;
                    return;
                }
            }
            // is err is an AxiosError, extracting err.response?.data?.error ?? err.message, otherwise 'Unknown error'.
            const message = err instanceof AxiosError ? err.response?.data?.error ?? err.message : 'Unknown error';
            // On the first load, surface the error to the user.
            // On subsequent polls, keep showing stale data rather than replacing it with an error.
            setState(prev => ({...prev, loading: false, error: isFirstLoad.current ? message: prev.error}));
        }
    }, [url]);

    useEffect(() => {
        fetchData();
        if(!intervalMs) return;
        const id = setInterval(fetchData, intervalMs);
        return () => clearInterval(id);
    }, [fetchData, intervalMs]);

    return {...state, refetch: fetchData};

}

export default useFetch;