
import React, { useEffect, useState } from 'react';

const MyAccount: React.FC = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    fetch('/api/user') 
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user data:', err));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      
    </div>
  );
};

export default MyAccount;
