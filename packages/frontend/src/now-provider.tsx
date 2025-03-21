import React, { createContext, useContext, useEffect, useState } from "react";

export const NowContext = createContext<Date | undefined>(undefined);

export const NowProvider: React.FC<{
  children?: React.ReactNode | undefined;
}> = ({ children }) => {
  const [now, setNow] = useState<Date | undefined>();

  useEffect(() => {
    setNow(new Date());

    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
};

export const useNow = () => {
  return useContext(NowContext);
};
