import redisClient from './redis-config.js';

const VOTE_QUEUE_KEY = 'vote_queue';
const VOTE_SYNC_INTERVAL = 5000; // 5 seconds

class VoteManager {
  
  // Add vote to Redis queue
  async addVote(postId, voteType) {
    try {
      const key = `post:${postId}:${voteType}`;
      
      // Increment vote count in Redis
      await redisClient.incr(key);
      
      // Add to queue for sync
      await redisClient.lPush(VOTE_QUEUE_KEY, JSON.stringify({
        postId,
        voteType,
        timestamp: Date.now()
      }));
      
      console.log(`✅ Vote queued: ${voteType} on post ${postId}`);
      return true;
    } catch (error) {
      console.error('Error adding vote:', error);
      return false;
    }
  }

  // Get vote counts from Redis
  async getVoteCounts(postId) {
    try {
      const upvotes = await redisClient.get(`post:${postId}:upvotes`) || '0';
      const downvotes = await redisClient.get(`post:${postId}:downvotes`) || '0';
      
      return { 
        upvotes: parseInt(upvotes), 
        downvotes: parseInt(downvotes) 
      };
    } catch (error) {
      console.error('Error getting vote counts:', error);
      return { upvotes: 0, downvotes: 0 };
    }
  }

  // Sync votes to Supabase (called every 5 seconds)
  async syncVotesToSupabase(supabase) {
    try {
      // Get queue length
      const queueLength = await redisClient.lLen(VOTE_QUEUE_KEY);
      
      if (queueLength === 0) return;
      
      console.log(`🔄 Syncing ${queueLength} votes to Supabase...`);
      
      // Group votes by postId
      const voteMap = {};
      
      for (let i = 0; i < queueLength; i++) {
        const voteStr = await redisClient.lPop(VOTE_QUEUE_KEY);
        
        if (!voteStr) break;
        
        const { postId, voteType } = JSON.parse(voteStr);
        
        if (!voteMap[postId]) {
          voteMap[postId] = { upvotes: 0, downvotes: 0 };
        }
        
        if (voteType === 'upvotes') voteMap[postId].upvotes++;
        else if (voteType === 'downvotes') voteMap[postId].downvotes++;
      }
      
      // Batch update Supabase
      for (const [postId, votes] of Object.entries(voteMap)) {
        if (votes.upvotes > 0) {
          await supabase.rpc('increment_post_meta', {
            pid: postId,
            col: 'upvotes',
            amount: votes.upvotes
          }).catch(err => console.error(`Error incrementing upvotes for ${postId}:`, err));
        }
        
        if (votes.downvotes > 0) {
          await supabase.rpc('increment_post_meta', {
            pid: postId,
            col: 'downvotes',
            amount: votes.downvotes
          }).catch(err => console.error(`Error incrementing downvotes for ${postId}:`, err));
        }
      }
      
      console.log(`✅ Synced ${Object.keys(voteMap).length} posts to Supabase!`);
      
    } catch (error) {
      console.error('❌ Sync error:', error);
    }
  }

  // Initialize sync interval
  initializeSyncInterval(supabase) {
    setInterval(async () => {
      await this.syncVotesToSupabase(supabase);
    }, VOTE_SYNC_INTERVAL);
    
    console.log(`⏱️ Vote sync interval started (every ${VOTE_SYNC_INTERVAL}ms)`);
  }
}

export default new VoteManager();
