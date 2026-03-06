import React, { use } from "react";
import {
  MdDashboard,
  MdOutlineTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdOutlineAddTask,
} from "react-icons/md"; //md - material design icons
import { FaTasks, FaUsers, FaTrashAlt,FaBoxes,FaBoxOpen } from "react-icons/fa"; //fa - font awesome icons
import { FaArrowsTurnToDots } from "react-icons/fa6";
import { PiNumberCircleOneFill, PiNumberCircleTwoFill, PiNumberCircleThreeFill  } from "react-icons/pi";
import { IoBarChart } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux"; //hooks to interact with redux store
import { Link, useLocation } from "react-router-dom"; //hook to get current location
import { setOpenSidebar } from "../redux/slices/authSlice.js"; //action to set sidebar open/close state in the redux store
import clsx from "clsx";

//importing icons from react-icons for the sidebar links
const linkData = [
  {
    label: "Supplier Dashboard",
    link: "supplierdashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Supplier Directory",
    link: "suppliers",
    icon: <FaBoxOpen />,
  },
  {
    label: "Tier 1 Suppliers",
    link: "tier1/1",
    icon: <PiNumberCircleOneFill />,
  },
  {    label: "Tier 2 Suppliers",
    link: "tier2/2",
    icon: <PiNumberCircleTwoFill />,
  },
  {
    label: "Tier 3 Suppliers",
    link: "tier3/3",
    icon: <PiNumberCircleThreeFill />,
  },
  {
    label: "Supply Chain Mapping",
    link: "supplychainmapping",
    icon: <FaBoxes />,
  },
  {
    label: "Action Tracking Dashboard",
    link: "dashboard",
    icon: <IoBarChart />,
  },
  {
    label: "Actions",
    link: "tasks",
    icon: <FaTasks />,
  },
  /*{
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  */
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user); // Accessing user state from Redux store
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
  const location = useLocation(); // Hook to get the current location object
  const path = location.pathname.split("/")[1]; // Extracting the first segment of the path to determine the active link. the path is the current url pathname. (e.g., "dashboard", "tasks", etc.)
  const sidebarLinks =  true ? linkData : linkData.slice(0, 5); //if user is admin, show all links, else show only first 5 links. replace true with user?.isAdmin when authentication is implemented
  const closeSidebar = () => {
    dispatch(setOpenSidebar(false)); // Dispatching an action to close the sidebar by setting isSidebarOpen to false in the Redux store.
  };

  // NavLink component for individual sidebar links. Receives a link object as a prop and renders a link with icon and label. 
  const NavLink = ({ el }) => {
    return (
      <Link 
      onClick={closeSidebar} 
      to={el.link} 
      className={clsx("w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800  text-sm hover:bg-[#2564ed2d]", path===el.link.split("/")[0] ? "bg-blue-600 text-white" : "" 
      )}> {/*the className is set based on whether the link is active (current path matches link path) or not*/}
      
        {el.icon} {/* Render the icon for the link */}
        <span className="hover:text-[#2564ed]">{el.label}</span> {/* Render the label for the link */}
      </Link>
    );
  }
 
  // Sidebar component JSX. app name and icon at the top, followed by navigation links and settings at the bottom. 
  return (
    <div className='w-full h-full flex flex-col gap-6 p-5'>
      <h1 className='flex gap-2 items-center'>
        <p className='bg-gray-800 p-2 rounded-full'>
          <FaArrowsTurnToDots className='text-yellow-300 text-2xl font-black' />
        </p>
        <span className='text-xl font-bold text-black italic '>
          Supply.EY 
        </span>
      </h1>

      <div className='flex-1 flex flex-col gap-y-5 py-6'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div className=''>
        <button className='w-full flex gap-2 p-2 items-center text-md text-gray-800'>
          <MdSettings />
          <span>Settings</span>
        </button>
      </div>
    </div> 
  );
};
export default Sidebar;
