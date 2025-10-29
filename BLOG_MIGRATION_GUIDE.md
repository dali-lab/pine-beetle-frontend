# Blog Comments and Likes - Migration to API

## Overview

The blog comments and likes feature has been updated to use a real API instead of localStorage. This document explains the changes made to the frontend and how to complete the migration.

## What Changed

### Files Modified

1. **`src/services/blog.js`**
   - Added 4 new API service functions:
     - `getBlogPostLikes(postId)` - Get likes for a post
     - `toggleBlogPostLike(postId)` - Toggle like for a post
     - `getBlogPostComments(postId)` - Get comments for a post
     - `createBlogPostComment(postId, commentData)` - Create a new comment

2. **`src/screens/single-blog-post/component.js`**
   - Now fetches likes and comments from API on component mount
   - Uses optimistic updates for likes
   - Implements proper loading states
   - Handles errors gracefully with localStorage fallback
   - Shows loading indicators and disabled states during submissions

3. **`src/screens/blog/components/blog-post/component.js`**
   - Updated to fetch likes and comments count from API
   - Uses Promise.all for parallel API calls
   - Falls back to localStorage if API fails

### New Files Created

1. **`BLOG_API_SPEC.md`**
   - Comprehensive API specification for backend team
   - Includes endpoint definitions, request/response formats
   - Security considerations and testing guidelines

## Current State

### What Works Now

✅ **All existing functionality still works**
- The frontend will attempt to use the API endpoints
- If API endpoints don't exist yet (404), it falls back to localStorage
- Users won't notice any difference until the API is implemented

### What Happens When API is Ready

Once the backend implements the API endpoints:
- Likes and comments will be stored in the database
- Data will be shared across all users and devices
- localStorage will serve as a backup cache
- Rate limiting and spam prevention will be active

## Testing

### Testing Without Backend (Current State)

1. Start the frontend: `npm start`
2. Navigate to a blog post
3. Try liking and commenting
4. Open browser DevTools > Console
5. You'll see messages like "Failed to fetch likes" - this is expected
6. Data will be saved to localStorage and work normally

### Testing With Backend (Once API is Ready)

1. Ensure backend is running and API_URL is configured in `.env`
2. Start the frontend: `npm start`
3. Navigate to a blog post
4. The console should NOT show error messages
5. Test these scenarios:

**Likes:**
- [ ] Click like button - count should increment
- [ ] Click like button again - count should decrement
- [ ] Refresh page - like state should persist
- [ ] Open in incognito/different browser - should see same like count

**Comments:**
- [ ] Submit a comment with name and comment text
- [ ] Submit a comment with email included
- [ ] Try to submit without name (should show validation error)
- [ ] Try to submit without comment text (should show validation error)
- [ ] Refresh page - comments should persist
- [ ] Open in different browser - should see same comments

**Error Handling:**
- [ ] Stop the backend server
- [ ] Try to like/comment
- [ ] Should see console errors but functionality still works via localStorage

## Backend Implementation Checklist

For backend developers, here's what needs to be done:

- [ ] Review `BLOG_API_SPEC.md` thoroughly
- [ ] Create database schemas for comments and likes
- [ ] Implement GET `/blog/:postId/likes` endpoint
- [ ] Implement POST `/blog/:postId/likes` endpoint
- [ ] Implement GET `/blog/:postId/comments` endpoint
- [ ] Implement POST `/blog/:postId/comments` endpoint
- [ ] Add input validation and sanitization
- [ ] Implement rate limiting
- [ ] Add spam prevention measures
- [ ] Test all endpoints with example data
- [ ] Deploy to dev environment
- [ ] Coordinate with frontend team for integration testing

## Environment Variables

Make sure `.env` file has the correct API URL:

```env
API_URL=http://localhost:9090
```

For production:
```env
API_URL=https://api.pine-beetle-prediction.netlify.app
```

## Data Migration (Optional)

If you want to preserve any localStorage data from users:

