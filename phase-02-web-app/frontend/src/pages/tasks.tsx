import { useState, useEffect } from 'react';
import { taskAPI } from '@/services/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Task } from '@/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksData = await taskAPI.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdTask = await taskAPI.createTask({
        title: newTask.title,
        description: newTask.description,
      });
      setTasks([createdTask, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const updatedTask = await taskAPI.updateTask(editingTask.id.toString(), {
        title: editingTask.title,
        description: editingTask.description,
      });
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedTask = await taskAPI.toggleTaskCompletion(task.id.toString(), !task.completed);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-[60vh] py-8 bg-gradient-to-br ">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Tasks</h1>

          {/* Task Creation Form */}
          <div className="bg-pink-100 shadow-md rounded-xl p-4 mb-6 border-t-4 border-purple-400">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>

            <form onSubmit={editingTask ? (e) => { e.preventDefault(); handleUpdateTask(); } : handleCreateTask}>
              <div className="mb-2">
                <input
                  type="text"
                  value={editingTask ? editingTask.title : newTask.title}
                  onChange={(e) =>
                    editingTask
                      ? setEditingTask({...editingTask, title: e.target.value})
                      : setNewTask({...newTask, title: e.target.value})
                  }
                  placeholder="Task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-2">
                <textarea
                  value={editingTask ? editingTask.description : newTask.description}
                  onChange={(e) =>
                    editingTask
                      ? setEditingTask({...editingTask, description: e.target.value})
                      : setNewTask({...newTask, description: e.target.value})
                  }
                  placeholder="Task description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                {editingTask ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm"
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="px-3 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm"
                  >
                    Add Task
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Filter Controls */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                  filter === 'all' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 text-sm font-medium ${
                  filter === 'pending' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                  filter === 'completed' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Task List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No tasks found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg shadow-sm transition hover:shadow-md ${
                    task.completed
                      ? 'bg-green-50 border-l-4 border-green-400'
                      : 'bg-pink-50 border-l-4 border-pink-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-green-700' : 'text-pink-700'}`}>
                        {task.title}
                      </h3>
                      <p className={`mt-1 text-xs ${task.completed ? 'text-green-600' : 'text-pink-600'}`}>
                        {task.description}
                      </p>
                      <div className="mt-1 text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className={`p-1 rounded-full text-xs transition transform hover:scale-110 ${
                          task.completed ? 'bg-green-200 text-green-800' : 'bg-pink-200 text-pink-700'
                        }`}
                      >
                        {task.completed ? '✓' : '+'}
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1 text-pink-700 hover:text-pink-900 rounded-full hover:bg-pink-100 text-xs transition"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 text-xs transition"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
