import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../types/task";
import { Ionicons } from "@expo/vector-icons";

interface TodoItemProps {
  item: Task;
  onPress: (item: Task) => void;
  remove: (item: Task) => void;
}

export default function Row({ item, onPress, remove }: TodoItemProps) {
  const press = () => {
    onPress(item);
  };

  //   console.log(item);

  return (
    <View style={styles.todoItem}>
      <Pressable style={styles.pressable} onPress={press}>
        <Text
          style={
            item.completed === 0
              ? styles.unCompletedTodoText
              : styles.completedTodoText
          }
        >
          {item.text}
        </Text>
        <Ionicons
          name="trash"
          onPress={() => remove(item)}
          style={styles.trashIcon}
          size={16}
          color="red"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 4,
    margin: 4,
    borderColor: "#c1c0c0",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  unCompletedTodoText: {
    flex: 1,
    color: "black",
    fontSize: 16,
  },
  completedTodoText: {
    flex: 1,
    color: "#808080",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
    fontSize: 16,
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trashIcon: {
    marginRight: 8,
  },
});
