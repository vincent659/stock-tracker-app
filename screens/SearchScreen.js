import React, { useState, useEffect, Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

// Header
function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {' '}
        Type a company name or stock symbol:
      </Text>
    </View>
  );
}

// Search bar
function SearchBar(props) {
  return (
    <View style={styles.searchBar}>
      <FontAwesome
        style={styles.searchIcon}
        name="search"
        size={15}
        color="#F7F7F7"
      />
      <TextInput
        style={styles.searchBarInput}
        placeholder="Search"
        placeholderTextColor="#F7F7F7"
        onChangeText={(text) => {
          props.setTerm(text);
          props.search(text);
        }}
        value={props.term}
        autoCorrect={false}
        autoFocus={true}
        underlineColorAndroid="transparent"
      />
    </View>
  );
}

// Render of individual stock cell
function StockCell(props) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => props.onPress(props.stockSymbol)}
        underlayColor="#202020"
      >
        <View style={styles.stockItem}>
          <Text style={styles.stockItemSymbolText}>{props.stockSymbol}</Text>
          <Text style={styles.stockItemNameText}>{props.stockName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Stocklist
function StockList(props) {
  return (
    <View style={styles.stockItems}>
      <ScrollView>
        {props.reset === '' ? (
          <View></View>
        ) : (
          props.search.map((stock) => (
            <StockCell
              key={stock.symbol}
              stockName={stock.name}
              stockSymbol={stock.symbol}
              onPress={(text) => {
                if (props.currentWatchList.indexOf(text) == -1) {
                  props.addToWatchList(text);
                  props.nav('Stocks');
                } else {
                  props.nav('Stocks');
                }
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Main
export default function SearchScreen({ navigation }) {
  const { ServerURL, watchList, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [resetResult, setResetResult] = useState('');
  const [value, setValue] = useState('');

  const handleSearch = (searchTerm) => {
    let stockResult = [...state];
    let searchResult = [];
    if (searchTerm == '') {
      setSearchResults(stockResult);
      setResetResult('');
    } else {
      setResetResult(searchTerm);
      stockResult.map((stockItem) => {
        if (
          stockItem.symbol.includes(searchTerm.toUpperCase()) ||
          stockItem.name.toUpperCase().includes(searchTerm.toUpperCase())
        ) {
          searchResult.push(stockItem);
        }
      });
      setSearchResults(searchResult);
    }
  };

  useEffect(() => {
    fetch(`${ServerURL}` + '/all')
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error('Fetch failed, status: ' + response.status);
      })
      .then((stockData) => {
        setState(stockData);
        setSearchResults(stockData);
      })
      .catch((message) => console.warn(message));
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Header />
        <SearchBar search={handleSearch} term={value} setTerm={setValue} />
        <StockList
          search={searchResults}
          reset={resetResult}
          addToWatchList={addToWatchlist}
          currentWatchList={watchList}
          nav={navigation.navigate}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styles for this file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  searchBar: {
    height: scaleSize(40),
    marginLeft: scaleSize(5),
    marginRight: scaleSize(5),
    marginBottom: scaleSize(5),
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(10),
  },
  searchBarInput: {
    flex: 4,
    height: scaleSize(30),
    backgroundColor: '#1E1E1E',
    color: '#F7F7F7',
    fontSize: scaleSize(20),
    paddingLeft: scaleSize(10),
  },
  searchIcon: {
    padding: scaleSize(10),
    paddingLeft: scaleSize(15),
    paddingRight: scaleSize(5),
  },
  header: {
    paddingBottom: scaleSize(5),
    height: scaleSize(20),
  },
  headerText: {
    color: '#F7F7F7',
    fontSize: scaleSize(11),
    textAlign: 'center',
    justifyContent: 'center',
  },
  stockItems: {
    flex: 13,
    backgroundColor: 'black',
  },
  stockItem: {
    backgroundColor: 'black',
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F7F7F7',
  },
  stockItemSymbolText: {
    flex: 1,
    color: '#F7F7F7',
    fontSize: scaleSize(20),
    paddingLeft: scaleSize(15),
  },
  stockItemNameText: {
    flex: 1,
    color: '#F7F7F7',
    fontSize: scaleSize(11),
    paddingLeft: scaleSize(15),
  },
  stockText: {
    color: '#F7F7F7',
  },
});
