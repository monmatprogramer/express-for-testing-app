// Return 1970-01-01T00:15:00.000Z -> 00:15:00
export const findDuration = (start: any): any => {
  const durationDate = new Date(Date.now() - start).toISOString().slice(11, 19);
  return durationDate;
};
