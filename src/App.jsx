import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import GlobalAdsBanner from './components/GlobalAdsBanner';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import AISupportBubble from './components/AISupportBubble';

// Lazy load pages for performance
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Home = React.lazy(() => import('./pages/Home'));
const Browse = React.lazy(() => import('./pages/Browse'));
const ListingDetail = React.lazy(() => import('./pages/ListingDetail'));
const PostListing = React.lazy(() => import('./pages/PostListing'));
const EditListing = React.lazy(() => import('./pages/EditListing'));
const MyListings = React.lazy(() => import('./pages/MyListings'));
const Notes = React.lazy(() => import('./pages/Notes'));
const NoteDetail = React.lazy(() => import('./pages/NoteDetail'));
const UploadNotes = React.lazy(() => import('./pages/UploadNotes'));
const MyNotes = React.lazy(() => import('./pages/MyNotes'));
const LazyTasks = React.lazy(() => import('./pages/LazyTasks'));
const PostTask = React.lazy(() => import('./pages/PostTask'));
const TaskDetail = React.lazy(() => import('./pages/TaskDetail'));
const EditTask = React.lazy(() => import('./pages/EditTask'));
const MyTasks = React.lazy(() => import('./pages/MyTasks'));
const Chat = React.lazy(() => import('./pages/Chat'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const Settings = React.lazy(() => import('./pages/Settings'));
const BlockedUsers = React.lazy(() => import('./pages/BlockedUsers'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Support Pages
const FAQ = React.lazy(() => import('./pages/support/FAQ'));
const ContactUs = React.lazy(() => import('./pages/support/ContactUs'));
const SafetyGuidelines = React.lazy(() => import('./pages/support/SafetyGuidelines'));
const PrivacyPolicy = React.lazy(() => import('./pages/support/PrivacyPolicy'));
const About = React.lazy(() => import('./pages/About'));
const Donate = React.lazy(() => import('./pages/Donate'));

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-brand-bg relative">
          <Navbar />
          <GlobalAdsBanner />
          <Toast />
          <AISupportBubble />
          
          <main className="flex-grow flex flex-col pt-4 pb-12 w-full max-w-7xl mx-auto md:px-6 lg:px-8">
            <Suspense fallback={<LoadingSpinner fullPage size="lg" />}>
              <Routes>
                {/* Public / Auth */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/about" element={<About />} />
                <Route path="/donate" element={<Donate />} />
                
                {/* Browsing */}
                <Route path="/browse" element={<Browse />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/:id" element={<NoteDetail />} />
                <Route path="/profile/:userId" element={<UserProfile />} />

                {/* Protected Routes */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                
                <Route path="/post" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
                <Route path="/listing/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
                <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                
                <Route path="/upload-notes" element={<ProtectedRoute><UploadNotes /></ProtectedRoute>} />
                <Route path="/my-notes" element={<ProtectedRoute><MyNotes /></ProtectedRoute>} />
                
                <Route path="/lazy-tasks" element={<LazyTasks />} />
                <Route path="/lazy-tasks/post" element={<ProtectedRoute><PostTask /></ProtectedRoute>} />
                <Route path="/lazy-tasks/:id" element={<TaskDetail />} />
                <Route path="/lazy-tasks/:id/edit" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
                <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />

                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/chat/:chatId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                
                <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/settings/blocked" element={<ProtectedRoute><BlockedUsers /></ProtectedRoute>} />
                
                {/* Admin Only */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                {/* Support & Legal */}
                <Route path="/support/faqs" element={<FAQ />} />
                <Route path="/support/contact" element={<ContactUs />} />
                <Route path="/support/safety" element={<SafetyGuidelines />} />
                <Route path="/support/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<PrivacyPolicy />} /> {/* Using Privacy for terms for now */}

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
