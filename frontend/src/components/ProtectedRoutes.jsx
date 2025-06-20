// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// const ProtectedRoutes = ({ children }) => {
//     const { user } = useSelector((store) => store.auth);
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!user) {
//             // Redirect to login or home if not authenticated
//             navigate('/login');
//         } else if (user.role !== 'student') {
//             // Redirect to admin dashboard if role isn't student
//             navigate('/admin/companies');
//         } else {
//             setLoading(false);
//         }
//     }, [user, navigate]);

//     if (loading) {
//         return <div>Loading...</div>; // Or a spinner
//     }

//     return <>{children}</>;
// };

// export default ProtectedRoutes;
