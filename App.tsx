import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Task } from "./types/task";
import { useEffect, useState } from "react";
import Row from "./components/Row";
import * as SQLite from "expo-sqlite";

export default function App() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync("todoTasks.db");
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed INTEGER DEFAULT 0
        );
      `);
      loadTodos(database);
    };

    initDb();
  }, []);

  const loadTodos = async (database: SQLite.SQLiteDatabase) => {
    const result = await database.getAllAsync<Task>(
      "SELECT * FROM todos ORDER BY id DESC",
    );
    setTasks(result);
  };

  const addTodo = async () => {
    if (!input.trim() || !db) return;

    await db.runAsync("INSERT INTO todos (text) VALUES (?)", input);
    setInput("");
    loadTodos(db);
    // console.log("Adding");
  };

  const handlePress = async (item: Task) => {
    if (!db) return;
    const newCompleted = item.completed === 0 ? 1 : 0;

    // console.log("´newCompleted", newCompleted);
    await db.runAsync("UPDATE todos SET completed = ? WHERE id = ?", [
      newCompleted,
      item.id,
    ]);

    // console.log("Updating", item);
    loadTodos(db);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            placeholder="Add new task"
            onChangeText={setInput}
            onSubmitEditing={addTodo}
          />
          <Pressable style={styles.button} onPress={addTodo}>
            <Text>Add</Text>
          </Pressable>
        </View>
      </View>
      <FlatList<Task>
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Row item={item} onPress={handlePress} />}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  list: {
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderColor: "#c1c0c0",
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    padding: 8,
  },
  button: {
    backgroundColor: "#c1c0c0",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
});
