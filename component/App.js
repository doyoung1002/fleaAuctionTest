import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, RefreshControl } from 'react-native';
import EventSource from 'react-native-sse';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {

  const [auctions, setAuctions] = useState([]); // 상태 값 설정
  const [refreshing, setRefreshing] = useState(false);

  const halfLength = Math.ceil(auctions.length / 2);
  const topAuctions = auctions.slice(0, halfLength);
  const bottomAuctions = auctions.slice(halfLength);

  const isAuctionIdInBoth = (auctionId) => {
    return topAuctions.some(a => a.auctionId === auctionId) && bottomAuctions.some(a => a.auctionId === auctionId);
  };


  const loadData = () => {
    const es = new EventSource('https://api.fleaauction.world/v2/sse/event');

    es.addEventListener('sse.auction_viewed', (event) => {
      const eventData = JSON.parse(event.data);
      const auctionData = {
        id: event.lastEventId,
        ...eventData
      };

      setAuctions(prevAuctions => {
        if (prevAuctions.length < 20) {
          return [...prevAuctions, auctionData];
        } else {
          es.close();
          return prevAuctions;
        }
      });
    });

    return () => {
      es.close();
    };
  };

  useEffect(() => {
    const cleanup = loadData(); // loadData 함수에서 반환된 cleanup 함수를 저장합니다.

    return () => {
      cleanup(); // 컴포넌트가 언마운트되거나 useEffect가 다시 실행될 때 cleanup 함수를 호출합니다.
    };
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  const onRefresh = () => {
    setRefreshing(true);
    setAuctions([]);
    const cleanup = loadData(); // loadData 함수에서 반환된 cleanup 함수를 저장합니다.
    setRefreshing(false);

    return () => {
      cleanup(); // loadData 함수의 이벤트 리스너를 닫습니다.
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>헤더 부분</Text>
      </View>

      <ScrollView pagingEnabled horizontal style={styles.pictureList} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
        {topAuctions.map((auction, index) => (
          <View key={index} style={styles.picture}>
            <Text style={styles.auctionNumber}>작품ID({auction.auctionId})</Text>
            {isAuctionIdInBoth(auction.auctionId) && (
              <Text style={styles.viewNumber}>조회수: {auction.viewCount}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <ScrollView pagingEnabled horizontal style={styles.paintingSecond} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
        {bottomAuctions.map((auction, index) => (
          <View key={index} style={styles.picture}>
            <Text style={styles.auctionNumber}>작품ID({auction.auctionId})</Text>
            {isAuctionIdInBoth(auction.auctionId) && (
              <Text style={styles.viewNumber}>조회수: {auction.viewCount}</Text>
            )}
          </View>
        ))}
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
