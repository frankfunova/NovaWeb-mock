
import React from 'react';
import { Reservation } from '../../../types';

interface ReservationTableProps {
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
}

const SOURCE_STYLES = {
  Airbnb: 'bg-rose-100 text-rose-700 border-rose-200',
  VRBO: 'bg-blue-100 text-blue-700 border-blue-200',
  Booking: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Direct: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const STATUS_STYLES = {
  Confirmed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-slate-100 text-slate-500',
  Pending: 'bg-amber-100 text-amber-800',
  'Checked In': 'bg-purple-100 text-purple-800',
  'Checked Out': 'bg-gray-100 text-gray-800'
};

export const ReservationTable: React.FC<ReservationTableProps> = ({ reservations, onSelectReservation }) => {
  
  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const month = s.toLocaleDateString('en-US', { month: 'short' });
    const startDay = s.getDate();
    const endDay = e.getDate();
    const endMonth = e.toLocaleDateString('en-US', { month: 'short' });
    const year = s.getFullYear();
    
    if (s.getMonth() === e.getMonth()) {
        return `${month} ${startDay} -${endDay}, ${year}`;
    }
    return `${month} ${startDay} -${endMonth} ${endDay}, ${year}`;
  };

  return (
    <div className="min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-10">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Property
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Reservation ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Dates
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Source
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Guest
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Nights
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700">
                Guest No.
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {reservations.map((res) => (
              <tr 
                key={res.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => onSelectReservation(res)}
              >
                <td className="px-6 py-4 whitespace-nowrap w-10" onClick={(e) => e.stopPropagation()}>
                   <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded bg-slate-200 border border-slate-300"></div>
                     <span className="text-sm font-medium text-slate-900">{res.propertyCode}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                   {res.reservationCode || <span className="opacity-30">-</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                   {formatDateRange(res.startDate, res.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${SOURCE_STYLES[res.source]}`}>
                       {res.source}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                   {res.guestName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                   {res.nights}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${STATUS_STYLES[res.status]}`}>
                       {res.status}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 pl-10">
                   {res.guestCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
