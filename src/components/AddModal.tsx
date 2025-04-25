import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

// Define the structure of a Todo item
interface Todo {
  _id: string;
  name: string;
  task: string;
  completed: boolean;
  createdAt: string;
}

// Props expected by the AddModal component
interface AddModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const AddModal: React.FC<AddModalProps> = ({
  showAddModal,
  setShowAddModal,
  setTodos,
}) => {
  const [newTodo, setNewTodo] = useState<string>("");

  // Handles the creation of a new todo
  const handleAdd = async () => {
    // Prevent adding empty or whitespace-only tasks
    if (!newTodo.trim()) return;

    try {
      const res = await axios.post("https://todo-one-orpin.vercel.app/createTodo", {
        name: localStorage.getItem("name"),
        task: newTodo,
      });

      // Update the list of todos with the newly created one
      setTodos((prev) => [...prev, res.data.data]);

      // Reset input field and close the modal
      setNewTodo("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  return (
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-80"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add New Todo</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Input for the new todo */}
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />

            {/* Button to trigger the add function */}
            <button
              className="w-full bg-blue-500 text-black py-2 rounded-xl hover:bg-blue-600 transition"
              onClick={handleAdd}
            >
              Add
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddModal;
