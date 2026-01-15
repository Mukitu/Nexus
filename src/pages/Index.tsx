import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { AppLayout } from '@/components/layout/AppLayout';
import { StoriesBar } from '@/components/feed/StoriesBar';
import { CreatePost } from '@/components/feed/CreatePost';
import { PostCard } from '@/components/feed/PostCard';
import { SuggestedUsers } from '@/components/feed/SuggestedUsers';
import { PostSkeleton } from '@/components/ui/skeleton-loaders';
import { mockPosts } from '@/lib/mock-data';
import { Post } from '@/lib/types';

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setPosts(mockPosts.slice(0, 3));
      setLoading(false);
    };
    loadInitialPosts();
  }, []);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const startIndex = page * 3;
    const newPosts = mockPosts.slice(startIndex, startIndex + 3);
    
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
    }
    
    setLoadingMore(false);
  }, [page, loadingMore, hasMore]);

  // Trigger load more when scrolling to bottom
  useEffect(() => {
    if (inView && !loading) {
      loadMorePosts();
    }
  }, [inView, loading, loadMorePosts]);

  return (
    <AppLayout>
      <div className="lg:grid lg:grid-cols-[1fr,320px] lg:gap-8">
        <div className="space-y-6">
          <StoriesBar />
          <CreatePost />
          
          {loading ? (
            <div className="space-y-6">
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {/* Load more trigger */}
              <div ref={loadMoreRef}>
                {loadingMore && <PostSkeleton />}
              </div>
              
              {!hasMore && posts.length > 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  You've seen all posts 🎉
                </p>
              )}
            </div>
          )}
        </div>
        
        <aside className="hidden lg:block sticky top-6 h-fit space-y-6">
          <SuggestedUsers />
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Press</a>
              <a href="#" className="hover:underline">API</a>
              <a href="#" className="hover:underline">Jobs</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
            </div>
            <p>© 2025 Nexus</p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Index;
