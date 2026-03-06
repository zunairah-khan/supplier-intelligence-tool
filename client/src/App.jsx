import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Users from "./pages/Users.jsx";
import Trash from "./pages/Trash.jsx";
import TaskDetails from "./pages/TaskDetails.jsx";
import SupplyChainMapping from "./pages/SupplyChainMapping.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import SupplierDashboard from "./pages/SupplierDashboard.jsx";
import SupplierDetails from "./pages/SupplierDetails.jsx";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./components/Sidebar.jsx";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./components/Navbar.jsx";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { Fragment, useRef } from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { Transition } from "@headlessui/react";

function Layout() {
  const user = useSelector((state) => state.auth.user); // Accessing user state from Redux store
  const location = useLocation(); // Get current location
  // TODO: Re-enable user authentication check before deployment
  // return user ? (
  return (
    //if user is authenticated, render the layout
    <div className="w-full h-screen flex flex-col md:flex-row">
      {" "}
      {/*main container*/}
      <div className="w-1/6 l:w-1/7 h-screen bg-white sticky top-0 hidden md:block">
        {" "}
        {/*sidebar container*/}
        <Sidebar />
      </div>
      <MobileSidebar />
      <div className="flex-1 overflow-y-auto">
        {" "}
        {/*main content area*/}
        <Navbar />
        <div className="p-4 2xl:px-10">
          {" "}
          {/*padding for main content*/}
          <Outlet /> {/* Outlet renders the matched child route component */}
        </div>
      </div>
    </div>
  );
  // ) : (
  //   <Navigate to="/login" state={{ from: location }} replace />
  // );
}

// the MobileSidebar is only relevant in the context of the Layout, it doesn't need to be a separate component that can be reused elsewhere in the application.
const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth); // Accessing isSidebarOpen state from Redux store
  const mobileMenuRef = useRef(null); // Ref for mobile menu to detect clicks outside of it
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false)); // Dispatching an action to close the sidebar by setting isSidebarOpen to false in the Redux store.
  };

  //transition for mobilesidebar from headless ui
  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-x-10"
        enterTo="opacity-x-100"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-x-100"
        leaveTo="opacity-x-0"
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
              isSidebarOpen ? "translate-x-0" : "translate-x-full",
            )}
            onClick={() => closeSidebar()}
          >
            <div className="bg-white w-3/4 h-full">
              <div className="w-full flex justify-end px-1 mt-0">
                <button
                  onClick={() => closeSidebar()}
                  className="flex justify-end items-end"
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className="-mt-10">
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        {/*layout wrapper for protected routes*/}
        <Route element={<Layout />}>
          {/* Redirect root to dashboard */}{" "}
          <Route index path="/" element={<Navigate to="/supplierdashboard" />} />
          {/*Main application routes which map URLs to components*/}
          <Route path="/supplierdashboard" element={<SupplierDashboard />} />
           <Route path="/supplychainmapping" element={<SupplyChainMapping />} />
           <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          {/*dynamic task routes using status parameter*/}
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/todo/:status" element={<Tasks />} />
          {/*dynamic supplier routes using status parameter*/}
            <Route path="/tier1/:tier" element={<Suppliers />} />
            <Route path="/tier2/:tier" element={<Suppliers />} />
             <Route path="/tier3/:tier" element={<Suppliers />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          {/*dynamic route using taskid parameter*/}
          <Route path="/tasks/:id" element={<TaskDetails />} />
          {/*dynamic route using supplierid parameter*/}
            <Route path="/suppliers/:id" element={<SupplierDetails />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* Global Toaster for Notifications */}
      <Toaster richColors />
    </main>
  );
}

export default App;
