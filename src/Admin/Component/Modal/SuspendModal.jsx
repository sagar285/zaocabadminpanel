  import React, { useState } from 'react';


const SuspendModal = ({ visible, setvisible, handleSuspend }) => {
  const [reason, setReason] = useState('');
  const [suspendDate, setSuspendDate] = useState('');
  const [suspendTime, setSuspendTime] = useState('');
  const [TosuspendDate,TosetSuspendDate]=useState('');
  const [TosuspendTime,TosetSuspendTime]=useState('');
  const [isPermanentlySuspended,setIsPermanantlySuspended]= useState(false);
  

  const onTogglePermanantSuspension = () => {
    setIsPermanantlySuspended(!isPermanentlySuspended);

  };

  const onSubmit = () => {
    if (reason) {
      handleSuspend({ reason, suspendDate, suspendTime,TosuspendDate,TosuspendTime ,isPermanentlySuspended});
      setvisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Suspend Account</h2>
          <button 
            onClick={() => setvisible(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Suspension
            </label>
            <input 
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter suspension reason"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input 
              type="date"
              value={suspendDate}
              onChange={(e) => setSuspendDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input 
              type="date"
              value={TosuspendDate}
              onChange={(e) => TosetSuspendDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Time
            </label>
            <input 
              type="time"
              value={suspendTime}
              onChange={(e) => setSuspendTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Time
            </label>
            <input 
              type="time"
              value={TosuspendTime}
              onChange={(e) => TosetSuspendTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
        
              <input
                type="checkbox"
                checked={isPermanentlySuspended}
                className="form-checkbox"
                onChange={(e) => onTogglePermanantSuspension(e)}
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                Permanently Suspend Account
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={() => setvisible(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={onSubmit}
              disabled={!reason}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suspend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendModal;