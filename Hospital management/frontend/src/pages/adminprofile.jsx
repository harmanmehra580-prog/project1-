import { FiLogOut, FiMail, FiShield, FiUser } from "react-icons/fi";

function AdminProfile({ user, onLogout }) {
  return (
    <section className="admin-profile panel">
      <div className="admin-profile-heading">
        <div className="admin-profile-avatar">CA</div>
        <div>
          <p className="eyebrow">Account</p>
          <h2>Admin Profile</h2>
          <p>Manage your CarePoint account details.</p>
        </div>
      </div>
      <div className="admin-profile-details">
        <div><FiUser /><span><small>Name</small><strong>{user.name}</strong></span></div>
        <div><FiMail /><span><small>Email</small><strong>{user.email}</strong></span></div>
        <div><FiShield /><span><small>Role</small><strong>{user.role}</strong></span></div>
      </div>
      <button className="topbar-logout" type="button" onClick={onLogout}><FiLogOut /> Log out</button>
    </section>
  );
}

export default AdminProfile;