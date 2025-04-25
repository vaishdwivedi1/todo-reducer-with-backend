import { motion } from "framer-motion";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddModal from "../components/AddModal";
import DeleteModal from "../components/DeleteModal";
import axios from "axios";

// Define the Todo structure
interface Todo {
  _id: string;
  task: string;
  name: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const handleEdit = async (
    index: number,
    updatedFields?: Partial<
      Omit<Todo, "_id" | "createdAt" | "updatedAt" | "__v">
    >
  ) => {
    const todoToUpdate = todos[index];
    try {
      const res = await axios.put(
        `https://todo-one-orpin.vercel.app/updateTodo/${todoToUpdate._id}`,
        {
          name: localStorage.getItem("name"),
          task: updatedFields?.task ?? todoToUpdate.task,
          isCompleted: updatedFields?.completed ?? todoToUpdate.completed,
        }
      );
      const updated = [...todos];
      updated[index] = res.data.data;
      setTodos(updated);
      setEditIndex(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(
          `https://todo-one-orpin.vercel.app/getAllTodos?name=${localStorage.getItem(
            "name"
          )}`
        );
        setTodos(res.data.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 w-[100vw]">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">📝 Todo List</h1>
        {todos.map((todo, index) => (
          <motion.div
            key={todo._id}
            className="flex items-center justify-between border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  handleEdit(index, { completed: !todo.completed })
                }
              />
              {editIndex === index ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleEdit(index)}
                  autoFocus
                  className="border rounded px-2 py-1 text-sm"
                />
              ) : (
                <span
                  className={`${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.task}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditIndex(index);
                  setEditText(todo.task);
                }}
              >
                <Edit size={18} className="text-blue-500 hover:text-blue-700" />
              </button>
              <button
                onClick={() => {
                  setDeleteIndex(index);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 size={18} className="text-red-500 hover:text-red-700" />
              </button>
            </div>
          </motion.div>
        ))}

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 text-black py-2 rounded-xl hover:bg-blue-600 transition"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} /> Add Todo
        </button>
      </div>

      {/* Add Modal */}
      <AddModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        setTodos={setTodos}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deleteIndex={deleteIndex}
        setDeleteIndex={setDeleteIndex}
        setTodos={setTodos}
        todos={todos}
      />
    </div>
  );
};

export default Home;
