// // contexts/HeaderContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface HeaderContextProps {
//   isCrewHeader: boolean;
//   toggleHeader: () => void;
// }

// const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

// export const HeaderProvider = ({ children }: { children: ReactNode }) => {
//   const [isCrewHeader, setIsCrewHeader] = useState(false);

//   const toggleHeader = () => setIsCrewHeader((prev) => !prev);

//   return (
//     <HeaderContext.Provider value={{ isCrewHeader, toggleHeader }}>
//       {children}
//     </HeaderContext.Provider>
//   );
// };

// export const useHeader = () => {
//   const context = useContext(HeaderContext);
//   if (!context) {
//     throw new Error('useHeader must be used within a HeaderProvider');
//   }
//   return context;
// };
