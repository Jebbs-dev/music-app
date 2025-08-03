import { useMusicData } from "@/store/music-data";
import api from "@/utils/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";


export const useFetchLibrary = (userId: string) => {

  const { setLibraryData } = useMusicData()

  const query = useQuery({
    queryKey: ["library", userId],
    queryFn: async () => {
      const response = await api.get(`library/user/${userId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  useEffect(()=> {
    if(query.data){
      const allLibraryData = query.data;
      setLibraryData(allLibraryData);
    }
  }, [query.data])

  return query;
};
