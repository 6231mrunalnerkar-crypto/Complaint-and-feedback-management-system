function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    institution: user.institution,
    dateOfBirth: user.dateOfBirth,
    age: user.age,
    address: user.address,
    rollNumber: user.rollNumber,
    email: user.email,
    contact: user.contact,
    identityProofName: user.identityProofName,
    identityProofSubmitted: user.identityProofSubmitted,
    role: user.role,
    department: user.department,
    accountStatus: user.accountStatus,
    registeredOn: user.createdAt,
  };
}

function complaintToClient(complaint) {
  const c = complaint.toObject ? complaint.toObject() : complaint;
  return {
    ...c,
    id: c.referenceId,
    subject: c.title,
    anonymous: c.isAnonymous,
    date: c.createdAt,
    submittedBy: c.submittedBy
      ? {
          id: c.submittedBy._id || c.submittedBy,
          name: c.submittedSnapshot?.name || "",
          email: c.submittedSnapshot?.email || "",
          rollNumber: c.submittedSnapshot?.rollNumber || "",
          phone: c.submittedSnapshot?.phone || "",
        }
      : c.submittedSnapshot || {},
    assignedStaff: c.assignedStaff
      ? {
          id: c.assignedStaff._id || c.assignedStaff,
          name: c.assignedStaff.name || "",
          email: c.assignedStaff.email || "",
          department: c.assignedStaff.department || "",
        }
      : null,
  };
}

module.exports = { normalizeUser, complaintToClient };