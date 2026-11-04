import { useState } from 'react';

type StepVal = {
  title: string;
  status: 'wait' | 'process' | 'finish' | 'error';
  id: number;
};

const defaultVals: StepVal[] = [
  { title: '详细详细', status: 'wait', id: 1 },
  { title: '视频元素', status: 'wait', id: 2 },
  { title: '检查', status: 'wait', id: 3 },
  { title: '公开范围', status: 'wait', id: 4 }
];

export default function Steps() {
  const [stepVals, setStepVals] = useState(defaultVals);
  const [current, setCurrent] = useState(1);

  return (
    <div className='flex justify-between'>
      {stepVals.map((step) => (
        <button
          key={step.id}
          className='hover:bg-accent min-w-32 rounded-md px-4 py-1.5 font-medium'
        >
          <span>{step.title}</span>
          {/* <div className='m-0.5 mx-auto flex size-6 items-center justify-center rounded-full bg-black'>
            <div className='size-3 rounded-full bg-white' />
          </div> */}
          <div className='m-0.5 mx-auto flex size-6 items-center justify-center rounded-full bg-black'>
            <div className='size-3 rounded-full bg-white' />
          </div>
        </button>
      ))}
    </div>
  );
}
