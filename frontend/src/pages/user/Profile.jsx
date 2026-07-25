import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services";
import { getImageUrl } from "../../services/api";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";

/* ── Inline Avatar Upload — circular, no box ── */
function AvatarUpload({ user, onUploaded }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("File terlalu besar. Maks 2 MB."); return; }
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
      toast.success("Foto profil berhasil diubah!");
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal upload foto.");
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
    <div className="flex flex-col items-center gap-5">
      {/* Big circle avatar — clickable */}
      <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
        <div className="w-32 h-32 rounded-full overflow-hidden bg-[#2A629C] border-4 border-[#F5F3F5]/20 transition-all duration-300 group-hover:border-[#F5F3F5]/50 group-hover:scale-[1.03] shadow-lg">
          {currentAvatar ? (
            <img src={currentAvatar} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display font-black text-4xl text-[#F5F3F5]">{initials}</span>
            </div>
          )}
        </div>

        {/* Camera icon overlay */}
        <div className="absolute inset-0 rounded-full bg-[#343C4E]/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="w-7 h-7 text-[#F5F3F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[9px] font-mono text-[#F5F3F5] uppercase tracking-widest">edit</span>
        </div>

        {/* Live preview badge */}
        {preview && (
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2A629C] border-2 border-[#728EB7] flex items-center justify-center shadow">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5F3F5] block" />
          </span>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

      {preview ? (
        <div className="flex items-center gap-3">
          <button onClick={handleUpload} disabled={uploading} type="button"
            className="bg-[#2A629C] hover:bg-[#1E4F82] text-[#F5F3F5] font-mono text-[11px] font-bold uppercase tracking-widest px-5 py-2 transition-colors disabled:opacity-50 rounded-full">
            {uploading ? "Mengupload..." : "Simpan Foto"}
          </button>
          <button onClick={handleCancel} disabled={uploading} type="button"
            className="text-[#D3CCD0] hover:text-[#F5F3F5] font-mono text-[11px] font-bold uppercase tracking-widest px-5 py-2 transition-colors disabled:opacity-50 rounded-full border border-[#F5F3F5]/15 hover:border-[#F5F3F5]/40">
            Batal
          </button>
        </div>
      ) : (
        <p className="text-[10px] font-mono text-[#D3CCD0]/50 text-center leading-relaxed">
          klik untuk ganti foto
          <br />jpg · png · webp · maks 2 mb
        </p>
      )}
    </div>
  );
}

/* ── Styled field ── */
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-mono font-bold text-[#D3CCD0]/60 uppercase tracking-[0.2em]">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-transparent border-b border-[#F5F3F5]/15 text-[#F5F3F5] placeholder:text-[#D3CCD0]/30 px-0 py-2.5 text-sm font-sans focus:outline-none focus:border-[#8DA7CC] transition-colors";
const disabledCls = "w-full bg-transparent border-b border-[#F5F3F5]/08 text-[#D3CCD0]/30 px-0 py-2.5 text-sm font-sans cursor-not-allowed";

/* ══ Main ══ */
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // "info" | "security"

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("phone", profileForm.phone);
      const { data } = await userService.updateProfile(formData);
      updateUser(data.data);
      toast.success("Profil berhasil disimpan!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan profil.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) return toast.error("Password baru tidak cocok.");
    setPasswordLoading(true);
    try {
      await userService.changePassword({ current_password: passwordForm.current_password, new_password: passwordForm.new_password });
      toast.success("Password berhasil diubah!");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#728EB7] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* ── Page label ── */}
          <div className="mb-10">
            <span className="text-[10px] font-mono text-[#343C4E] uppercase tracking-[0.25em]">account settings</span>
            <h1 className="font-display font-black text-[#F5F3F5] uppercase tracking-tighter mt-1" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1 }}>
              Member Profile
            </h1>
          </div>

          {/* ── Avatar section — centered, airy ── */}
          <div className="flex flex-col items-center text-center mb-14 gap-3">
            <AvatarUpload user={user} onUploaded={updateUser} />
            <div className="space-y-0.5 mt-1">
              <h2 className="font-display font-bold text-[#F5F3F5] text-xl">{user?.name}</h2>
              <p className="text-[11px] font-mono text-[#D3CCD0]/60">{user?.email}</p>
              <span className="inline-block text-[9px] font-mono text-[#8DA7CC] uppercase tracking-widest border border-[#8DA7CC]/30 px-2 py-0.5 rounded-full mt-1">
                {user?.role}
              </span>
            </div>
          </div>

          {/* ── Divider with member id ── */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-[#F5F3F5]/10" />
            <span className="text-[10px] font-mono text-[#D3CCD0]/40 uppercase tracking-widest">
              member #{user?.id?.toString().padStart(6, "0") || "000000"}
            </span>
            <div className="flex-1 h-px bg-[#F5F3F5]/10" />
          </div>

          {/* ── Tab switcher — underline only, no boxes ── */}
          <div className="flex items-center gap-8 border-b border-[#F5F3F5]/10 mb-8">
            {[
              { key: "info",     label: "Personal Info"    },
              { key: "security", label: "Security"         },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === key ? "text-[#F5F3F5]" : "text-[#D3CCD0]/40 hover:text-[#D3CCD0]"
                }`}
              >
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#8DA7CC]" />
                )}
              </button>
            ))}
          </div>

          {/* ── Form panels ── */}
          {activeTab === "info" && (
            <form onSubmit={handleProfileSubmit} className="space-y-7">
              <Field label="Full Name">
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Email Address">
                <input type="email" value={user?.email || ""} disabled className={disabledCls} />
                <p className="text-[10px] font-mono text-[#D3CCD0]/30 mt-1">email tidak dapat diubah</p>
              </Field>
              <Field label="Phone Number">
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="08xxxxxxxxxx"
                  className={inputCls}
                />
              </Field>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5F3F5] bg-[#2A629C] hover:bg-[#1E4F82] px-8 py-3 transition-colors disabled:opacity-50 rounded-full"
                >
                  {profileLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-7">
              {[
                { label: "Current Password",    key: "current_password"  },
                { label: "New Password",         key: "new_password"      },
                { label: "Confirm New Password", key: "confirm_password"  },
              ].map(({ label, key }) => (
                <Field key={key} label={label}>
                  <input
                    type="password"
                    value={passwordForm[key]}
                    onChange={e => setPasswordForm(p => ({ ...p, [key]: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
              ))}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5F3F5] border border-[#F5F3F5]/20 hover:border-[#F5F3F5]/50 px-8 py-3 transition-colors disabled:opacity-50 rounded-full"
                >
                  {passwordLoading ? "Mengupdate..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </Layout>
  );
}
