import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Recipes from './pages/ManageItems'; // Import Recipes component
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';
import { Link } from 'react-router-dom';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        {/* Navbar with links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/recipes">ManageItems</Link></li> 
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/chat" 
            element={user ? <Chat /> : <Navigate to="/login" replace />} 
          />
          <Route path="/recipes" element={<Recipes />} /> {/* Add Recipes route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
