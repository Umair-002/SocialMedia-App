import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Button,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import BackButton from "./backButton";

const DATA = [
  { id: 1, name: "Alice", phone: "123-456-7890" },
  { id: 2, name: "Bob", phone: "234-567-8901" },
  { id: 3, name: "Charlie", phone: "345-678-9012" },
  { id: 16, name: "Charlie", phone: "345-678-9012" },
  { id: 17, name: "Charlie", phone: "345-678-9012" },
  { id: 4, name: "David", phone: "456-789-0123" },
  { id: 18, name: "David", phone: "456-789-0123" },
  { id: 19, name: "David", phone: "456-789-0123" },
  { id: 5, name: "Emma", phone: "567-890-1234" },
  { id: 20, name: "Emma", phone: "567-890-1234" },
  { id: 21, name: "Emma", phone: "567-890-1234" },
  { id: 6, name: "Frank", phone: "678-901-2345" },
  { id: 7, name: "Grace", phone: "789-012-3456" },
  { id: 8, name: "Henry", phone: "890-123-4567" },
  { id: 9, name: "Isaac", phone: "901-234-5678" },
  { id: 10, name: "Jack", phone: "012-345-6789" },
  { id: 11, name: "Jack", phone: "012-345-6789" },
  { id: 12, name: "Jack", phone: "012-345-6789" },
  { id: 13, name: "Jack", phone: "012-345-6789" },
  { id: 14, name: "Jack", phone: "012-345-6789" },
  { id: 15, name: "Aack", phone: "012-345-6789" },
];

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   contacts: DATA.sort((a, b) => a.name.localeCompare(b.name)),
      contacts: [],
      isLoading: true,
    };
  }

  navigateToSearchUserScreen = () => {
    this.props.navigation.navigate("SearchUser");
  };
  async componentDidMount() {
    const token = await AsyncStorage.getItem("session_token");

    fetch("http://localhost:3333/api/1.0.0/contacts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        this.setState({
          contacts: data?.sort((a, b) =>
            a.first_name.localeCompare(b.first_name)
          ),
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  removeContact = async (userId) => {
    const token = await AsyncStorage.getItem("session_token");

    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          let filter = this.state.contacts.filter(
            (item) => item?.user_id !== userId
          );
          this.setState({
            contacts: filter,
          });
          // show success message
        } else {
          throw new Error("Failed to save user.");
        }
      })
      .catch((error) => console.error(error));
  };
  blockContact = async (userId) => {
    const token = await AsyncStorage.getItem("session_token");

    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          let filter = this.state.contacts.filter(
            (item) => item?.user_id !== userId
          );
          this.setState({
            contacts: filter,
          });
          // show success message
        } else {
          throw new Error("Failed to save user.");
        }
      })
      .catch((error) => console.error(error));
  };

  handleGoBack = () => {
    this.props.navigation.goBack();
  };

  renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.name}>{item.first_name}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.trash}
            onPress={() => this.removeContact(item.user_id)}
          >
            <Icon name="trash-o" size={20} color="#FF6F61" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.blockContact(item.user_id)}>
            <Icon name="ban" size={20} color="#FF6F61" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.heading}>
        <BackButton
          styling={styles.backIcon}
          handleGoBack={this.handleGoBack}
        />
        <Text style={styles.headerTitle}>Contact</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <AntDesign
          onPress={() => this.navigateToSearchUserScreen()}
          name="plus"
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );

  renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.alphabetContainer, { paddingHorizontal: 10 }]}>
      <Text style={styles.alphabet}>{title}</Text>
    </View>
  );

  render() {
    const { isLoading } = this.state;
    const sections = this.state.contacts.reduce((acc, item) => {
      const letter = item?.first_name?.charAt(0)?.toUpperCase();
      const index = acc.findIndex((section) => section.title === letter);
      if (index === -1) {
        acc.push({ title: letter, data: [item] });
      } else {
        acc[index].data.push(item);
      }
      return acc;
    }, []);
    // if (isLoading) {
    //   return (
    //     <View>
    //       <Text>Loading...</Text>
    //     </View>
    //   );
    // }
    return (
      <View style={styles.container}>
        {this.renderHeader()}

        <View style={styles.listContainer}>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.user_id.toString() + index}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
            stickySectionHeadersEnabled={true}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            SectionSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.footer} />}
            // ListEmptyComponent={() => (
            //   <View style={styles.emptyContainer}>
            //     <Text style={styles.emptyText}>No Contacts</Text>
            //   </View>
            // )}
            stickyHeaderIndices={[0]}
            style={{ marginTop: 30 }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
  },
  backIcon: {
    position: "relative",
    right: "11px",
    // top: "9px",
  },
  trash: {
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemSeparator: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  // container: {
  //     flex: 1,
  //   },
  separator: {
    // borderBottom: "1px solid #bda8a8",
    // borderTop: "1px solid #bda8a8",
    borderBottomWidth: 1,
    borderBottomColor: "#bda8a8",
    borderTopWidth: 1,
    borderTopColor: "#bda8a8",
  },
  listContainer: {
    height: "100%", // set a fixed height
    // backgroundColor: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#fff",

    // backgroundColor: "#3b5998",
    backgroundColor: "transparent",
    // color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "relative",
    top: 15,
  },
  headerTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "rgb(33, 150, 243)",
    borderRadius: 50,
    padding: 10,
  },
  item: {
    borderColor: "green",
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 16,
    fontWeight: "300",
    color: "#999",
  },
  alphabetContainer: {
    backgroundColor: "#eee",
    padding: 5,
  },
  alphabet: {
    fontWeight: "bold",
    color: "#666",
    fontSize: 16,
  },
});
