import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLazyTaskById, updateLazyTask, deleteLazyTask } from '../firebase/firestore';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Edit3, Trash2 } from 'lucide-react';

const EditTask = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getLazyTaskById(id);
        if (!data) {
           toast.error("Task not found");
           return navigate('/lazy-tasks');
        }
        if (data.posted_by !== currentUser?.uid) {
           toast.error("You don't have permission to edit this task");
           return navigate('/lazy-tasks');
        }
        setTask(data);
      } catch (error) {
        console.error("Error fetching task", error);
        toast.error("Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchTask();
  }, [id, currentUser, navigate]);

  const handleUpdate = async (formData) => {
    if (task.status !== 'open') {
        return toast.error("Cannot edit a task that has been accepted or completed.");
    }
    
    setUpdating(true);
    try {
      await updateLazyTask(id, {
        ...formData,
        total_amount: (Number(formData.item_cost) || 0) + (Number(formData.task_fee) || 0)
      });
      toast.success("Task updated successfully!");
      navigate(`/lazy-tasks/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update task");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task permanently? This cannot be undone.")) return;
    
    try {
        await deleteLazyTask(id);
        toast.success("Task deleted");
        navigate('/lazy-tasks');
    } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete task");
    }
  };

  if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;
  if (!task) return null;

  const isEditable = task.status === 'open';

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 mb-20">
       <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-10 relative">
          
          <button onClick={handleDelete} className="absolute top-6 right-6 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition shadow-sm" title="Delete Task">
              <Trash2 className="w-5 h-5" />
          </button>

          <div className="text-center mb-10">
             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Edit3 className="w-8 h-8 text-brand-navy" />
             </div>
             <h1 className="text-3xl sm:text-4xl font-black text-brand-navy mb-3">Edit Your Task ✏️</h1>
          </div>

          {!isEditable && (
              <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-xl mb-6 font-bold text-center">
                  This task is already {task.status}. You cannot edit it anymore.
                  <button onClick={() => navigate(`/lazy-tasks/${id}`)} className="ml-4 underline">Go Back</button>
              </div>
          )}

          <div className={`${!isEditable ? 'opacity-50 pointer-events-none' : ''}`}>
             <TaskForm initialData={task} onSubmit={handleUpdate} loading={updating} />
          </div>

       </div>
    </div>
  );
};

export default EditTask;
