import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createLazyTask } from '../firebase/firestore';
import TaskForm from '../components/TaskForm';
import toast from 'react-hot-toast';
import { Zap } from 'lucide-react';

const PostTask = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Protected route check is normally handled by router or parent, 
  // but we add a quick return here just in case.
  if (!currentUser) {
      navigate('/login');
      return null;
  }

  const handleSubmit = async (formData) => {
    if (!formData.title || !formData.description || !formData.location || !formData.college || !formData.city) {
        return toast.error("Please fill all required fields!");
    }
    if (formData.task_fee < 5) {
        return toast.error("Minimum task fee is ₹5");
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        posted_by: currentUser.uid,
        posted_by_name: userProfile?.name || 'Student',
        posted_by_avatar: userProfile?.profile_photo_url || null,
        posted_by_college: userProfile?.college_name || formData.college,
        total_amount: (Number(formData.item_cost) || 0) + (Number(formData.task_fee) || 0)
      };

      const newTaskId = await createLazyTask(taskData);
      toast.success("Task posted! Waiting for someone to accept 😄");
      navigate(`/lazy-tasks/${newTaskId}`);

    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to post task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 mb-20">
       <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-10">
          
          <div className="text-center mb-10">
             <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <Zap className="w-8 h-8 text-brand-orange fill-brand-orange" />
             </div>
             <h1 className="text-3xl sm:text-4xl font-black text-brand-navy mb-3">Post a Lazy Task 😴</h1>
             <p className="text-gray-500 font-medium">Someone will do it for you — pay them cash on completion.</p>
          </div>

          <TaskForm onSubmit={handleSubmit} loading={loading} />

       </div>
    </div>
  );
};

export default PostTask;
