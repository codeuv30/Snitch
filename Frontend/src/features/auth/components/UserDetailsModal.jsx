import React from "react";
import { useNavigate } from "react-router";
import { X, Mail, Phone, Shield, Key, User } from "lucide-react";
import { useAuth } from "../hook/useAuth";

const UserDetailsModal = ({ user, onClose }) => {
  const navigate = useNavigate();

  if (!user) return null;

  const { handleLogout, handleGetUser } = useAuth();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm mx-4 animate-scale-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#555555] hover:text-[#f0ede8] hover:bg-[#1a1a1a] transition-all"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#1a1a1a] flex items-center justify-center">
            <User size={24} className="text-[#c4956a]" />
          </div>
          <div>
            <h3 className="text-[16px] text-[#f0ede8] font-bold">{user.fullName}</h3>
            <span className="text-[11px] text-[#c4956a] bg-[#c4956a]/10 px-2 py-0.5 rounded border border-[#c4956a]/20 font-medium">
              {user.role}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#111111] rounded-xl border border-[#1a1a1a]">
            <Mail size={14} className="text-[#555555] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-[#555555] uppercase tracking-wider">Email</p>
              <p className="text-[12px] text-[#f0ede8] truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#111111] rounded-xl border border-[#1a1a1a]">
            <Phone size={14} className="text-[#555555] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-[#555555] uppercase tracking-wider">Contact</p>
              <p className="text-[12px] text-[#f0ede8] truncate">{user.contact}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#111111] rounded-xl border border-[#1a1a1a]">
            <Key size={14} className="text-[#555555] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-[#555555] uppercase tracking-wider">Provider</p>
              <p className="text-[12px] text-[#f0ede8] capitalize">{user.provider}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#111111] rounded-xl border border-[#1a1a1a]">
            <Shield size={14} className="text-[#555555] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-[#555555] uppercase tracking-wider">User ID</p>
              <p className="text-[11px] text-[#777777] font-mono truncate">{user.id}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-[#1a1a1a] flex gap-2">
          <button
            onClick={async () => {
              onClose();
              navigate("/");
              await handleLogout();
              await handleGetUser();
            }}
            className="flex-1 py-2.5 bg-[#f0ede8] text-[#0a0a0a] rounded-xl text-[12px] font-bold tracking-wide hover:bg-[#c4956a] transition-colors"
          >
            Logout
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#1a1a1a] text-[#555555] rounded-xl text-[12px] font-bold tracking-wide hover:text-[#f0ede8] hover:border-[#333333] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;