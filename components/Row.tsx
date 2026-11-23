import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../types/task";
import * as SQLite from "expo-sqlite";

interface TodoItemProps {
  item: Task;
  onPress: (item: Task) => void;
}

export default function Row({ item, onPress }: TodoItemProps) {
  const press = () => {
    onPress(item);
  };

  //   console.log(item);

  return (
    <View style={styles.todoItem}>
      <Pressable onPress={press}>
        <Text
          style={
            item.completed === 0
              ? styles.unCompletedTodoText
              : styles.completedTodoText
          }
        >
          {item.text}
        </Text>
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
});
