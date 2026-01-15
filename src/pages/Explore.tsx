import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const trendingTopics = [
  { tag: 'TechNews', posts: '125K', category: 'Technology' },
  { tag: 'AIRevolution', posts: '89K', category: 'Technology' },
  { tag: 'DesignTrends', posts: '67K', category: 'Design' },
  { tag: 'StartupLife', posts: '45K', category: 'Business' },
  { tag: 'CodingTips', posts: '38K', category: 'Technology' },
];

const exploreImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop',
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, tags, or posts..."
            className="pl-12 h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <Tabs defaultValue="foryou" className="w-full">
          <TabsList className="w-full justify-start gap-2 bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="foryou"
              className="rounded-full data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="trending"
              className="rounded-full data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4 mr-1" /> Trending
            </TabsTrigger>
            <TabsTrigger 
              value="hashtags"
              className="rounded-full data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Hash className="h-4 w-4 mr-1" /> Tags
            </TabsTrigger>
            <TabsTrigger 
              value="people"
              className="rounded-full data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4 mr-1" /> People
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foryou" className="mt-6">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {exploreImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                    i === 3 || i === 7 ? 'row-span-2' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="space-y-2">
              {trendingTopics.map((topic, i) => (
                <motion.div
                  key={topic.tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-4 cursor-pointer hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{topic.category}</p>
                      <p className="font-semibold">#{topic.tag}</p>
                      <p className="text-sm text-muted-foreground">{topic.posts} posts</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="mt-6">
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic) => (
                <span
                  key={topic.tag}
                  className="px-4 py-2 rounded-full bg-secondary text-sm font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  #{topic.tag}
                </span>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <p className="text-muted-foreground text-center py-8">
              Connect your account to discover people
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
