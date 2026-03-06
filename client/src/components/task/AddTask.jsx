import ModalWrapper from "../ModalWrapper";
import { DialogTitle } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import { React, useState } from "react";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";

const STAGES = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITIES = ["HIGH", "MEDIUM",  "LOW"];

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen }) => {
  const task = "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || STAGES[0]);

  const submitHandler = () => {};

  const handleSelect = () => {
    setAssets(e.target.files);
  };
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITIES[2],
  );

  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <DialogTitle
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </DialogTitle>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder=""
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors?.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={STAGES}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Due Date"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Due Date is required",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>


            <div className="flex gap-4">
                <SelectList
                  label="Priority"
                  lists={PRIORITIES}
                  selected={priority}
                  setSelected={setPriority}
                />

                <div className="w-full flex items-center justify-center mt-4">
                  <label
                    className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                    htmlFor="imgUpload"
                  >
                    <input
                      type="file"
                      className="hidden"
                      id="imgUpload"
                      onChange={(e) => handleSelect(e)}
                      accept=".jpg, .png, .jpeg"
                      multiple={true}
                    />
                    <BiImages />
                    <span>Add Assets</span>
                  </label>
                </div>
              </div>

            <div className='bg-white py-6 sm:flex sm:flex-row-reverse gap-4'>
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
                  Uploading Assets
                </span>):(
              <Button
                label='Submit'
                type='submit'
                className='bg-blue-600 px-7 h-7 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto rounded'
              />
              )}

              <Button
                type='button'
                className='bg-gray-100 px-7 h-7 text-sm font-semibold text-gray-900 sm:w-auto rounded'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
