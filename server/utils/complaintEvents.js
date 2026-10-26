const getId = (value) => {
    if (!value) {
        return null;
    }

    return String(value._id || value);
};

const emitComplaintEvent = (io, complaint, eventName = 'complaint:updated') => {
    if (!io || !complaint) {
        return;
    }

    const complaintId = getId(complaint._id);

    if (!complaintId) {
        return;
    }

    const rooms = new Set(['admins']);
    const ownerId = getId(complaint.raisedBy);
    const assignedStaffId = getId(complaint.assignedTo);

    if (ownerId) {
        rooms.add(`user:${ownerId}`);
    }

    if (assignedStaffId) {
        rooms.add(`user:${assignedStaffId}`);
    }

    const payload = { complaintId };

    rooms.forEach((room) => {
        io.to(room).emit(eventName, payload);
    });
};

module.exports = { emitComplaintEvent };