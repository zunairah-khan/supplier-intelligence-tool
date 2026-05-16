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

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = ["Started", "Completed", "In Progress", "Commented", "Bug", "Assigned"];

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const allActions = getSupplierActions(actions, suppliers);
  const task = allActions.find((t) => t._id === id);

  if (!task) {
    return <div className="text-red-600">Error: Action not found</div>;
  }

  const linkedSupplier = suppliers.find((s) => s._id === task.FK_supplier_id);

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
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl text-gray-600 font-semibold">{task?.title}</h1>
            
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="w-full flex flex-col xl:flex-row gap-5 bg-white shadow rounded-md p-6 h-full shrink-0">

          {/* LEFT */}
          <div className="w-full xl:w-2/3 flex flex-col gap-5">

            {/* Tags row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={clsx(
                "flex items-center gap-1 text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap",
                PRIORITY_COLOUR[task?.priority]
              )}>
                {PRIORITY_ICONS[task?.priority]}
                {task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1)} Priority
              </span>

              {linkedSupplier && (
                <Link
                  to={`/suppliers/${linkedSupplier._id}`}
                  className="text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {linkedSupplier.name}
                </Link>
              )}

             
            </div>

            {/* Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>{new Date(task?.date).toDateString()}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <BiMessageAltDetail size={14} />
                  <span>{task?.comments?.length}</span>
                </div>
                <div className="flex items-center gap-1">
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

            {/* Team */}
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
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {m?.name}
                      </p>
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
                      className="flex w-auto max-w-[18rem] min-w-48 items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors group min-h-18"
                    >
                      <MdAttachFile
                        size={16}
                        className="text-gray-400 group-hover:text-blue-500 shrink-0"
                      />
                      <span className="text-sm text-gray-700 font-medium truncate">
                        Asset {index + 1}
                      </span>
                      <MdOpenInNew
                        size={14}
                        className="text-gray-400 group-hover:text-blue-500 shrink-0"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No assets attached.</p>
              )}
            </div>

            
          </div>

          {/* RIGHT — Activities */}
          <div className="w-full xl:w-1/2 flex flex-col gap-4 ">
            <Comments comment={task?.comments} id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Comments = ({ comment, id }) => {

  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");

  const handleSubmit = async () => {};

  const Card = ({ item }) => (
    <div className="flex space-x-4">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-10 h-10 flex items-center justify-center">
          {TASKTYPEICON[item?.type]}
        </div>
        <div className="w-full flex items-center h-20">
          <div className="w-0.5 bg-gray-200 h-full ml-5" />
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-8">
        <p className="font-semibold text-gray-800">{item?.FK_user_id?.name}</p>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <span className="capitalize">{item?.type}</span>
          <span>·</span>
          <span>{moment(item?.date).fromNow()}</span>
        </div>
        <p className="text-sm text-gray-700 mt-1">{item?.comment}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full md:flex gap-10 px-6 py-6 bg-white shadow rounded-md justify-between">
      <div className="w-full md:w-2/3">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-5">
          Narrative
        </p>
        <div className="w-full">
          {comment?.length > 0 ? (
            comment.map((el, index) => <Card key={index} item={el} />)
          ) : (
            <p className="text-gray-500 italic text-sm">No comments logged yet.</p>
          )}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-5">
          Add Comment
        </p>
        <div className="w-full flex flex-wrap gap-4">
          {act_types.map((item) => (
            <div key={item} className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600"
                checked={selected === item}
                onChange={() => setSelected(item)}
              />
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a note..."
            className="bg-white w-full mt-4 border border-gray-200 outline-none p-4 rounded-lg text-sm focus:ring-2 ring-blue-500 resize-none"
          />
          <Button
            type="button"
            label="Submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;