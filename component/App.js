import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, RefreshControl } from 'react-native';
import EventSource from 'react-native-sse';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {

  const [auctions, setAuctions] = useState([]); // 상태 값 설정
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    const es = new EventSource('https://api.fleaauction.world/v2/sse/event');

    let loadedAuctions = [];

    es.addEventListener('sse.auction_viewed', (event) => {
      console.log(event.data);
      const eventData = JSON.parse(event.data);
      const auctionData = {
        id: event.lastEventId,
        ...eventData
      };

      loadedAuctions.push(auctionData);

      if (loadedAuctions.length >= 20) {
        setAuctions(prevAuctions => [...prevAuctions, ...loadedAuctions]);
        es.close();
      }
    });
  };


  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setAuctions([]);
    loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>헤더 부분</Text>
      </View>

      <ScrollView pagingEnabled horizontal style={styles.pictureList}>
        {auctions.map((auction, index) => (
          <View key={index} style={styles.picture}>
            <Text style={styles.auctionNumber}>작품ID({auction.auctionId})</Text>
            <Text style={styles.viewNumber}>조회수: {auction.viewCount}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView pagingEnabled horizontal contentContainerStyle style={styles.paintingSecond}>
        <View style={styles.picture}>
          <Text style={styles.auctionNumber}>100</Text>
          <Text style={styles.viewNumber}>5</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionNumber}>200</Text>
          <Text style={styles.viewNumber}>6</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionNumber}>300</Text>
          <Text style={styles.viewNumber}>7</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionNumber}>400</Text>
          <Text style={styles.viewNumber}>8</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text>풋터 부분</Text>
      </View>
      {/* <StatusBar style="auto" /> */}
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    flex: 0.5,
    backgroundColor: 'teal',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pictureList: {
    flex: 1,
    backgroundColor: 'yellow',
  },

  picture: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },

  auctionNumber: {
    fontSize: 50,
    alignItems: 'center',
  },

  viewNumber: {
    fontSize: 30,
    alignItems: 'center',
  },

  paintingSecond: {
    flex: 1,
    backgroundColor: 'grey',
  },

  footer: {
    flex: 0.5,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  }

});
