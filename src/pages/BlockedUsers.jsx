import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserX, ShieldClose } from 'lucide-react';

const mockBlocked = [
    { id: '1', name: 'Anonymous Scammer', college: 'Unknown', photo: null }
];

const BlockedUsers = () => {
    const navigate = useNavigate();
    const [blocked, setBlocked] = useState(mockBlocked);

    return (
        <div className="max-w-2xl mx-auto w-full px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-black text-brand-navy">Blocked Users</h1>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {blocked.length === 0 ? (
                    <div className="text-center py-20 px-8">
                        <ShieldClose className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-brand-navy mb-2">Nobody Blocked</h3>
                        <p className="text-gray-500">You haven't blocked anyone yet. Blocked users will not be able to message you or view your listings.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {blocked.map(user => (
                            <div key={user.id} className="p-6 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                       <UserX className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{user.name}</h4>
                                        <p className="text-sm font-semibold text-gray-500">{user.college}</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 border-2 border-brand-navy text-brand-navy font-bold rounded-lg hover:bg-brand-navy hover:text-white transition shadow-sm text-sm">
                                    Unblock
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockedUsers;
