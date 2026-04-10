"use client";

import { fetchTotalQueries } from "@/utils/queries";
import { NumberTickerDisplay } from "../ui/NumberTickerDisplay";
import { useEffect, useState } from "react";

export const QueryCount = () => {
  const [count, setCount] = useState(713);

  useEffect(() => {
    const fetchData = async () => {
      const totalCount = await fetchTotalQueries();
      setCount(Number(totalCount));
    };
    fetchData();
  }, []);
  return <NumberTickerDisplay count={count}></NumberTickerDisplay>;
};
