import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

// Define the structure of a Todo item
interface Todo {
  _id: string;
  name: string;
  task: string;
  completed: boolean;
  createdAt: string;
}

// Props expected by the DeleteModal component
interface DeleteModalProps {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  deleteIndex: number | null;
  setDeleteIndex: (index: number | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  deleteIndex,
  setDeleteIndex,
  setTodos,
  todos,
}) => {
  // Handle the deletion of the selected todo item
  const handleDelete = async () => {
    if (deleteIndex === null) return;

    try {
      const todoToDelete = todos[deleteIndex];
      
      // Make DELETE request to the API with todo ID and user name
      await axios.delete(
        `https://todo-one-orpin.vercel.app/deleteTodo/${todoToDelete._id}`,
        {
          data: { name: localStorage.getItem("name") },
        }
      );

      // Remove the deleted todo from the list
      setTodos(todos.filter((_, i) => i !== deleteIndex));

      // Close the modal and reset the index
      setShowDeleteModal(false);
      setDeleteIndex(null);
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <AnimatePresence>
      {showDeleteModal && (
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
            <h2 className="text-lg font-semibold text-center">
              Confirm Delete
            </h2>
            <p className="text-center text-sm text-gray-600">
              Are you sure you want to delete this todo?
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-red rounded-lg hover:bg-red-600 transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
