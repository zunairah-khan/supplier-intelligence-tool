import React from 'react'
import { Tab, TabGroup, TabPanels, TabList } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setSelected, children }) {
  return (
    <div className='w-full px-1 sm:px-0 flex flex-col min-h-0 h-full'>
      <TabGroup className="flex flex-col min-h-0 h-full">
        <TabList className='flex space-x-6 rounded-xl p-1 shrink-0'>
          {tabs.map((tab, index) => (
            <Tab
              key={tab.title}
              onClick={() => setSelected(index)}
              className={({ selected }) =>
                classNames(
                  "w-fit flex items-center outline-none gap-2 px-3 py-2.5 text-base font-medium leading-5 bg-white",
                  selected
                    ? "text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-800 hover:text-blue-800"
                )
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </TabList>

        {/* flex-1 and min-h-0 allow the panel to fill remaining height
            after the tab list without overflowing */}
        <TabPanels className='w-full mt-2 flex-1 min-h-0'>
          {children}
        </TabPanels>
      </TabGroup>
    </div>
  );
}