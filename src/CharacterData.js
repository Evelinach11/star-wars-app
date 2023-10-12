import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FavCharacter} from './FavCharacter';

export const CharacterData = () => {
  const [characters, setCharacters] = useState(null);
  const [page, setPage] = useState(1);
  const [maleCountLike, setMaleCountLike] = useState(0);
  const [femaleCountLike, setFemaleCountLike] = useState(0);
  const [otherCountLike, setOtherCountLike] = useState(0);

  const peopleApi = `https://swapi.dev/api/people?page=${page}`;

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const users = new Map();
      const {data} = await axios.get(peopleApi);

      const homeworldRequests = data.results.map(async character => {
        const homeworldResponse = await axios.get(character.homeworld);
        return {[character.name]: homeworldResponse.data.name};
      });

      const homeworldsData = await Promise.all(homeworldRequests);
      const homeworldsMap = Object.assign(...homeworldsData);

      const speciesRequests = data.results.map(async character => {
        if (character.species.length > 0) {
          const speciesResponse = await axios.get(character.species[0]);
          return {[character.name]: speciesResponse.data.name};
        }
        return {[character.name]: ''};
      });

      const speciesData = await Promise.all(speciesRequests);
      const speciesMap = Object.assign(...speciesData);

      data.results.forEach(element => {
        const user = {
          name: element.name,
          year: element.birth_year,
          gender: element.gender,
          species: speciesMap[element.name],
          homeworld: homeworldsMap[element.name],
          isLike: false,
        };
        users.set(user.name, user);
      });

      setCharacters(users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleIconPress = name => {
    const userValue = characters.get(name);
    const userGender = userValue.gender;

    userValue.isLike = !userValue.isLike;

    if (userGender === 'male') {
      if (userValue.isLike) {
        setMaleCountLike(maleCountLike + 1);
      } else {
        setMaleCountLike(maleCountLike - 1);
      }
    }
    if (userGender === 'female') {
      if (userValue.isLike) {
        setFemaleCountLike(femaleCountLike + 1);
      } else {
        setFemaleCountLike(femaleCountLike - 1);
      }
    }
    if (userGender === 'n/a') {
      if (userValue.isLike) {
        setOtherCountLike(otherCountLike + 1);
      } else {
        setOtherCountLike(otherCountLike - 1);
      }
    }
  };

  const clearAllLikes = () => {
    setFemaleCountLike(0);
    setMaleCountLike(0);
    setOtherCountLike(0);
  };
  const renderItem = ({item}) => (
    <View style={styled.item} key={item.name}>
      <TouchableOpacity onPress={() => handleIconPress(item.name)}>
        <Icon name="heart-o" size={20} color="red" style={styled.icon} />
      </TouchableOpacity>
      <View style={styled.textView}>
        <Text style={styled.text}>{item.name}</Text>
      </View>
      <View style={styled.textView}>
        <Text style={styled.text}>{item.year}</Text>
      </View>
      <View style={styled.textView}>
        <Text style={styled.text}>{item.gender}</Text>
      </View>
      <View style={styled.textView}>
        <Text style={styled.text}>{item.homeworld}</Text>
      </View>
      <View style={styled.textView}>
        <Text style={styled.text}>{item.species}</Text>
      </View>
    </View>
  );
  return (
    <ScrollView>
      <FavCharacter
        femaleCountLike={femaleCountLike}
        maleCountLike={maleCountLike}
        otherCountLike={otherCountLike}
        clearAllLikes={clearAllLikes}
      />
      {characters === null ? (
        <View>
          <Text>Loading</Text>
        </View>
      ) : (
        <View style={styled.container}>
          <View style={styled.card}>
            <View style={styled.inputItem}>
              <TextInput style={styled.input} placeholder="Search" />
            </View>
            <ScrollView horizontal={true} style={styled.itemBack}>
              <FlatList
                bounces={false}
                data={Array.from(characters.values())}
                keyExtractor={item => item.name}
                renderItem={renderItem}
              />
            </ScrollView>

            <View style={styled.btnItem}>
              <TouchableOpacity>
                <Text style={styled.btn} onPress={handlePrevPage}>
                  prev
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styled.btn} onPress={handleNextPage}>
                  next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styled = StyleSheet.create({
  container: {
    backgroundColor: '#E8E8E8',
  },
  card: {
    margin: 14,
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  inputItem: {
    margin: 14,
  },
  input: {
    fontSize: 18,
  },
  itemBack: {
    marginHorizontal: 14,
    borderColor: '#D8D9DA',
    borderWidth: 1,
    borderRadius: 6,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 18,
    borderColor: '#D8D9DA',
    borderWidth: 0.1,
    borderBottomWidth: 1,
    backgroundColor: '#EEEEEE',
  },
  icon: {
    width: 100,
    marginHorizontal: 10,
  },
  textView: {
    width: 180,
    alignSelf: 'center',
  },
  text: {
    color: '#0F0F0F',
  },
  btnItem: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10,
  },
  btn: {
    fontSize: 18,
    margin: 10,
  },
});
