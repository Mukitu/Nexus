import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Clock, TrendingUp, BadgeCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUsers } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const recentSearches = [
  { type: 'user', value: mockUsers[0] },
  { type: 'tag', value: 'TechNews' },
  { type: 'user', value: mockUsers[1] },
  { type: 'tag', value: 'DesignTrends' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockUsers>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = mockUsers.filter(
        user => 
          user.username.toLowerCase().includes(value.toLowerCase()) ||
          user.displayName.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="pl-12 pr-12 h-14 rounded-2xl bg-secondary/50 border-0 text-lg focus-visible:ring-2 focus-visible:ring-primary"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {!query ? (
          <div className="space-y-6">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Recent
                </h2>
                <button className="text-sm text-primary font-medium hover:underline">
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    {item.type === 'user' ? (
                      <>
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={(item.value as typeof mockUsers[0]).avatar} />
                          <AvatarFallback>{(item.value as typeof mockUsers[0]).displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium flex items-center gap-1">
                            {(item.value as typeof mockUsers[0]).username}
                            {(item.value as typeof mockUsers[0]).verified && (
                              <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(item.value as typeof mockUsers[0]).displayName}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-11 w-11 rounded-full bg-secondary flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="font-medium">#{item.value as string}</p>
                      </>
                    )}
                    <button className="p-2 hover:bg-secondary rounded-full">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4" /> Trending
              </h2>
              <div className="flex flex-wrap gap-2">
                {['#AIRevolution', '#TechNews', '#Startup', '#Design', '#Coding'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-secondary text-sm font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {results.length > 0 ? (
              results.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-1">
                      {user.username}
                      {user.verified && (
                        <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.displayName} · {formatNumber(user.followersCount)} followers
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    View
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
