import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getListingById, updateListing, deleteListing } from '../firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
       title: '', description: '', price: 0, status: 'active'
    });

    useEffect(() => {
        const loadDoc = async () => {
            setLoading(true);
            const data = await getListingById(id);
            if(data && currentUser.uid === data.user_id) {
                setFormData(data);
            } else {
                toast.error("Unauthorized");
                navigate('/my-listings');
            }
            setLoading(false);
        };
        loadDoc();
    }, [id, currentUser, navigate]);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await updateListing(id, {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                status: formData.status
            });
            toast.success("Updated successfully!");
            navigate(`/listing/${id}`);
        } catch (error) {
            toast.error("Failed to update");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-black text-brand-navy mb-6">Quick Edit Listing</h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl">
                            <option value="active">Active</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl" rows={4} />
                    </div>
                    
                    <button type="submit" disabled={updating} className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl mt-4">
                        {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    <button type="button" onClick={async () => {
                        if(window.confirm("Delete permanently?")) {
                            await deleteListing(id);
                            navigate('/my-listings');
                        }
                    }} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl mt-2">
                        Delete Permanently
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditListing;
