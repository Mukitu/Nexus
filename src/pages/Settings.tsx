import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Bell,
  Lock,
  Shield,
  Eye,
  Smartphone,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Trash2,
  Download,
  Key
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Settings stored in localStorage
const SETTINGS_KEY = 'nexus_settings';

interface UserSettings {
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    likesEnabled: boolean;
    commentsEnabled: boolean;
    followsEnabled: boolean;
    messagesEnabled: boolean;
  };
  privacy: {
    privateAccount: boolean;
    showActivityStatus: boolean;
    showReadReceipts: boolean;
    allowTagging: boolean;
    allowMentions: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    likesEnabled: true,
    commentsEnabled: true,
    followsEnabled: true,
    messagesEnabled: true,
  },
  privacy: {
    privateAccount: false,
    showActivityStatus: true,
    showReadReceipts: true,
    allowTagging: true,
    allowMentions: true,
  },
  security: {
    twoFactorEnabled: false,
    loginAlerts: true,
  },
};

function getSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: UserSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon: Icon, title, description, children, onClick, danger }: SettingItemProps) {
  return (
    <div 
      className={`flex items-center justify-between py-4 ${onClick ? 'cursor-pointer hover:bg-secondary/30 -mx-4 px-4 rounded-lg transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl ${danger ? 'bg-destructive/10' : 'bg-secondary'}`}>
          <Icon className={`h-5 w-5 ${danger ? 'text-destructive' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <p className={`font-medium ${danger ? 'text-destructive' : ''}`}>{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children || (onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" />)}
    </div>
  );
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(getSettings);

  const updateSetting = <K extends keyof UserSettings>(
    category: K,
    key: keyof UserSettings[K],
    value: boolean
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    setSettings(newSettings);
    saveSettings(newSettings);
    toast({ title: 'Setting updated', description: 'Your preference has been saved.' });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleDeleteAccount = () => {
    // In a real app, this would delete the account
    localStorage.clear();
    navigate('/auth');
    toast({ title: 'Account deleted', description: 'Your account has been deleted.', variant: 'destructive' });
  };

  const handleDownloadData = () => {
    // Simulate data download
    const data = {
      user,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexus-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Data exported', description: 'Your data has been downloaded.' });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          {/* Account Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" /> Account
            </h2>
            
            <div 
              className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => navigate('/profile')}
            >
              <Avatar className="h-14 w-14">
                <AvatarImage src={user?.avatar} alt={user?.displayName} />
                <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{user?.displayName}</p>
                <p className="text-sm text-muted-foreground">@{user?.username}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="mt-4 space-y-1">
              <SettingItem 
                icon={User} 
                title="Edit Profile" 
                description="Update your photo, name, and bio"
                onClick={() => navigate('/profile?edit=true')}
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifications
            </h2>
            
            <div className="space-y-1">
              <SettingItem icon={Bell} title="Push Notifications" description="Receive notifications on your device">
                <Switch 
                  checked={settings.notifications.pushEnabled}
                  onCheckedChange={(v) => updateSetting('notifications', 'pushEnabled', v)}
                />
              </SettingItem>
              <SettingItem icon={Bell} title="Email Notifications" description="Receive updates via email">
                <Switch 
                  checked={settings.notifications.emailEnabled}
                  onCheckedChange={(v) => updateSetting('notifications', 'emailEnabled', v)}
                />
              </SettingItem>
              
              <Separator className="my-4" />
              
              <SettingItem icon={Bell} title="Likes">
                <Switch 
                  checked={settings.notifications.likesEnabled}
                  onCheckedChange={(v) => updateSetting('notifications', 'likesEnabled', v)}
                />
              </SettingItem>
              <SettingItem icon={Bell} title="Comments">
                <Switch 
                  checked={settings.notifications.commentsEnabled}
                  onCheckedChange={(v) => updateSetting('notifications', 'commentsEnabled', v)}
                />
              </SettingItem>
              <SettingItem icon={Bell} title="New Followers">
                <Switch 
                  checked={settings.notifications.followsEnabled}
                  onCheckedChange={(v) => updateSetting('notifications', 'followsEnabled', v)}
                />
              </SettingItem>
              <SettingItem icon={Bell} title="Direct Messages">
                <Switch 
                  checked={settings.notifications.messagesEnabled}
                  onCheckedChange={(v) => updateSetting('notifications', 'messagesEnabled', v)}
                />
              </SettingItem>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" /> Privacy
            </h2>
            
            <div className="space-y-1">
              <SettingItem icon={Lock} title="Private Account" description="Only approved followers can see your posts">
                <Switch 
                  checked={settings.privacy.privateAccount}
                  onCheckedChange={(v) => updateSetting('privacy', 'privateAccount', v)}
                />
              </SettingItem>
              <SettingItem icon={Eye} title="Activity Status" description="Show when you're active">
                <Switch 
                  checked={settings.privacy.showActivityStatus}
                  onCheckedChange={(v) => updateSetting('privacy', 'showActivityStatus', v)}
                />
              </SettingItem>
              <SettingItem icon={Eye} title="Read Receipts" description="Let others know when you've seen messages">
                <Switch 
                  checked={settings.privacy.showReadReceipts}
                  onCheckedChange={(v) => updateSetting('privacy', 'showReadReceipts', v)}
                />
              </SettingItem>
              <SettingItem icon={User} title="Allow Tagging" description="Let others tag you in posts">
                <Switch 
                  checked={settings.privacy.allowTagging}
                  onCheckedChange={(v) => updateSetting('privacy', 'allowTagging', v)}
                />
              </SettingItem>
              <SettingItem icon={User} title="Allow Mentions" description="Let others mention you in comments">
                <Switch 
                  checked={settings.privacy.allowMentions}
                  onCheckedChange={(v) => updateSetting('privacy', 'allowMentions', v)}
                />
              </SettingItem>
            </div>
          </div>

          {/* Security Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" /> Security
            </h2>
            
            <div className="space-y-1">
              <SettingItem icon={Key} title="Two-Factor Authentication" description="Add an extra layer of security">
                <Switch 
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(v) => updateSetting('security', 'twoFactorEnabled', v)}
                />
              </SettingItem>
              <SettingItem icon={Smartphone} title="Login Alerts" description="Get notified of new logins">
                <Switch 
                  checked={settings.security.loginAlerts}
                  onCheckedChange={(v) => updateSetting('security', 'loginAlerts', v)}
                />
              </SettingItem>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} Appearance
            </h2>
            
            <div className="space-y-1">
              <SettingItem 
                icon={theme === 'dark' ? Moon : Sun} 
                title="Dark Mode" 
                description="Toggle dark/light theme"
              >
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </SettingItem>
              <SettingItem icon={Globe} title="Language" description="English (US)" onClick={() => {
                toast({ title: 'Coming soon', description: 'Language settings will be available soon.' });
              }} />
            </div>
          </div>

          {/* Data & Support Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" /> Data & Support
            </h2>
            
            <div className="space-y-1">
              <SettingItem 
                icon={Download} 
                title="Download Your Data" 
                description="Get a copy of your information"
                onClick={handleDownloadData}
              />
              <SettingItem icon={HelpCircle} title="Help Center" onClick={() => {
                toast({ title: 'Help Center', description: 'Visit our help center for support.' });
              }} />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass rounded-2xl p-6 mb-6 border border-destructive/20">
            <h2 className="text-lg font-semibold mb-4 text-destructive flex items-center gap-2">
              <Shield className="h-5 w-5" /> Danger Zone
            </h2>
            
            <div className="space-y-1">
              <SettingItem 
                icon={LogOut} 
                title="Sign Out" 
                description="Sign out of your account"
                onClick={handleSignOut}
                danger
              />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div>
                    <SettingItem 
                      icon={Trash2} 
                      title="Delete Account" 
                      description="Permanently delete your account and data"
                      danger
                      onClick={() => {}}
                    />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground pb-8">
            Nexus v1.0.0 • © 2025 Nexus
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
