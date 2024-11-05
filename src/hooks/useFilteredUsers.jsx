import { useState, useEffect } from "react";

const useFilteredUsers = (users, userCourses) => {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (userCourses && users) {
      const filtered = users.filter((user) => {
        if (!user.course) return false;
        const userCourse = user.course.toLowerCase().trim();

        const isMatch = userCourses.some(
          (course) => course.toLowerCase().trim() === userCourse
        );

        return isMatch;
      });

      setFilteredUsers(filtered);
      console.log("Filtered Users:", filtered);
    }
  }, [users, userCourses]);

  return filteredUsers;
};

export default useFilteredUsers;
