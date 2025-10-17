import { useEffect, useState } from "react";
import type { Statistics } from "../../types";

export function useStatistics(dataPointCount: number): Statistics[] {
  const [value, setValue] = useState<Statistics[]>([]);

  useEffect(() => {
    const unsub = window.electron.subscriberStatistics((stats) =>
      setValue((prev) => {
        const newData = [...prev, stats];

        if (newData.length > dataPointCount) {
          newData.shift();
        }

        return newData;
      })
    );
    return unsub;
  }, [dataPointCount]); //? delete the dependency if anything went wrong.

  return value;
}
