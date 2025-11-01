import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, Plus, LogOut, Send, Hash, User, Lock, Mail, BookOpen, TrendingUp } from 'lucide-react';

const SkillNest = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [communities, setCommunities] = useState([
    { id: 1, name: 'Web Development', description: 'Learn HTML, CSS, JavaScript, and React', members: 1247, color: 'bg-blue-500' },
    { id: 2, name: 'Data Science', description: 'Python, ML, and Analytics', members: 892, color: 'bg-purple-500' },
    { id: 3, name: 'Mobile Development', description: 'iOS, Android, and Flutter', members: 634, color: 'bg-green-500' }
  ]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', github: '' });
  const [showProfile, setShowProfile] = useState(false);
  const [newCommunityForm, setNewCommunityForm] = useState({ name: '', description: '' });
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedCommunity]);

  useEffect(() => {
    if (!selectedCommunity || !currentUser) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const simulatedUsers = ['Alice_Dev', 'Bob_Coder', 'Charlie_ML', 'Diana_Designer'];
        const simulatedMessages = [
          'Has anyone worked with WebSockets before?',
          'Check out this resource I found!',
          'Great discussion today, thanks everyone!',
          'Anyone up for a coding session?',
          'Just finished the React tutorial - amazing!',
          'Looking for a study buddy for this week'
        ];
        
        const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
        const randomMsg = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
        
        if (randomUser !== currentUser.username) {
          addMessage(selectedCommunity.id, randomUser, randomMsg);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedCommunity, currentUser]);

  const addMessage = (communityId, username, text) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      username,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      likedBy: []
    };

    setMessages(prev => ({
      ...prev,
      [communityId]: [...(prev[communityId] || []), newMessage]
    }));
  };

  const handleLikeMessage = (communityId, messageId) => {
    setMessages(prev => ({
      ...prev,
      [communityId]: prev[communityId].map(msg => {
        if (msg.id === messageId) {
          const hasLiked = msg.likedBy?.includes(currentUser.username);
          
          // Update user's total likes
          if (!hasLiked) {
            setCurrentUser(prevUser => ({
              ...prevUser,
              totalLikes: (prevUser.totalLikes || 0) + 1
            }));
          } else {
            setCurrentUser(prevUser => ({
              ...prevUser,
              totalLikes: Math.max(0, (prevUser.totalLikes || 0) - 1)
            }));
          }
          
          return {
            ...msg,
            likes: hasLiked ? msg.likes - 1 : msg.likes + 1,
            likedBy: hasLiked 
              ? msg.likedBy.filter(user => user !== currentUser.username)
              : [...(msg.likedBy || []), currentUser.username]
          };
        }
        return msg;
      })
    }));
  };

  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      const user = { 
        username: loginForm.email.split('@')[0], 
        email: loginForm.email,
        loginTime: new Date().toLocaleString(),
        totalLikes: 0
      };
      setCurrentUser(user);
      
      // Track login in analytics
      setUserAnalytics(prev => [...prev, {
        ...user,
        id: Date.now(),
        action: 'login'
      }]);
      
      setCurrentView('dashboard');
      setLoginForm({ email: '', password: '' });
    }
  };

  const handleRegister = () => {
    if (registerForm.username && registerForm.email && registerForm.password && registerForm.github) {
      const user = { 
        username: registerForm.username, 
        email: registerForm.email,
        github: registerForm.github,
        loginTime: new Date().toLocaleString(),
        totalLikes: 0
      };
      setCurrentUser(user);
      
      // Track registration in analytics
      setUserAnalytics(prev => [...prev, {
        ...user,
        id: Date.now(),
        action: 'register'
      }]);
      
      setCurrentView('dashboard');
      setRegisterForm({ username: '', email: '', password: '', github: '' });
    }
  };

  const handleAdminLogin = () => {
    // Admin credentials: username: admin, password: admin123
    if (adminLoginForm.username === 'admin' && adminLoginForm.password === 'admin123') {
      setIsAdmin(true);
      setCurrentView('admin-dashboard');
      setAdminLoginForm({ username: '', password: '' });
    } else {
      alert('Invalid admin credentials');
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && selectedCommunity && currentUser) {
      addMessage(selectedCommunity.id, currentUser.username, currentMessage);
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const joinCommunity = (community) => {
    setSelectedCommunity(community);
    if (!messages[community.id]) {
      setMessages(prev => ({
        ...prev,
        [community.id]: [
          { id: 1, username: 'System', text: `Welcome to ${community.name}!`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }));
    }
  };

  const handleCreateCommunity = () => {
    if (newCommunityForm.name && newCommunityForm.description) {
      const newCommunity = {
        id: communities.length + 1,
        name: newCommunityForm.name,
        description: newCommunityForm.description,
        members: 1,
        color: ['bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500'][Math.floor(Math.random() * 4)]
      };
      setCommunities([...communities, newCommunity]);
      setNewCommunityForm({ name: '', description: '' });
      setShowCreateCommunity(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedCommunity(null);
    setIsAdmin(false);
    setCurrentView('landing');
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white mb-16">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="w-16 h-16 mr-4" />
              <h1 className="text-6xl font-bold">SkillNest</h1>
            </div>
            <p className="text-2xl mb-8">Community-Driven Learning Platform</p>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join skill-based communities, learn together, and grow through collaborative roadmaps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-white">
              <Users className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Community Learning</h3>
              <p className="opacity-90">Join communities of learners with shared interests and goals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-white">
              <MessageCircle className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Real-Time Chat</h3>
              <p className="opacity-90">Connect instantly with peers through live messaging</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-white">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Structured Roadmaps</h3>
              <p className="opacity-90">Follow curated learning paths designed by experts</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentView('login')}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition"
            >
              Register
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentView('admin-login')}
              className="text-white/70 hover:text-white text-sm underline"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'admin-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-800" />
            <h2 className="text-3xl font-bold text-gray-800">Admin Access</h2>
            <p className="text-gray-600 mt-2">Enter admin credentials</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={adminLoginForm.username}
                onChange={(e) => setAdminLoginForm({...adminLoginForm, username: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleAdminLogin)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={adminLoginForm.password}
                onChange={(e) => setAdminLoginForm({...adminLoginForm, password: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleAdminLogin)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleAdminLogin}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition"
            >
              Login as Admin
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-gray-600 hover:underline"
            >
              Back to home
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Username: <span className="font-mono">admin</span></p>
            <p>Password: <span className="font-mono">admin123</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'admin-dashboard') {
    const totalUsers = userAnalytics.length;
    const totalLogins = userAnalytics.filter(a => a.action === 'login').length;
    const totalRegistrations = userAnalytics.filter(a => a.action === 'register').length;
    const totalLikesGiven = userAnalytics.reduce((sum, user) => sum + (user.totalLikes || 0), 0);

    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 shadow-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="w-8 h-8 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Logins</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalLogins}</p>
                </div>
                <LogOut className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Registrations</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalRegistrations}</p>
                </div>
                <User className="w-12 h-12 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Likes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{totalLikesGiven}</p>
                </div>
                <MessageCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>

          {/* User Activity Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">User Activity Log</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GitHub
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Likes Given
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Login Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAnalytics.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No user activity yet. Users will appear here after they register or login.
                      </td>
                    </tr>
                  ) : (
                    userAnalytics.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.github ? (
                            <a 
                              href={`https://github.com/${user.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline"
                            >
                              @{user.github}
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.action === 'register' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            ❤️ {user.totalLikes || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.loginTime}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Login to continue learning</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Login
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('register')}
              className="text-purple-600 hover:underline"
            >
              Don't have an account? Register
            </button>
            <br />
            <button
              onClick={() => setCurrentView('landing')}
              className="text-gray-600 hover:underline mt-2"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800">Join SkillNest</h2>
            <p className="text-gray-600 mt-2">Start your learning journey today</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                GitHub Username
              </label>
              <input
                type="text"
                value={registerForm.github}
                onChange={(e) => setRegisterForm({...registerForm, github: e.target.value})}
                onKeyPress={(e) => handleKeyPress(e, handleRegister)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="yourusername"
              />
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Register
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView('login')}
              className="text-purple-600 hover:underline"
            >
              Already have an account? Login
            </button>
            <br />
            <button
              onClick={() => setCurrentView('landing')}
              className="text-gray-600 hover:underline mt-2"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">SkillNest</h1>
        </div>
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">{currentUser?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowProfile(false)}>
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">{currentUser?.username}</h2>
              <p className="text-gray-600 mt-2">{currentUser?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">GitHub Profile</h3>
                <a 
                  href={`https://github.com/${currentUser?.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  @{currentUser?.github}
                </a>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Member Since</h3>
                <p className="text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Communities Joined</h3>
                <p className="text-gray-800">{communities.length}</p>
              </div>
            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateCommunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateCommunity(false)}>
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Community</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Community Name</label>
                <input
                  type="text"
                  value={newCommunityForm.name}
                  onChange={(e) => setNewCommunityForm({...newCommunityForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="e.g., Machine Learning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCommunityForm.description}
                  onChange={(e) => setNewCommunityForm({...newCommunityForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Describe what this community is about..."
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateCommunity}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateCommunity(false);
                  setNewCommunityForm({ name: '', description: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b">
            <button
              onClick={() => setShowCreateCommunity(true)}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Community
            </button>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Your Communities</h2>
            <div className="space-y-3">
              {communities.map(community => (
                <div
                  key={community.id}
                  onClick={() => joinCommunity(community)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedCommunity?.id === community.id
                      ? 'bg-purple-100 border-2 border-purple-600'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 ${community.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Hash className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{community.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{community.description}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{community.members} members</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          {selectedCommunity ? (
            <>
              <div className="bg-white shadow px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${selectedCommunity.color} rounded-lg flex items-center justify-center`}>
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedCommunity.name}</h2>
                    <p className="text-sm text-gray-600">{selectedCommunity.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {(messages[selectedCommunity.id] || []).map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.username === currentUser?.username ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.username !== currentUser?.username && msg.username !== 'System' && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-md ${
                      msg.username === 'System' 
                        ? 'bg-blue-100 text-blue-800 text-center px-4 py-2 rounded-full text-sm'
                        : msg.username === currentUser?.username
                        ? 'bg-purple-600 text-white'
                        : 'bg-white'
                    } ${msg.username !== 'System' ? 'rounded-lg shadow px-4 py-3' : ''}`}>
                      {msg.username !== 'System' && (
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-sm">{msg.username}</span>
                          <span className="text-xs opacity-70">{msg.timestamp}</span>
                        </div>
                      )}
                      <p className={msg.username === 'System' ? '' : 'text-sm'}>{msg.text}</p>
                      {msg.username !== 'System' && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                          <button
                            onClick={() => handleLikeMessage(selectedCommunity.id, msg.id)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition ${
                              msg.likedBy?.includes(currentUser?.username)
                                ? 'bg-red-500 text-white'
                                : msg.username === currentUser?.username
                                ? 'bg-white/20 hover:bg-white/30'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            ❤️ {msg.likes || 0}
                          </button>
                        </div>
                      )}
                    </div>
                    {msg.username === currentUser?.username && (
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="bg-white border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">Select a Community</h3>
                <p className="text-gray-500">Choose a community from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SkillNest;