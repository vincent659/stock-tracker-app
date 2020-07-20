import React, { useState, useContext, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  async function getDataBack(newSymbol) {
    const data = await AsyncStorage.getItem('stockSaveData');

    data === null ? setState([]) : setState(data.split(','));
  }

  const addToWatchlist = async (newSymbol) => {
    try {
      await AsyncStorage.setItem(
        'stockSaveData',
        state.concat(newSymbol).toString()
      );
      setState(state.concat(newSymbol));
    } catch {
      alert('Saving Unsuccessful');
    }

    setState(state.concat(newSymbol));
  };

  useEffect(() => {
    getDataBack();
  }, []);

  return {
    ServerURL: 'http://131.181.190.87:3001',
    watchList: state,
    addToWatchlist,
  };
};
