import { useState, useRef } from "react";
import { Camera, User, Lock, Save, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services";
import { getImageUrl } from "../../services/api";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";

function AvatarUpload({ user, onUploaded }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("File size must be under 2MB."); return; }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      formData.append("name", user?.name || "");
      formData.append("phone", user?.phone || "");
      const { data } = await userService.updateProfile(formData);
      onUploaded(data.data);
      toast.success("Profile photo updated!");
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const currentAvatar = preview
    ? preview
    : user?.avatar ? getImageUrl(user.avatar, "avatars") : null;

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "ME";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
        <div className="w-28 h-28 rounded-full overflow-hidden bg-primary border-2 border-border transition-all duration-200 group-hover:border-accent shadow-card">
          {currentAvatar ? (
            <img src={currentAvatar} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display font-bold text-3xl text-text-primary">{initials}</span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 rounded-full bg-background/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera className="w-6 h-6 text-text-primary" />
          <span className="text-[9px] font-mono text-text-primary uppercase tracking-wider">Edit</span>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

      {preview && (
        <div className="flex items-center gap-2">
          <button onClick={handleUpload} disabled={uploading} type="button" className="btn-primary text-xs py-1.5 px-4">
            {uploading ? "Saving..." : "Save Photo"}
          </button>
          <button onClick={handleCancel} disabled={uploading} type="button" className="btn-ghost text-xs py-1.5 px-4">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("phone", profileForm.phone);
      const { data } = await userService.updateProfile(formData);
      updateUser(data.data);
      toast.success("Profile saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) return toast.error("New passwords do not match.");
    setPasswordLoading(true);
    try {
      await userService.changePassword({ current_password: passwordForm.current_password, new_password: passwordForm.new_password });
      toast.success("Password changed successfully!");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container-premium max-w-2xl">

          {/* Page Title */}
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Account Settings</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
              Member Profile
            </h1>
          </div>

          {/* Card Wrapper */}
          <div className="bg-card border border-border rounded-card p-6 sm:p-8 shadow-card space-y-8">

            {/* Avatar Header */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-border">
              <AvatarUpload user={user} onUploaded={updateUser} />
              <div>
                <h2 className="font-display font-bold text-xl text-text-primary">{user?.name}</h2>
                <p className="text-xs text-muted font-mono">{user?.email}</p>
                <span className="badge-jade text-[10px] mt-2 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {user?.role || 'Member'}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 bg-bg-secondary border border-border rounded-md p-1">
              {[
                { key: "info",     label: "Personal Info", icon: User },
                { key: "security", label: "Security",      icon: Lock },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                    activeTab === key ? "bg-primary text-text-primary font-semibold shadow-sm" : "text-muted hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Profile Info Form */}
            {activeTab === "info" && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="input-premium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Email Address</label>
                  <input type="email" value={user?.email || ""} disabled className="input-premium opacity-50 cursor-not-allowed" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    className="input-premium"
                  />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={profileLoading} className="btn-primary py-3 px-6 text-xs justify-center disabled:opacity-50">
                    <Save className="w-4 h-4" /> {profileLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Security Password Form */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {[
                  { label: "Current Password",    key: "current_password" },
                  { label: "New Password",         key: "new_password" },
                  { label: "Confirm New Password", key: "confirm_password" },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted uppercase font-mono tracking-wider">{label}</label>
                    <input
                      type="password"
                      value={passwordForm[key]}
                      onChange={e => setPasswordForm(p => ({ ...p, [key]: e.target.value }))}
                      className="input-premium"
                    />
                  </div>
                ))}

                <div className="pt-4">
                  <button type="submit" disabled={passwordLoading} className="btn-primary py-3 px-6 text-xs justify-center disabled:opacity-50">
                    <Lock className="w-4 h-4" /> {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
