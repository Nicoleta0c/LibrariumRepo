import './App.css'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserManagement from './pages/UserManagement';
import UserRegistration from './pages/UserResgistration'; 
import BookList from './pages/BookList'; 
import Navbar from './pages/Navbar';
import LandingPage from './landing/LandingPage';
import AdminProfile from './pages/AdminProfile'; 
import UserProfile from './pages/UserProfile'; 
import { AppProvider, useAppContext } from './context/AppContext'; 
import LoanDetail from './pages/LoanDetail';


const ProtectedRoute = ({ element, redirectTo }: { element: JSX.Element; redirectTo: string }) => {
  const { isAuthenticated } = useAppContext(); 
  return isAuthenticated ? element : <Navigate to={redirectTo} />; 
};

const App: React.FC = () => {
  return (
    <AppProvider> 
      <Router> 
        <Navbar /> 
        <Routes> 
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/loan/:loanId" element={<ProtectedRoute element={<LoanDetail />} redirectTo="/login" />} />
          <Route path="/login" element={<UserManagement />} /> 
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/books" element={<ProtectedRoute element={<BookList />} redirectTo="/login" />} /> 
          <Route path="/adminProfile" element={<ProtectedRoute element={<AdminProfile />} redirectTo="/login" />} />
          <Route path="/userProfile" element={<ProtectedRoute element={<UserProfile />} redirectTo="/login" />} />
          <Route path="*" element={<Navigate to="/" />} /> {}
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App; 
