import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const FilterDropdown = ({ onSelect }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelect = (course) => {
    onSelect(course);
    setShowDropdown(false);
  };

  const courses = ["CITE", "CCJE", "CHUMS", "CTE", "CHTM", "CAS", "CEA", "COP"];

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <FilterAltIcon onClick={toggleDropdown} style={{ cursor: "pointer" }} />
      {showDropdown && (
        <Dropdown.Menu
          show
          style={{
            position: "absolute",
            top: "30px",
            right: "0",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <Dropdown.Item onClick={() => handleSelect("")}>
            All Courses
          </Dropdown.Item>
          {courses.map((course) => (
            <Dropdown.Item key={course} onClick={() => handleSelect(course)}>
              {course}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};

export default FilterDropdown;
