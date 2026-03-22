import {useState, useEffect, useCallback} from 'react';
import axios, {AxiosError} from 'axios';

//use generic type T for this hook, so it can be used for any type of data
interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

function useFetch<T>(url:string, intervalMs?:number){
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null
    });

    const fetchData = useCallback(async () => {
        try{
            const res = await axios.get<T>(url);
            setState({data: res.data, loading: false, error: null});
        }catch(err){
            // is err is an AxiosError, extracting err.response?.data?.error ?? err.message, otherwise 'Unknown error'.
            // if err.response?.data?.error is empty, use error.message.
            const message = err instanceof AxiosError ? err.response?.data?.error ?? err.message : 'Unknown error';
            setState(prev => ({...prev, loading: false, error: message}));
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