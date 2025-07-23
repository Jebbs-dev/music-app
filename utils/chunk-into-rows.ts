
export const chunkIntoRows = (data: any, rows: any) => {
  const columns = Math.ceil(data.length / rows);
  const matrix = Array.from({ length: rows }, (_, rowIndex) => 
    data.slice(rowIndex * columns, (rowIndex + 1) * columns)
  );
  return matrix;
};