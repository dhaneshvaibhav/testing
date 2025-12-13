import redisClient from './redis-config.js';

const CACHE_TTL = {
  POSTS_LIST: 300,        // 5 minutes
  SINGLE_POST: 600,       // 10 minutes
  SEARCH_RESULTS: 180,    // 3 minutes
  ADMIN_DATA: 60          // 1 minute
};

class CacheManager {

  // Cache posts list
  async cachePostsList(key, data) {
    try {
      await redisClient.setEx(key, CACHE_TTL.POSTS_LIST, JSON.stringify(data));
      console.log(`✅ Cached posts list: ${key}`);
      return true;
    } catch (error) {
      console.error('Cache error:', error);
      return false;
    }
  }

  // Get posts list from cache
  async getPostsListCache(key) {
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        console.log(`📦 Retrieved from cache: ${key}`);
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  // Cache single post
  async cacheSinglePost(postId, data) {
    try {
      const key = `post:${postId}`;
      await redisClient.setEx(key, CACHE_TTL.SINGLE_POST, JSON.stringify(data));
      console.log(`✅ Cached single post: ${key}`);
      return true;
    } catch (error) {
      console.error('Cache error:', error);
      return false;
    }
  }

  // Get single post from cache
  async getSinglePostCache(postId) {
    try {
      const key = `post:${postId}`;
      const cached = await redisClient.get(key);
      if (cached) {
        console.log(`📦 Retrieved from cache: ${key}`);
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  // Cache search results
  async cacheSearchResults(searchTerm, data) {
    try {
      const key = `search:${searchTerm.toLowerCase()}`;
      await redisClient.setEx(key, CACHE_TTL.SEARCH_RESULTS, JSON.stringify(data));
      console.log(`✅ Cached search results: ${key}`);
      return true;
    } catch (error) {
      console.error('Cache error:', error);
      return false;
    }
  }

  // Get search results from cache
  async getSearchResultsCache(searchTerm) {
    try {
      const key = `search:${searchTerm.toLowerCase()}`;
      const cached = await redisClient.get(key);
      if (cached) {
        console.log(`📦 Retrieved from cache: ${key}`);
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  // Clear all posts cache (on create/update/delete)
  async clearPostsCache() {
    try {
      // Delete posts list caches
      await redisClient.del('posts:all');
      console.log('🗑️ Cleared posts list cache');
      
      // Delete all search caches
      const keys = await redisClient.keys('search:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`🗑️ Cleared ${keys.length} search caches`);
      }
      
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Clear specific post cache
  async clearPostCache(postId) {
    try {
      const key = `post:${postId}`;
      await redisClient.del(key);
      console.log(`🗑️ Cleared cache: ${key}`);
      
      // Also clear posts list since it contains this post
      await this.clearPostsCache();
      
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Get cache stats
  async getCacheStats() {
    try {
      const keys = await redisClient.keys('*');
      return {
        totalKeys: keys.length,
        posts: keys.filter(k => k.startsWith('post:')).length,
        votes: keys.filter(k => k.includes('upvotes') || k.includes('downvotes')).length,
        searches: keys.filter(k => k.startsWith('search:')).length
      };
    } catch (error) {
      console.error('Stats error:', error);
      return null;
    }
  }
}

export default new CacheManager();
