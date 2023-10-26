import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, RefreshControl } from 'react-native';
import EventSource from 'react-native-sse';
import BottomTabNavigationApp from './component/bottomTabNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const windowWidth = Dimensions.get('window').width;

export default function App() {

  const [auctions, setAuctions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const overlap = 1;
  const halfLength = Math.ceil(auctions.length / 2);
  const topAuctions = auctions.slice(0, halfLength + overlap);
  const bottomAuctions = auctions.slice(halfLength - overlap);

  const isAuctionIdInBoth = (auctionId) => {
    return topAuctions.some(a => a.auctionId === auctionId) && bottomAuctions.some(a => a.auctionId === auctionId);
  };

  let es;

  const loadData = () => {
    const es = new EventSource('https://api.fleaauction.world/v2/sse/event');

    es.addEventListener('sse.auction_viewed', (event) => {
      const eventData = JSON.parse(event.data);
      const auctionData = {
        id: event.lastEventId,
        ...eventData
      };

      setAuctions(prevAuctions => {
        const existingAuctionIndex = prevAuctions.findIndex(a => a.auctionId === auctionData.auctionId);

        if (existingAuctionIndex !== -1) {
          const updatedAuctions = [...prevAuctions];
          updatedAuctions[existingAuctionIndex].viewCount = auctionData.viewCount;
          return updatedAuctions;
        }

        else if (prevAuctions.length < 40) {
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
    loadData();

    return () => {
      if (es) es.close();
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
    const cleanup = loadData();
    setRefreshing(false);

    return () => {
      cleanup();
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>마켓</Text>
        <Icon name="search" size={40} />
      </View>

      <ScrollView pagingEnabled horizontal style={styles.pictureList} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
        {topAuctions.map((auction) => (
          <View key={auction.auctionId} style={styles.picture}>
            <Text style={styles.auctionNumber}>작품ID({auction.auctionId})</Text>
            {isAuctionIdInBoth(auction.auctionId) && (
              <Text style={styles.viewNumber}>조회수: {auction.viewCount}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <ScrollView pagingEnabled horizontal style={styles.pictureList} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
        indicatorStyle="black"
      >

        {bottomAuctions.map((auction) => (
          <View key={auction.auctionId} style={styles.picture}>
            <Text style={styles.auctionNumber}>작품ID({auction.auctionId})</Text>
            {isAuctionIdInBoth(auction.auctionId) && (
              <Text style={styles.viewNumber}>조회수: {auction.viewCount}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <BottomTabNavigationApp style={styles.menu} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 30,
  },

  headerText: {
    fontSize: 30,
    fontWeight: 'bold',

  },

  pictureList: {
    flex: 1,
  },

  picture: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'black',
    marginTop: 10,
    marginBottom: 15,
    marginRight: 10,
    width: windowWidth / 2,
  },

  auctionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },

  viewNumber: {
    fontSize: 15,
    alignItems: 'center',
    paddingTop: 10,
  },

  paintingSecond: {
    flex: 1,
  },

  footer: {
    flex: 0.3,
  },
});
