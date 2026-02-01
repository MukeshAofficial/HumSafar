
import React, { useState } from 'react';
import { Camera, Shield, Save, Loader2, Smartphone, CheckCircle2, User, LifeBuoy, Landmark } from 'lucide-react';
import { UserProfile, EmergencyContact, Gender } from '../../lib/db';

interface ProfileManagerProps {
  initialProfile: UserProfile;
  onSave: (p: Partial<UserProfile>) => Promise<void>;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ initialProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  
  // Phone State
  const [phone, setPhone] = useState(initialProfile.phone || '');

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>(
    initialProfile.emergencyContact || { name: '', phone: '' }
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ ...profile, phone, emergencyContact });
      alert('Profile updated!');
    } catch (e) {
      alert('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        <div className="p-8 md:p-12">
            {/* Header / Avatar */}
            <div className="flex flex-col items-center mb-12">
                <div className="relative group mb-6">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-4xl font-bold text-emerald-600 dark:text-emerald-400 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden uppercase">
                        {profile.name.charAt(0)}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <Shield className="text-emerald-500" size={18} />
                    </div>
                </div>
            </div>

            {/* Phone Section - Simplified */}
            <div className="p-1 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] mb-6 transition-all">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[1.8rem] p-6 md:px-8 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Phone Number</label>
                            
                            <div className="flex items-center gap-3">
                                <Smartphone size={20} className="text-slate-400 dark:text-slate-500" />
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="bg-transparent text-xl font-bold text-slate-800 dark:text-white outline-none w-full placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    placeholder="Set your phone number"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Level Card */}
            <div className="p-6 rounded-[1.5rem] flex items-center gap-4 mb-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-slate-200 dark:bg-slate-700 text-slate-500">
                    <Shield size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Trust Level</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Standard
                        </span>
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        Email Verified
                    </p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Display Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Professional Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      disabled
                      value={profile.email} 
                      className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 cursor-not-allowed font-bold" 
                    />
                    <CheckCircle2 size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                     <User size={14} /> Gender
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(['male', 'female', 'other', 'prefer-not-to-say'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setProfile({...profile, gender: g})}
                        className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all border ${
                          profile.gender === g
                            ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500'
                        }`}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1).replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                     <Landmark size={14} /> Workplace / College Campus
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. DLF IT Park, Chennai / IIT Madras"
                    defaultValue={profile.workplace}
                    onChange={(e) => setProfile({...profile, workplace: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-900 dark:text-white" 
                  />
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <LifeBuoy size={18} className="text-rose-500" />
                  Emergency Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    value={emergencyContact.name} 
                    onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                    placeholder="Contact Name"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium" 
                  />
                  <input 
                    type="text" 
                    value={emergencyContact.phone} 
                    onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
                    placeholder="Phone Number"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  value={profile.home} 
                  onChange={(e) => setProfile({...profile, home: e.target.value})}
                  placeholder="Home Locality"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium" 
                />
                <input 
                  type="text" 
                  value={profile.work} 
                  onChange={(e) => setProfile({...profile, work: e.target.value})}
                  placeholder="Work Locality"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium" 
                />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Your privacy is important. No documents are stored.</p>
                <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all disabled:opacity-50 min-w-[180px] justify-center shadow-lg shadow-slate-200 dark:shadow-none"
                >
                {isSaving ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Updating...
                    </>
                ) : (
                    <>
                        <Save size={20} />
                        Save Profile
                    </>
                )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
