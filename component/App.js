import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import EventSource from 'react-native-sse';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {

  const es = new EventSource('https://api.fleaauction.world/v2/sse/event');

  es.addEventListener('open', (event) => {
    console.log('Open SSE connection');
  });

  es.addEventListener("message", (event) => {
    console.log("New message event:", event.data);
  });

  es.addEventListener("error", (event) => {
    if (event.type === "error") {
      console.error("Connection error:", event.message);
    } else if (event.type === "exception") {
      console.error("Error:", event.message, event.error);
    }
  });

  es.addEventListener("close", (event) => {
    console.log("Close SSE connection.");
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>헤더 부분</Text>
      </View>

      <ScrollView pagingEnabled horizontal contentContainerStyle style={styles.pictureList}>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>10</Text>
          <Text style={styles.viewCount}>1</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>20</Text>
          <Text style={styles.viewCount}>2</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>30</Text>
          <Text style={styles.viewCount}>3</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>40</Text>
          <Text style={styles.viewCount}>4</Text>
        </View>
      </ScrollView>


      <ScrollView pagingEnabled horizontal contentContainerStyle style={styles.paintingSecond}>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>100</Text>
          <Text style={styles.viewCount}>5</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>200</Text>
          <Text style={styles.viewCount}>6</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>300</Text>
          <Text style={styles.viewCount}>7</Text>
        </View>
        <View style={styles.picture}>
          <Text style={styles.auctionId}>400</Text>
          <Text style={styles.viewCount}>8</Text>
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
    backgroundColor: 'black',

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

  auctionId: {
    fontSize: 50,
    alignItems: 'center',
  },

  viewCount: {
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
