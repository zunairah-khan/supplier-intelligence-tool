import { Dialog, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion } from "react-icons/fa";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";

export default function ConfirmationDialog ({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
  setMsg = () => {},
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}> 
        <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
          <DialogTitle as='h3' className=''>
            <p
              className={clsx(
                "p-3 rounded-full ",
                type === "restore" || type === "restoreAll"
                  ? "text-blue-600 bg-blue-100"
                  : "text-red-600 bg-red-200"
              )}
            >
              <FaQuestion size={60} />
            </p>
          </DialogTitle>

          <p className='text-center text-gray-500'>
            {msg ?? "Are you sure you want to delete the selected record?"}
          </p>

          <div className='bg-white py-3 sm:flex sm:flex-row-reverse gap-4'>
            <Button
              type='button'
              className={clsx(
                " px-7 h-7 text-sm font-semibold text-white sm:w-auto rounded",
                type === "restore" || type === "restoreAll"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-red-600 hover:bg-red-500"
              )}
              onClick={onClick}
              label={type === "restore" ? "Restore" : type === "restoreAll" ? "Restore All" : "Delete"} 
            />

            <Button
              type='button'
              className='bg-gray-100 px-7 h-7 text-sm font-semibold text-gray-900 sm:w-auto rounded'
              onClick={() => closeDialog()}
              label='Cancel'
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
          <DialogTitle as='h3' className=''>
            <p className={clsx("p-3 rounded-full ", "text-red-600 bg-red-200")}>
              <FaQuestion size={40} />
            </p>
          </DialogTitle>

          <p className='text-center text-gray-500'>
            {"Are you sure you want to activate/deactive this account?"}
          </p>

          <div className='bg-gray-50 py-3 sm:flex sm:flex-row-reverse gap-4'>
            <Button
              type='button'
              className={clsx(
                " px-8 text-sm font-semibold text-white sm:w-auto rounded",
                "bg-red-600 hover:bg-red-500"
              )}
              onClick={onClick}
              label={"Yes"}
            />

            <Button
              type='button'
              className='bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto border rounded'
              onClick={() => closeDialog()}
              label='No'
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}