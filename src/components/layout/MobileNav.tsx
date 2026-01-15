import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: PlusSquare, label: 'Create', path: '/create' },
  { icon: Heart, label: 'Activity', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile', isProfile: true },
];

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full gradient-primary"
                />
              )}
              {item.isProfile ? (
                <Avatar className={cn(
                  'h-6 w-6 transition-all',
                  isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                )}>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              ) : (
                <item.icon className={cn(
                  'h-6 w-6 transition-transform',
                  isActive && 'scale-110'
                )} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
