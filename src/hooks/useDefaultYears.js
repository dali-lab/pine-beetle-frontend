import { useEffect, useState } from 'react';

const useDefaultYears = (
  availableYears,
  currentStartYear,
  currentEndYear,
  setStartYear,
  setEndYear
) => {
  const [defaultYearsSet, setDefaultYearsSet] = useState(false);
  const yearsLoaded = availableYears && availableYears.length > 0;

  useEffect(() => {
    if (yearsLoaded && !currentStartYear && !currentEndYear && !defaultYearsSet) {
      const sortedYears = [...availableYears].sort((a, b) => b - a);
      if (sortedYears.length > 0) {
        const latestYear = sortedYears[0];
        const startYear = sortedYears[Math.min(4, sortedYears.length - 1)];
        setStartYear(startYear);
        setEndYear(latestYear);
        setDefaultYearsSet(true);
      }
    }

    if ((!currentStartYear || !currentEndYear) && defaultYearsSet && !yearsLoaded) {
      setDefaultYearsSet(false);
    }
  }, [
    yearsLoaded,
    availableYears,
    currentStartYear,
    currentEndYear,
    setStartYear,
    setEndYear,
    defaultYearsSet,
  ]);
};

export default useDefaultYears;
