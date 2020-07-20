import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';

// Stock Detail Section
function StockDeatilInfor(props) {
  return (
    <View style={styles.stockDetailCell}>
      <View style={styles.stockDetailHeader}>
        <Text style={styles.stockDetailHeaderText}>
          {props.detailInfo.name}
        </Text>
      </View>
      <View style={styles.stockDetailBody}>
        {/* Row 1 */}
        <View
          style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }}
        ></View>
        <View style={styles.stockPropRow}>
          <View style={styles.stockPropColumn}>
            <Text style={styles.stockPropTitle}>OPEN</Text>
            <Text style={styles.stockPropValue}>{props.detailInfo.open}</Text>
          </View>
          <View style={styles.stockPropColumn}>
            <Text style={styles.stockPropTitle}>LOW</Text>
            <Text style={styles.stockPropValue}>{props.detailInfo.low}</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View
          style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }}
        ></View>
        <View style={styles.stockPropRow}>
          <View style={styles.stockPropColumn}>
            <Text style={styles.stockPropTitle}>CLOSE</Text>
            <Text style={styles.stockPropValue}>{props.detailInfo.close}</Text>
          </View>
          <View style={styles.stockPropColumn}>
            <Text style={styles.stockPropTitle}>HIGH</Text>
            <Text style={styles.stockPropValue}>{props.detailInfo.high}</Text>
          </View>
        </View>

        {/* Row 3 */}
        <View
          style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }}
        ></View>
        <View style={styles.stockPropRow}>
          <View style={styles.stockPropColumn}>
            <Text style={styles.stockPropTitle}>VOLUMES</Text>
            <Text style={styles.stockPropValue}>
              {props.detailInfo.volumes}
            </Text>
          </View>
          <View style={styles.stockPropColumn}></View>
        </View>
        <View
          style={{ borderBottomColor: 'grey', borderBottomWidth: 1 }}
        ></View>
      </View>
    </View>
  );
}

// Stock Watchlist
function StockWatch(props) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          props.stockDetail(props.all);
          props.setHighlight(props.stockSymbol);
        }}
      >
        <View
          style={
            props.stockSymbol == props.highlight
              ? styles.stockItemHighlight
              : styles.stockItem
          }
        >
          <Text style={styles.stockItemSymbolText}>{props.stockSymbol}</Text>
          <View style={styles.stockItemPrice}>
            <Text style={styles.stockItemClosePriceText}>
              {props.closePrice}
            </Text>
            <View style={styles.stockItemPriceDiff}>
              <View
                style={
                  ((props.closePrice - props.openPrice) / props.openPrice) *
                    100 <
                  0
                    ? styles.changeRed
                    : styles.changeGreen
                }
              >
                <Text style={styles.stockItemPriceDiffText}>
                  {(
                    ((props.closePrice - props.openPrice) / props.openPrice) *
                    100
                  ).toFixed(2)}
                  {'%'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Main
export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [detail, setDetail] = useState([]);
  const [showHighight, setShowHighlight] = useState('');

  useEffect(() => {
    let stockList = [];
    Promise.all(
      watchList.map((url) =>
        fetch(`${ServerURL}/history?symbol=${url}`)
          .then((res) => res.json())
          .then((data) => stockList.push(data[0]))
      )
    ).then((data) => {
      setState(stockList);
    });
  }, [watchList]);

  return (
    <View style={styles.container}>
      <View style={styles.watchListStockBlock}>
        <ScrollView>
          {state
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .map((stock) => (
              <StockWatch
                key={stock.name}
                stockSymbol={stock.symbol}
                openPrice={stock.open}
                closePrice={stock.close}
                setHighlight={setShowHighlight}
                highlight={showHighight}
                all={stock}
                stockDetail={setDetail}
              />
            ))}
        </ScrollView>
      </View>
      <StockDeatilInfor detailInfo={detail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stockItem: {
    backgroundColor: 'black',
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F7F7F7',
  },
  stockItemHighlight: {
    backgroundColor: '#383838',
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F7F7F7',
  },
  watchListStockBlock: {
    flex: 7,
    flexDirection: 'column',
  },
  stockItemSymbolText: {
    color: '#F7F7F7',
    fontSize: scaleSize(20),
    paddingLeft: scaleSize(15),
  },
  stockItemPrice: {
    flexDirection: 'row',
    paddingRight: scaleSize(5),
  },
  stockItemClosePriceText: {
    color: '#F7F7F7',
    fontSize: scaleSize(20),
  },
  stockItemPriceDiff: {
    width: scaleSize(90),
    marginLeft: scaleSize(25),
  },
  changeRed: {
    color: '#F7F7F7',
    fontSize: scaleSize(20),
    textAlign: 'right',
    backgroundColor: '#FF3830',
    borderRadius: scaleSize(7),
  },
  changeGreen: {
    backgroundColor: '#4CD964',
    borderRadius: scaleSize(7),
  },
  stockItemPriceDiffText: {
    color: '#F7F7F7',
    fontSize: scaleSize(20),
    textAlign: 'right',
  },
  stockDetailCell: {
    backgroundColor: '#212121',
    flex: 2,
  },
  stockDetailHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockDetailHeaderText: {
    color: '#F7F7F7',
    fontSize: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockDetailBody: {
    flex: 1.5,
    flexDirection: 'column',
  },
  stockPropTitle: {
    color: '#636363',
    fontSize: scaleSize(15),
    textAlign: 'left',
  },
  stockPropValue: {
    color: '#F7F7F7',
    fontSize: scaleSize(15),
    textAlign: 'right',
  },
  stockPropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  stockPropColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: scaleSize(20),
    marginLeft: scaleSize(3),
    marginRight: scaleSize(3),
  },
});
