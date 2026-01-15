import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  Compass,
  MessageCircle,
  Settings,
  Moon,
  Sun,
  Film,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Film, label: 'Reels', path: '/reels' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: Heart, label: 'Notifications', path: '/notifications' },
  { icon: PlusSquare, label: 'Create', path: '/create' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl z-50">
      <div className="flex-1 flex flex-col px-4 py-8">
        <Link to="/" className="mb-10 px-3">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">Nexus</span>
          </h1>
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-secondary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <item.icon className={cn(
                  'relative z-10 h-5 w-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 pt-4 border-t border-border">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <Link
            to="/settings"
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user?.avatar} alt={user?.displayName} />
              <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span>Profile</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
