import React, { useRef, useState } from "react";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Image as ImageIcon, Trash2, Upload, AlertCircle } from "lucide-react";

export default function PersonalEditor({ personal, onChange }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field, value) => {
    onChange({ ...personal, [field]: value });
  };

  const processImageFile = (file) => {
    setErrorMsg("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (JPEG, PNG, WEBP, etc.)");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onerror = () => {
      setErrorMsg("Failed to read image file from disk.");
      setIsProcessing(false);
    };

    reader.onload = (e) => {
      const dataUri = e.target?.result;
      if (!dataUri) {
        setErrorMsg("Could not load image data.");
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.onerror = () => {
        setErrorMsg("Failed to parse image file format.");
        setIsProcessing(false);
      };

      img.onload = () => {
        try {
          // Scale down image to optimal size (max 400x400)
          const MAX_DIM = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 88% quality (approx ~35KB)
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.88);

          onChange({
            ...personal,
            avatarUrl: optimizedDataUrl,
            showAvatar: true
          });
        } catch (err) {
          onChange({
            ...personal,
            avatarUrl: dataUri,
            showAvatar: true
          });
        } finally {
          setIsProcessing(false);
        }
      };

      img.src = dataUri;
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const removePhoto = () => {
    onChange({
      ...personal,
      avatarUrl: "",
      showAvatar: false
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-400" />
          Personal Details
        </h3>
      </div>

      {/* Profile Photo Upload Section */}
      <div className="p-4 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/[0.07] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Profile Photo
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={personal.showAvatar || false}
              onChange={(e) => handleInputChange("showAvatar", e.target.checked)}
              className="rounded bg-zinc-950 border-white/20 text-amber-500 focus:ring-0 cursor-pointer"
            />
            Show on Resume
          </label>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 p-2 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl border-2 border-dashed transition-all ${
            isDragging
              ? "border-amber-400 bg-amber-950/20"
              : "border-white/10 bg-zinc-950/60 hover:border-amber-400/30"
          }`}
        >
          {/* Avatar Thumbnail */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-zinc-800 shrink-0 flex items-center justify-center">
            {personal.avatarUrl ? (
              <img
                src={personal.avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-zinc-500" />
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-white font-medium">
                Loading...
              </div>
            )}
          </div>

          {/* Action buttons and URL input */}
          <div className="flex-1 w-full space-y-2 text-center sm:text-left">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:from-amber-500 active:to-yellow-600 text-zinc-950 shadow-sm transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                {personal.avatarUrl ? "Change Photo" : "Upload Photo from PC"}
              </button>

              {personal.avatarUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-rose-950/30 text-zinc-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-400">
              Drag & drop an image or click <span className="text-zinc-200 font-medium">Upload Photo from PC</span> (PNG, JPG, WebP).
            </p>

            <div className="pt-1">
              <input
                type="text"
                placeholder="Or paste an image web URL..."
                value={personal.avatarUrl && !personal.avatarUrl.startsWith("data:") ? personal.avatarUrl : ""}
                onChange={(e) => {
                  onChange({
                    ...personal,
                    avatarUrl: e.target.value,
                    showAvatar: Boolean(e.target.value)
                  });
                }}
                className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/[0.08] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Info Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name</label>
          <input
            type="text"
            value={personal.fullName || ""}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="e.g. Alexander Wright"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Headline / Target Role</label>
          <input
            type="text"
            value={personal.headline || ""}
            onChange={(e) => handleInputChange("headline", e.target.value)}
            placeholder="e.g. Senior Software Architect"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="email"
              value={personal.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="alex@example.com"
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number</label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="tel"
              value={personal.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Location</label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              value={personal.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Portfolio / Website</label>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="url"
              value={personal.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://myportfolio.dev"
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">LinkedIn Profile</label>
          <div className="relative">
            <Linkedin className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="url"
              value={personal.linkedin || ""}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">GitHub Profile</label>
          <div className="relative">
            <Github className="w-3.5 h-3.5 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="url"
              value={personal.github || ""}
              onChange={(e) => handleInputChange("github", e.target.value)}
              placeholder="https://github.com/username"
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur-sm border border-white/[0.08] text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
