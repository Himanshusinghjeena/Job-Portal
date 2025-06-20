import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admins/Companies";
import CreateCompany from "./components/admins/CreateCompany";
import CompanySetup from "./components/admins/CompanySetup";
import UpdateCompany from "./components/admins/UpdateCompany";
import AdminJobs from "./components/admins/AdminJobs";
import PostJob from "./assets/PostJob";
import Applicants from "./components/admins/Applicants";
import ProtectedRoute from "./components/admins/ProtectedRoute";
import StudentProtectedRoute from "./components/students/ProtectedRoute";
import JobsRouteWrapper from "./components/JobsRouteWrapper";
import SavedJobs from "./components/SavedJobs";
import JobPost from "./components/admins/JobPost";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: (
      <JobsRouteWrapper>
        <Jobs />
      </JobsRouteWrapper>
    ),
  },
  {
    path: "/description/:id",
    element: (
            <JobsRouteWrapper>

        <JobDescription />
            </JobsRouteWrapper>

    ),
  },
  {
    path: "/savedJobs",
    element: (
      <StudentProtectedRoute>
        <SavedJobs />
      </StudentProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
    <StudentProtectedRoute>
    <Profile />
    </StudentProtectedRoute>
  ),
  },
  {
    path: "/profile/:userId",
    element:( 
  <ProtectedRoute>
      <Profile />
  </ProtectedRoute>
  ),
  },
  // admin routes
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CreateCompany />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <UpdateCompany />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/update/:id",
    element: (
      <ProtectedRoute>
        <UpdateCompany />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/setup",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin/jobs/create",
    element: (
      <ProtectedRoute>
        <JobPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  
  
]);
function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
