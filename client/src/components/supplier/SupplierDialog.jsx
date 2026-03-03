import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { React, useState, Fragment } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmationDialog from "../ConfirmationDialog";

const SupplierDialog = ({ supplier }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const duplicateHandler = () => {};
  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };
  const deleteHandler = () => {};

  const items = [
    {
      label: "Open Supplier",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => navigate(`/suppliers/${supplier._id}`),
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => {}, // TODO: implement edit functionality
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => duplicateHandler(),
    },
  ];

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600">
            <BsThreeDots />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2 z-10">
                {items.map((el) => (
                  <MenuItem key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>
              {/*delete button, only visible to admin users. REPLACE FALSE WITH user?.isAdmin*/}
              <div className="px-1 py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      disabled={false}
                      onClick={() => deleteClicks()}
                      className={`${
                        active ? "bg-red-100 text-red-900" : "text-red-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400`}
                    >
                      <RiDeleteBin6Line
                        className="mr-2 h-5 w-5 text-red-600"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={"Are you sure you want to delete this supplier?"}
        onConfirm={() => deleteClicks()}
      />
    </>
  );
};

export default SupplierDialog;