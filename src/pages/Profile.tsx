import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Grid3X3, 
  Bookmark, 
  Film, 
  BadgeCheck,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Camera,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { mockPosts } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'nexus_auth_user';

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const userPosts = mockPosts.filter(p => p.media && p.media.length > 0);

  // Sync form with user data
  useEffect(() => {
    if (user) {
      setEditForm({
        displayName: user.displayName || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Handle edit param from URL
  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Please choose an image under 5MB', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewAvatar(reader.result as string);
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editForm.displayName.trim()) {
      toast({ title: 'Error', description: 'Display name is required', variant: 'destructive' });
      return;
    }
    if (!editForm.username.trim()) {
      toast({ title: 'Error', description: 'Username is required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update user in localStorage
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const updatedUser = {
        ...userData,
        displayName: editForm.displayName.trim(),
        username: editForm.username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        bio: editForm.bio.trim(),
        avatar: editForm.avatar,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Trigger cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(updatedUser),
      }));
    }

    await refreshUser();
    setSaving(false);
    setIsEditing(false);
    setPreviewAvatar(null);
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  const handleCancel = () => {
    setEditForm({
      displayName: user?.displayName || '',
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setPreviewAvatar(null);
    setIsEditing(false);
  };

  const displayUser = user || {
    displayName: 'User',
    username: 'user',
    bio: '',
    avatar: '',
    verified: false,
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Cover */}
          <div className="h-32 gradient-primary" />
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <Avatar className="absolute -top-12 left-6 h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={previewAvatar || displayUser.avatar} alt={displayUser.displayName} />
              <AvatarFallback className="text-2xl">{displayUser.displayName[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex justify-end pt-4 mb-8">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={() => setIsEditing(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{displayUser.displayName}</h1>
                  {displayUser.verified && (
                    <BadgeCheck className="h-5 w-5 text-primary fill-primary/20" />
                  )}
                </div>
                <p className="text-muted-foreground">@{displayUser.username}</p>
              </div>

              {displayUser.bio && (
                <p className="text-sm">{displayUser.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> San Francisco
                </span>
                <span className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" /> nexus.app/{displayUser.username}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Joined Jan 2024
                </span>
              </div>

              <div className="flex gap-6 pt-2">
                <button className="hover:underline">
                  <span className="font-bold">{formatNumber(displayUser.postsCount)}</span>
                  <span className="text-muted-foreground ml-1">posts</span>
                </button>
                <button className="hover:underline">
                  <span className="font-bold">{formatNumber(displayUser.followersCount)}</span>
                  <span className="text-muted-foreground ml-1">followers</span>
                </button>
                <button className="hover:underline">
                  <span className="font-bold">{formatNumber(displayUser.followingCount)}</span>
                  <span className="text-muted-foreground ml-1">following</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full glass rounded-xl p-1">
            <TabsTrigger value="posts" className="flex-1 rounded-lg data-[state=active]:bg-secondary">
              <Grid3X3 className="h-4 w-4 mr-2" /> Posts
            </TabsTrigger>
            <TabsTrigger value="reels" className="flex-1 rounded-lg data-[state=active]:bg-secondary">
              <Film className="h-4 w-4 mr-2" /> Reels
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 rounded-lg data-[state=active]:bg-secondary">
              <Bookmark className="h-4 w-4 mr-2" /> Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
                >
                  <img
                    src={post.media![0].url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reels" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reels yet</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Only you can see saved posts</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={previewAvatar || editForm.avatar} alt="Profile" />
                    <AvatarFallback className="text-2xl">{editForm.displayName[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Click to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your name"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') 
                      }))}
                      placeholder="username"
                      className="pl-8"
                      maxLength={30}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground text-right">{editForm.bio.length}/160</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                className="flex-1 gradient-primary text-primary-foreground"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
