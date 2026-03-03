import React from 'react'
import TaskCard from './TaskCard';
import SupplierCard from './SupplierCard';

const GridView = ({tasks, suppliers}) => {
  const data = tasks || suppliers;
  const isTask = !!tasks;

  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
        {
            data?.map((item, index) => (
                isTask ? (
                  <TaskCard task={item} key={index}/>
                ) : (
                  <SupplierCard supplier={item} key={index}/>
                )
            )) 
        }
    </div>
  )
}

export default GridView;

