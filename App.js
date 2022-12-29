import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';

const App = () => {
  const [dataSource, setDataSource] = useState(["B","G","A","D","E","H","F","C","A","H","D","G","C","F","B","E"]);
  const [matchItems, setMatchItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [turnsCount, setTurnsCount] = useState(0);

  useEffect(() => {
    let shuffled = dataSource
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
   
    setDataSource(shuffled)
  }, []);

  useEffect(() => {
    const checkEmpty = dataSource.every(element => element === "");
    if (checkEmpty){
      Alert.alert(
        'Congratulations',
        `You have completed the memory game in ${turnsCount} turns.`,
        [
          {text: 'OK', onPress: () => [
            setDataSource(["B","G","A","D","E","H","F","C","A","H","D","G","C","F","B","E"]),
            setMatchCount(0),
            setTurnsCount(0),
            setMatchItems([]),
            setSelectedIndex([]),
        ]
          },
        ],
        {cancelable: false},
      );
    }
  },[dataSource]);

  useEffect(() => {
    if(matchItems.length === 2){
    if (matchItems[0] === matchItems[1]){
      let newArr = dataSource.map(e => e.replace(matchItems[0],""));
      setTimeout(() => {
        setMatchItems([]);
        setSelectedIndex([]);
        setDataSource(newArr);
      },500);
      setMatchCount(matchCount + 1);
      setTurnsCount(turnsCount + 1);
    } else if (matchItems[0] !== matchItems[1]){
      setMatchItems([]);
      setTurnsCount(turnsCount + 1);
      setTimeout(() => {
        setSelectedIndex([]);
      },300);
    }
    }
  },[matchItems]);

  const headerComponent = () => {
    return (
      <View style={styles.headerView}>
      <View style={styles.headerSubView}>
        <Text style={styles.text}>
            {"Matches"}
        </Text>
        <Text style={{fontSize:24}}>{matchCount}</Text>
        </View>
        <View style={styles.headerSubView}>
        <Text style={styles.text}>
            {"Turns"}
        </Text>
        <Text style={{fontSize:24}}>{turnsCount}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSource}
        ListHeaderComponent={headerComponent}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => item !== "" ? (matchItems.length <= 2 ? [setSelectedIndex([...selectedIndex, index]), setMatchItems(prevState => [...prevState,item])] : null) : null}
            style={[styles.cardView,{backgroundColor:item === "" ? "#efefef" : "#8080ff"}]}>
            <Text
              style={styles.imageThumbnail}
            >{selectedIndex.includes(index) ? item : ""}</Text>
          </TouchableOpacity>
        )}
        numColumns={4}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal:10
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical:'center',
    fontSize:30,
    color:"#ffffff",
    fontWeight:'bold'
  },
  cardView:{
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    alignItems:'center',
    justifyContent:"center",
    height:100,
  },
  headerView:{
    flex:1, 
    marginBottom:50, 
    marginTop:StatusBar.currentHeight, 
    flexDirection:'row', 
    justifyContent:'space-between'
  },
  headerSubView:{
    flex:0.5, 
    alignItems:"center"
  },
  text:{
    fontSize:24, 
    color:"#8080ff"
  },
});