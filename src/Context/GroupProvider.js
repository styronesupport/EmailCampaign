import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groupList, setGroupList] = useState([]);
  const [groupMap, setGroupMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/get-groups-list");
        const groups = res.data.data || [];

        setGroupList(groups);

        // Create groupMap: { groupId: groupName }
        const map = {};
        groups.forEach((group) => {
          map[group.id] = group.title;
        });

        // Save mapping to state and localStorage
        setGroupMap(map);
        localStorage.setItem("groupMap", JSON.stringify(map));

      } catch (err) {
        console.error("Error fetching group list:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <GroupContext.Provider value={{ groupList, groupMap, loading, error }}>
      {children}
    </GroupContext.Provider>
  );
};

// Hook to get just the list
export const useGroupList = () => {
  const context = useContext(GroupContext);
  return context.groupList;
};

// Hook to get full state (list, map, loading, error)
export const useGroupState = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroupState must be used within a GroupProvider");
  }
  return context;
};
