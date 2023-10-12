import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';

export const FavCharacter = ({
  femaleCountLike,
  maleCountLike,
  otherCountLike,
  clearAllLikes,
}) => {
  return (
    <View style={styled.container}>
      <View style={styled.textItem}>
        <Text style={styled.title}>Fans</Text>
        <TouchableOpacity>
          <View style={styled.clearBtnItem}>
            <TouchableOpacity>
              <Text style={styled.clearBtn} onPress={clearAllLikes}>
                Clear fans
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styled.cardItem}>
        <View style={styled.card}>
          <Text style={styled.cardCount}>{femaleCountLike}</Text>
          <Text style={styled.cardGender}>Female Fans</Text>
        </View>
        <View style={styled.card}>
          <Text style={styled.cardCount}>{maleCountLike}</Text>
          <Text style={styled.cardGender}>Male Fans</Text>
        </View>
        <View style={styled.card}>
          <Text style={styled.cardCount}>{otherCountLike}</Text>
          <Text style={styled.cardGender}>Others</Text>
        </View>
      </View>
    </View>
  );
};

const styled = StyleSheet.create({
  container: {
    backgroundColor: '#E8E8E8',
    marginTop: 20,
  },
  textItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 18,
  },
  cardItem: {
    flexDirection: 'row',
    margin: 2,
  },
  card: {
    flex: 1,
    marginHorizontal: 10,
    padding: 12,
    justifyContent: 'space-around',
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardCount: {
    fontSize: 36,
  },
  cardGender: {
    fontWeight: '300',
  },
  clearBtnItem: {
    padding: 8,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 6,
  },
  clearBtn: {
    textTransform: 'uppercase',
    color: 'red',
  },
  title: {
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: '300',
  },
});
