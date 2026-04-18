import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";

// Navbar component that contains the search bar and user avatar
const Navbar = () => {
  const { user }  = useSelector((state) => state.auth); {/* Accessing user state from Redux store */}
  const dispatch = useDispatch(); {/* Hook to dispatch actions to the Redux store */}

// Navbar layout with search bar and user avatar
  return (
    <div className='w-full left-0 right-0 flex justify-between bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0'>
      <div className="flex gap-4">
        <div className=''>
          <button
            onClick={() => dispatch(setOpenSidebar(true))}
            className='text-2xl text-gray-500 block md:hidden'
          >
            ☰
          </button>
        </div>
        </div>
    {/*User avatar and notification panel*/}
      <div className='flex gap-2 items-center'>
        <NotificationPanel />

        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;