import { SongData } from "@/modules/music/types/types";

export const chunkIntoRows = (data: SongData[], rows: any) => {
  const columns = Math.ceil(data && (data.length / rows));
  const matrix = Array.from({ length: rows }, (_, rowIndex) => 
   data && data.slice(rowIndex * columns, (rowIndex + 1) * columns)
  );
  return matrix;
};