import { useEffect, useState } from "react";
import { Breadcrumb, Card, Container, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import useFetchUsers from "../hooks/useFetchUsers";
import useUserDocument from "../hooks/useUserDocument";
import useFilteredUsers from "../hooks/useFilteredUsers";

import FilterDropdown from "../components/CourseFilter";
import DetailsModal from "../components/DetailsModal";

import { firestore } from "../services/Firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

function UserApproval() {
  const { users, loading, error } = useFetchUsers();
  const { userCourses, userRole, error: isError } = useUserDocument();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useFilteredUsers(users, userCourses);

  useEffect(() => {
    if (isError) {
      console.error("Error encountered while checking document:", isError);
    }
  }, [isError]);

  const handleFilterSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleViewDetails = (user) => {
    console.log("User selected:", user);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleApprove = async (user) => {
    console.log("Selected user: ", user);
    if (!user) {
      toast.error("No user selected!");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.id);
      await updateDoc(userRef, { isApproved: true });
      toast.success("User approved!");
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Error approving user.");
    }
  };

  const handleDecline = async (user) => {
    if (user) {
      const userRef = doc(firestore, "users", user.id);
      await deleteDoc(userRef);
      toast.error("User declined and removed from the database.");
    }
  };

  const filteredUsersTable = selectedCourse
    ? filteredUsers.filter(
        (user) =>
          user.course &&
          user.course.toLowerCase() === selectedCourse.toLowerCase()
      )
    : filteredUsers.filter((user) =>
        userCourses.some(
          (course) =>
            course &&
            user.course &&
            course.toLowerCase() === user.course.toLowerCase()
        )
      );

  const displayedUsers =
    userRole === "subadmin"
      ? filteredUsersTable
      : selectedCourse
      ? users.filter(
          (user) =>
            user.course &&
            user.course.toLowerCase() === selectedCourse.toLowerCase()
        )
      : users;

  return (
    <Container className="mt-5">
      <Breadcrumb>
        <Breadcrumb.Item active>User Approval</Breadcrumb.Item>
      </Breadcrumb>

      {loading && <Spinner animation="border" />}

      <div>
        {!loading && !error && (
          <Card>
            <Card.Body>
              <Table
                className="cursor-pointer"
                id="students-table"
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th>Student/Employee</th>
                    <th>
                      Course/Department{" "}
                      <FilterDropdown
                        onSelect={handleFilterSelect}
                        currentUserCourses={userCourses}
                      />
                    </th>
                    <th>Student ID</th>
                    <th>Year Level</th>
                    <th>Email</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.firstName}</td>
                        <td>{user.course || user.department}</td>
                        <td>{user.studentId}</td>
                        <td>{user.year}</td>
                        <td>{user.email}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleViewDetails(user)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleApprove(user)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDecline(user)}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </div>

      <DetailsModal
        show={showModal}
        onHide={handleCloseModal}
        user={selectedUser}
      />
    </Container>
  );
}

export default UserApproval;