1. Users' localStorage data is client-side only
2. Each user's data only exists on their browser
3. When the API is ready, old localStorage data will remain as a fallback
4. No migration is necessary - users will start fresh with the API

If you want to import sample data:

1. Create some test blog posts
2. Use the API to add sample comments and likes
3. Test that they display correctly in the frontend

## Rollback Plan

If issues occur with the API:

1. The frontend automatically falls back to localStorage
2. No code changes needed - fallback is built-in
3. Users will still be able to like and comment locally

## Support and Questions

### Frontend Team Responsibilities

- ✅ Implement API service functions
- ✅ Update components to use API
- ✅ Add loading states and error handling
- ✅ Document API requirements
- ⏳ Integration testing once backend is ready
- ⏳ Final QA and bug fixes

### Backend Team Responsibilities

- ⏳ Review API specification
- ⏳ Implement database schemas
- ⏳ Implement API endpoints
- ⏳ Add security measures
- ⏳ Deploy to dev environment
- ⏳ Coordinate integration testing

## Timeline

1. **Phase 1: Frontend Preparation** (Complete ✅)
   - API service functions created
   - Components updated
   - Documentation written

2. **Phase 2: Backend Implementation** (In Progress ⏳)
   - Database schemas
   - API endpoints
   - Security measures

3. **Phase 3: Integration Testing** (Upcoming)
   - Test all endpoints
   - Fix bugs
   - Performance testing

4. **Phase 4: Deployment** (Upcoming)
   - Deploy to dev
   - QA testing
   - Deploy to production

## Additional Features to Consider

These features are not implemented yet but could be added:

1. **Comment Moderation**
   - Admin approval required before comments appear
   - Flagging inappropriate comments
   - Admin dashboard for managing comments

2. **Comment Editing/Deletion**
   - Allow users to edit their own comments
   - Time limit for editing (e.g., 15 minutes)
   - Allow users to delete their own comments

3. **Nested Replies**
   - Reply to specific comments
   - Threading for better conversations

4. **Email Notifications**
   - Notify post author of new comments
   - Notify commenters of replies

5. **Social Sharing**
   - Share blog posts on social media
   - Include like/comment counts in share preview

6. **Rich Text Comments**
   - Allow basic formatting in comments
   - Preview before posting

## Troubleshooting

### Common Issues

**Issue: "Failed to fetch likes" errors in console**
- **Cause:** Backend API not implemented yet
- **Solution:** This is expected. Wait for backend implementation or ignore these errors

**Issue: Like count resets when I refresh**
- **Cause:** localStorage is used, which is per-browser
- **Solution:** This will be fixed once API is implemented

**Issue: CORS errors when calling API**
- **Cause:** Backend needs to enable CORS for frontend domain
- **Solution:** Backend needs to add CORS headers

**Issue: Comments not appearing immediately**
- **Cause:** Comment moderation might be enabled
- **Solution:** Check with backend team about moderation settings

## Code Examples

### How to Use the New API Functions

```javascript
import {
  getBlogPostLikes,
  toggleBlogPostLike,
  getBlogPostComments,
  createBlogPostComment,
} from '../services/blog';

// Get likes for a post
const likesData = await getBlogPostLikes(postId);
console.log(likesData.count); // 42
console.log(likesData.userHasLiked); // false

// Toggle a like
const newLikesData = await toggleBlogPostLike(postId);
console.log(newLikesData.count); // 43
console.log(newLikesData.userHasLiked); // true

// Get comments
const comments = await getBlogPostComments(postId);
comments.forEach(comment => {
  console.log(comment.name, comment.comment);
});

// Create a comment
const newComment = await createBlogPostComment(postId, {
  name: 'John Doe',
  email: 'john@example.com',
  comment: 'Great article!',
});
console.log('Comment created:', newComment._id);
```

## Contact

For questions or issues:
- Frontend team: [your-email@example.com]
- Backend team: [backend-email@example.com]
- Project lead: [lead-email@example.com]

