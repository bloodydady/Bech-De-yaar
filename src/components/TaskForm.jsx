import React, { useState, useEffect } from 'react';
import { ShoppingCart, BookOpen, Home, Laptop, Box } from 'lucide-react';
import AIAutocomplete from './AIAutocomplete';
import { useAuth } from '../context/AuthContext';

const TaskForm = ({ initialData, onSubmit, loading }) => {
  const { userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Fetch & Deliver',
    item_cost: 0,
    task_fee: 10,
    deadline: 'ASAP',
    location: '',
    college: userProfile?.college_name || '',
    city: userProfile?.city || '',
    is_urgent: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) 
    }));
  };

  const handleStringChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const CATEGORIES = [
    { id: 'Fetch & Deliver', icon: ShoppingCart },
    { id: 'Academic', icon: BookOpen },
    { id: 'Hostel', icon: Home },
    { id: 'Digital', icon: Laptop },
    { id: 'Other', icon: Box }
  ];

  const DEADLINES = ['ASAP', '30 mins', '1 hour', 'Today'];

  const totalAmount = (Number(formData.item_cost) || 0) + (Number(formData.task_fee) || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Task Title *</label>
          <input 
            type="text" 
            name="title" 
            required 
            maxLength={80}
            value={formData.title} 
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-semibold"
            placeholder="e.g. Canteen se 2 samosa lao"
          />
          <div className="text-right text-xs text-gray-400 mt-1 font-medium">{formData.title.length}/80</div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
          <textarea 
            name="description" 
            required 
            rows={3} 
            maxLength={300}
            value={formData.description} 
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-medium resize-none"
            placeholder="Describe exactly what you need — quantity, specifications, any special instructions..."
          />
          <div className="text-right text-xs text-gray-400 mt-1 font-medium">{formData.description.length}/300</div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">Category *</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = formData.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleStringChange('category', cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition ${isSelected ? 'border-brand-orange bg-orange-50 text-brand-orange shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-brand-orange' : 'text-gray-400'}`} />
                <span className="text-xs font-bold text-center leading-tight">{cat.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing / Payment Breakdown */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <label className="block text-lg font-black text-brand-navy mb-4">Payment Breakdown (₹) 💵</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Item Cost (Optional)</label>
            <input 
              type="number" 
              name="item_cost" 
              min="0"
              value={formData.item_cost} 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-bold text-lg"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-2 font-medium">Original cost of item you want fetched. 0 if no item purchase needed.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Task Fee (You pay to earner) *</label>
            <input 
              type="number" 
              name="task_fee" 
              required 
              min="5"
              value={formData.task_fee} 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-success text-brand-success font-black text-lg"
              placeholder="10"
            />
            <p className="text-xs text-gray-500 mt-2 font-medium">Minimum ₹5. This is what the person doing your task actually earns.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-inner flex flex-col sm:flex-row items-center justify-between">
           <div>
              <p className="text-sm font-bold text-gray-700">Total you pay on delivery</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">₹{formData.task_fee || 0} to earner + ₹{formData.item_cost || 0} for item</p>
           </div>
           <div className="text-3xl font-black text-brand-orange mt-2 sm:mt-0">
             ₹{totalAmount}
           </div>
        </div>
      </div>

      {/* Logistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
           <label className="block text-sm font-bold text-gray-700 mb-3">Deadline *</label>
           <div className="flex flex-wrap gap-3">
             {DEADLINES.map(d => (
               <button
                 key={d}
                 type="button"
                 onClick={() => handleStringChange('deadline', d)}
                 className={`px-6 py-2.5 rounded-full font-bold text-sm transition shadow-sm ${formData.deadline === d ? 'bg-brand-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 {d}
               </button>
             ))}
           </div>
        </div>

        <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Where to deliver? *</label>
            <input 
              type="text" 
              name="location" 
              required 
              value={formData.location} 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-semibold"
              placeholder="e.g. Hostel Block B, Room 204 or Library entrance"
            />
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">College *</label>
            <AIAutocomplete 
              type="college" 
              value={formData.college} 
              onChange={(val) => handleStringChange('college', val)} 
              required 
            />
        </div>
        
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
            <AIAutocomplete 
              type="city" 
              value={formData.city} 
              onChange={(val) => handleStringChange('city', val)} 
              required 
            />
        </div>
      </div>

      {/* Urgent Toggle */}
      <div className="pt-4 border-t border-gray-100">
         <label className="flex items-start space-x-3 cursor-pointer group p-4 border border-red-100 bg-red-50/50 rounded-xl">
            <input 
              type="checkbox" 
              name="is_urgent" 
              checked={formData.is_urgent} 
              onChange={handleChange} 
              className="w-5 h-5 mt-0.5 rounded text-red-500 focus:ring-red-500 cursor-pointer" 
            />
            <div>
              <span className="font-bold text-red-600 block flex items-center">
                 <span className={`w-2 h-2 rounded-full mr-2 ${formData.is_urgent ? 'bg-red-500 animate-pulse' : 'bg-red-300'}`}></span>
                 Mark as Urgent
              </span>
              <span className="text-sm border-gray-500 mt-1 block font-medium opacity-80">Urgent tasks get a red badge and attract faster responses. Use only if truly needed immediately.</span>
            </div>
         </label>
      </div>

      <button 
         type="submit" 
         disabled={loading}
         className="w-full py-4 text-lg bg-brand-orange hover:bg-orange-600 font-black text-white rounded-xl transition shadow-xl disabled:opacity-70 mt-4 flex items-center justify-center space-x-2"
      >
         {loading ? <span className="animate-pulse">Saving Task...</span> : <span>{initialData ? 'Update Task' : 'Post Task Cash on Delivery'}</span>}
      </button>

    </form>
  );
};

export default TaskForm;
