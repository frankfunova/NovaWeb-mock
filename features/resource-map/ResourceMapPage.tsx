
import React, { useState, useEffect } from 'react';
import { MapSidebar } from './components/MapSidebar';
import { MapCanvas } from './components/MapCanvas';
import { api } from '../../services/api';
import { MapProperty, MapStaff } from '../../types';

export const ResourceMapPage: React.FC = () => {
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const [staffList, setStaffList] = useState<MapStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [props, staff] = await Promise.all([
            api.fetchMapProperties(),
            api.fetchMapStaff()
        ]);
        setProperties(props);
        setStaffList(staff);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
      return (
          <div className="flex-1 flex items-center justify-center h-full bg-white">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-slate-500 font-medium">Loading map...</span>
          </div>
      );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
        <MapSidebar properties={properties} staffList={staffList} />
        <MapCanvas properties={properties} staffList={staffList} />
    </div>
  );
};
