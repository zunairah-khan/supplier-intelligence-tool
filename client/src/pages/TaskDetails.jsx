import React, { useState } from "react";
import clsx from "clsx";
import moment from "moment";
import { FaBug, FaThumbsUp, FaUser, FaList } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
  MdAttachFile,
  MdOpenInNew,
} from "react-icons/md";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoChevronBackCircle } from "react-icons/io5";
import { BiMessageAltDetail } from "react-icons/bi";
import { Menu } from "@headlessui/react";
import { MdKeyboardArrowDown as MdChevron } from "react-icons/md";
import Button from "../components/Button";
import { TASK_TYPE, getInitials, BGS } from "../utils";
import { suppliers } from "../assets/data";
import { actions } from "../assets/data";
import { getSupplierActions } from "../utils/getSupplierActions";

const PRIORITY_COLOUR = {
  High: "bg-red-600",
  Medium: "bg-yellow-600",
  Low: "bg-blue-400",
};

const PRIORITY_ICONS = {
  High: <MdKeyboardDoubleArrowUp size={14} />,
  Medium: <MdKeyboardArrowUp size={14} />,
  Low: <MdKeyboardArrowDown size={14} />,
};

const STAGE_LABEL = {
  todo: "To Do",
  "in progress": "In Progress",
  completed: "Completed",
};

const STAGE_OPTIONS = ["todo", "in progress", "completed"];

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState(null);

  const allActions = getSupplierActions(actions, suppliers);
  const task = allActions.find((t) => t._id === id);

  if (!task) {
    return <div className="text-red-600">Error: Action not found</div>;
  }

  const linkedSupplier = suppliers.find((s) => s._id === task.FK_supplier_id);
  const currentStage = stage || task?.stage;

  return (
    <div className="w-full flex flex-col gap-3 h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={() => navigate(-1)}
          label=""
          icon={<IoChevronBackCircle className="text-4xl text-gray-700 hover:text-gray-500" />}
          className="flex rounded-full items-center text-white"
        />
          <h1 className="text-2xl text-gray-600 font-semibold">{task?.title}</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="w-full flex flex-col xl:flex-row gap-5 bg-white shadow rounded-md p-6 min-h-full">

          {/* LEFT */}
          <div className="w-full xl:w-1/2 flex flex-col gap-5">

            {/* Tags row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={clsx(
                "flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap",
                PRIORITY_COLOUR[task?.priority]
              )}>
                {PRIORITY_ICONS[task?.priority]}
                {task?.priority} Priority
              </span>

              {linkedSupplier && (
                <Link
                  to={`/suppliers/${linkedSupplier._id}`}
                  className="text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {linkedSupplier.name}
                </Link>
              )}

              {/* Status dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600">
                  <div className={clsx("w-2 h-2 rounded-full shrink-0", TASK_TYPE[currentStage])} />
                  {STAGE_LABEL[currentStage]}
                  <MdChevron size={14} />
                </Menu.Button>
                <Menu.Items className="absolute left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1 outline-none">
                  {STAGE_OPTIONS.map((option) => (
                    <Menu.Item key={option}>
                      {({ active }) => (
                        <button
                          onClick={() => setStage(option)}
                          className={clsx(
                            "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors",
                            active ? "bg-gray-50" : "",
                            currentStage === option ? "text-blue-600" : "text-gray-700"
                          )}
                        >
                          <div className={clsx("w-2 h-2 rounded-full shrink-0", TASK_TYPE[option])} />
                          {STAGE_LABEL[option]}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Due:</span>
                <span className="text-sm text-gray-600 font-medium">
                  {new Date(task?.date).toDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex items-center gap-1 text-xs">
                  <BiMessageAltDetail size={14} />
                  <span>{task?.comments?.length}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MdAttachFile size={14} />
                  <span>{task?.assets?.length}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {task?.description && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Assignees */}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                Assignees
              </p>
              <div className="flex flex-col gap-2">
                {task?.team?.map((m, index) => (
                  <div key={index + m?._id} className="flex items-center gap-3">
                    <div className={clsx(
                      "w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-semibold shrink-0",
                      BGS[index % BGS?.length]
                    )}>
                      {getInitials(m?.name)}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{m?.name}</p>
                      <span className="text-gray-300">·</span>
                      <p className="text-xs text-gray-500 truncate">{m?.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                Assets
              </p>
              {task?.assets?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {task?.assets?.map((el, index) => (
                    <a
                      key={index}
                      href={el}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors group min-w-48 max-w-xs"
                    >
                      <MdAttachFile size={16} className="text-gray-400 group-hover:text-blue-500 shrink-0" />
                      <span className="text-sm text-gray-700 font-medium truncate flex-1">
                        Asset {index + 1}
                      </span>
                      <MdOpenInNew size={14} className="text-gray-400 group-hover:text-blue-500 shrink-0" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No assets attached.</p>
              )}
            </div>
          </div>

          {/* RIGHT — Narrative */}
          <div className="w-full xl:w-1/2 flex flex-col gap-4">
            <Narrative comments={task?.comments} id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Narrative = ({ comments, id }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {};

  // Find user name from team — in production this would come from auth context
  const getUserName = (userId) => {
    return "User";
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        Narrative
      </p>

      {/* Comment chain */}
      <div className="flex flex-col flex-1">
        {comments?.length > 0 ? (
          comments.map((item, index) => (
            <div key={item._id || index} className="flex gap-3">

              {/* Avatar + connector line */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {getInitials(item?.FK_user_id?.name || "User")}
                </div>
                {index < comments.length - 1 && (
                  <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                )}
              </div>

              {/* Comment content */}
              <div className={clsx("flex flex-col gap-1", index < comments.length - 1 ? "pb-5" : "pb-0")}>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {item?.FK_user_id?.name || "User"}
                  </p>
                  <span className="text-xs text-gray-400">
                    {moment(item?.date).fromNow()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item?.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic mb-4">No comments yet.</p>
        )}

        {/* Add comment — always at bottom of chain */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-semibold shrink-0">
            You
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border border-gray-200 outline-none p-3 rounded-lg text-sm focus:ring-2 ring-blue-500 resize-none bg-gray-50 focus:bg-white transition-colors"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                label="Submit"
                onClick={handleSubmit}
                className="bg-blue-600 text-white rounded-md px-4 py-1.5 text-sm font-semibold hover:bg-blue-700 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;