import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Upload, Save, Globe, Layout, Image as ImageIcon, AlertTriangle, CheckCircle, RefreshCw, ArrowLeft, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

interface BrandingProps {
  user: User | null;
}

export const Branding: React.FC<BrandingProps> = ({ user }) => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [publicUrl, setPublicUrl] = useState<string>('');
  const [fileSizeError, setFileSizeError] = useState<string>('');
  const [urlWarning, setUrlWarning] = useState<string>('');
  
  // Access Control: Owner Only
  const isOwner = user?.role === UserRole.OWNER || user?.email === 'thepeachymarkets@gmail.com';

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }
    if (!isOwner) {
        navigate('/');
        return;
    }

    // Load existing settings
    const savedLogo = localStorage.getItem('site_logo');
    const savedPublicUrl = localStorage.getItem('site_logo_public_url');
    
    if (savedLogo) setLogoUrl(savedLogo);
    if (savedPublicUrl) setPublicUrl(savedPublicUrl);
  }, [user, isOwner, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileSizeError('');
    
    if (file) {
        // Limit to 2MB for LocalStorage safety
        if (file.size > 2 * 1024 * 1024) {
            setFileSizeError('File size too large. Max 2MB for internal storage.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setLogoUrl(result);
        };
        reader.readAsDataURL(file);
    }
  };

  const validateAndCleanUrl = (url: string) => {
      let cleaned = url.trim();
      setUrlWarning('');

      // Auto-Fix Imgur Gallery Links (e.g., imgur.com/a/XYZ -> i.imgur.com/XYZ.png)
      if (cleaned.includes('imgur.com/a/')) {
          const idMatch = cleaned.match(/imgur\.com\/a\/([a-zA-Z0-9]+)/);
          if (idMatch && idMatch[1]) {
              cleaned = `https://i.imgur.com/${idMatch[1]}.png`;
              setUrlWarning('Auto-corrected Imgur Gallery link to Direct Image Link.');
          }
      } else if (cleaned.includes('imgur.com') && !cleaned.includes('i.imgur.com')) {
           // Handle non-gallery but non-direct links (e.g. imgur.com/XYZ)
           const idMatch = cleaned.match(/imgur\.com\/([a-zA-Z0-9]+)/);
           if (idMatch && idMatch[1]) {
               cleaned = `https://i.imgur.com/${idMatch[1]}.png`;
               setUrlWarning('Auto-corrected Imgur Link to Direct Image Link.');
           }
      }

      setPublicUrl(cleaned);
  };

  const handleSave = () => {
      try {
          localStorage.setItem('site_logo', logoUrl);
          
          if (publicUrl) {
              if (!publicUrl.startsWith('http')) {
                  alert("Error: Public URL must start with http:// or https://");
                  return;
              }
              localStorage.setItem('site_logo_public_url', publicUrl);
          } else {
              localStorage.removeItem('site_logo_public_url');
          }
          
          alert("Branding settings saved successfully! The site logo has been updated.");
          window.location.reload(); // Reload to apply changes globally
      } catch (err) {
          alert("Error saving branding. The image might be too large for local storage.");
      }
  };

  const handleReset = () => {
      if(window.confirm("Reset to default logo?")) {
          localStorage.removeItem('site_logo');
          localStorage.removeItem('site_logo_public_url');
          setLogoUrl('/logo.png');
          setPublicUrl('');
          window.location.reload();
      }
  };

  if (!isOwner) return null;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
        <SEO title="Branding Manager" description="Manage site logos and social preview assets." />
        
        <div className="flex items-center mb-8">
            <button onClick={() => navigate('/admin')} className="mr-4 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Server Branding</h1>
                <p className="text-gray-400">Manage logo assets for the Homepage and Rich Links.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Column */}
            <div className="space-y-6">
                
                {/* 1. Internal Upload */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Layout className="w-5 h-5 mr-2 text-peach-500" /> Site Logo (Internal)
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        This logo appears on the Navigation Bar and Footer for all users visiting the site.
                    </p>
                    
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 bg-gray-900 rounded-xl border border-gray-600 flex items-center justify-center shrink-0 p-2">
                            <img src={logoUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow">
                            <label className="block w-full cursor-pointer group">
                                <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-600 rounded-xl hover:bg-gray-700/50 hover:border-peach-500 transition-all">
                                    <div className="text-center">
                                        <Upload className="mx-auto h-6 w-6 text-gray-400 group-hover:text-peach-500" />
                                        <p className="mt-1 text-xs text-gray-400">Upload PNG/JPG (Max 2MB)</p>
                                    </div>
                                </div>
                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileUpload} />
                            </label>
                            {fileSizeError && <p className="text-xs text-red-500 mt-2 font-bold">{fileSizeError}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. Public URL (Rich Links) */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-blue-500" /> Rich Link Image (Social Media)
                    </h3>
                    <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl mb-4">
                        <div className="flex">
                            <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
                            <div className="text-xs text-blue-200 leading-relaxed">
                                <p className="mb-2"><strong>Critical:</strong> Social media (Facebook, Discord, Twitter) cannot see files uploaded locally. You must provide a <strong>Direct Image URL</strong>.</p>
                                <p>If you paste an Imgur Gallery link (e.g. <code>imgur.com/a/xyz</code>), we will try to auto-fix it to a direct image link (<code>i.imgur.com/xyz.png</code>).</p>
                            </div>
                        </div>
                    </div>

                    <label className="block text-sm font-bold text-gray-300 mb-2">Public Image URL</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={publicUrl}
                            onChange={(e) => validateAndCleanUrl(e.target.value)}
                            placeholder="https://i.imgur.com/odttYiB.png"
                            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-xl text-white focus:border-blue-500 outline-none pr-10"
                        />
                        {publicUrl && (
                            <div className="absolute right-3 top-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {urlWarning && (
                        <p className="text-xs text-yellow-400 mt-2 flex items-center">
                            <Wand2 className="w-3 h-3 mr-1" /> {urlWarning}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button 
                        onClick={handleSave}
                        className="flex-1 bg-peach-600 hover:bg-peach-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-peach-900/20 flex items-center justify-center transition-all hover:scale-[1.02]"
                    >
                        <Save className="w-5 h-5 mr-2" /> Save & Apply Changes
                    </button>
                    <button 
                        onClick={handleReset}
                        className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-colors"
                        title="Reset to Default"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>

            </div>

            {/* Preview Column */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Live Previews</h3>
                
                {/* Navbar Preview */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <p className="text-xs text-gray-500 mb-2">Navigation Bar</p>
                    <div className="flex items-center bg-gray-900/95 p-3 rounded-lg border border-gray-800">
                        <img src={logoUrl} alt="Logo" className="w-8 h-8 mr-3 object-contain" />
                        <span className="font-bold text-xl text-gray-100">
                            Peachy<span className="text-peach-500">Market</span>
                        </span>
                    </div>
                </div>

                {/* Social Card Preview */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <p className="text-xs text-gray-500 mb-2">Social Media Card (Rich Link)</p>
                    <div className="bg-black rounded-lg overflow-hidden border border-gray-700 max-w-sm mx-auto">
                        <div className="h-48 bg-gray-800 flex items-center justify-center overflow-hidden relative">
                            {publicUrl || logoUrl ? (
                                <img src={publicUrl || logoUrl} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-600" />
                            )}
                            <div className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur-sm p-2">
                                <p className="text-[10px] text-white font-mono">peachy.market</p>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-800">
                            <h4 className="font-bold text-white text-sm mb-1 truncate">The Peachy Marketplace</h4>
                            <p className="text-xs text-gray-400 line-clamp-2">The Ultimate Marketplace for Sex Workers. Secure, Verified, and Professional.</p>
                        </div>
                    </div>
                    {!publicUrl ? (
                        <p className="text-xs text-red-400 mt-2 flex items-center justify-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> External preview requires Public URL
                        </p>
                    ) : (
                        <p className="text-xs text-green-400 mt-2 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Preview Ready
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};