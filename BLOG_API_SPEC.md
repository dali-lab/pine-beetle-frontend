# Blog Comments and Likes API Specification

This document describes the API endpoints required for the blog comments and likes feature. The frontend has been prepared to use these endpoints instead of localStorage.

## Base URL

All endpoints use the base URL: `${API_URL}/blog`

## Authentication

- Likes and comments may be tracked by user session or IP address
- No authentication is required for public users to like or comment
- Consider implementing rate limiting to prevent abuse

## Endpoints

### 1. Get Blog Post Likes

**Endpoint:** `GET /blog/:postId/likes`

**Description:** Retrieves the number of likes and whether the current user has liked the post.

**URL Parameters:**

- `postId` (string, required) - The ID of the blog post

**Response:**

```json
{
  "success": true,
  "data": {
    "count": 42,
    "userHasLiked": false
  }
}
```

**Response Fields:**

- `count` (number) - Total number of likes for the post
- `userHasLiked` (boolean) - Whether the current user/session has liked this post

**Status Codes:**

- `200` - Success
- `404` - Blog post not found
- `500` - Server error

---

### 2. Toggle Blog Post Like

**Endpoint:** `POST /blog/:postId/likes`

**Description:** Toggles a like for the blog post. If the user has already liked the post, it removes the like. If not, it adds a like.

**URL Parameters:**

- `postId` (string, required) - The ID of the blog post

**Request Body:** None (user identification should be handled via session/cookie/IP)

**Response:**

```json
{
  "success": true,
  "data": {
    "count": 43,
    "userHasLiked": true
  }
}
```

**Response Fields:**

- `count` (number) - Updated total number of likes for the post
- `userHasLiked` (boolean) - Updated like status for the current user/session

**Status Codes:**

- `200` - Success
- `404` - Blog post not found
- `500` - Server error

**Implementation Notes:**

- Track likes by user session, cookie, or IP address
- Implement rate limiting to prevent spam
- Consider using a unique identifier (session ID, cookie, or IP) to track who has liked what

---

### 3. Get Blog Post Comments

**Endpoint:** `GET /blog/:postId/comments`

**Description:** Retrieves all comments for a specific blog post.

**URL Parameters:**

- `postId` (string, required) - The ID of the blog post

**Query Parameters (Optional):**

- `limit` (number) - Maximum number of comments to return
- `offset` (number) - Offset for pagination
- `sort` (string) - Sort order: "newest" or "oldest" (default: "newest")

**Response:**

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "comment": "Great article! Very informative.",
        "date_created": "2025-10-28T10:30:00.000Z",
        "approved": true
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "comment": "Thanks for sharing this research.",
        "date_created": "2025-10-27T15:45:00.000Z",
        "approved": true
      }
    ],
    "total": 2
  }
}
```

**Response Fields:**

- `comments` (array) - Array of comment objects
  - `_id` (string) - Unique comment identifier
  - `name` (string) - Commenter's name
  - `email` (string, optional) - Commenter's email (not displayed publicly)
  - `comment` (string) - Comment text
  - `date_created` (string) - ISO 8601 timestamp
  - `approved` (boolean) - Whether the comment has been approved (for moderation)
- `total` (number) - Total number of comments for this post

**Status Codes:**

- `200` - Success
- `404` - Blog post not found
- `500` - Server error

**Implementation Notes:**

- Only return approved comments (approved: true) for public endpoints
- Email addresses should not be included in the public response (privacy)

---

### 4. Create Blog Post Comment

**Endpoint:** `POST /blog/:postId/comments`

**Description:** Creates a new comment on a blog post.

**URL Parameters:**

- `postId` (string, required) - The ID of the blog post

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "comment": "This is a great article!"
}
```

**Request Fields:**

- `name` (string, required) - Commenter's name (max 100 characters)
- `email` (string, optional) - Commenter's email for notifications (not displayed publicly)
- `comment` (string, required) - Comment text (max 2000 characters)

**Response:**

```json
{
  "success": true,
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Doe",
      "email": "john@example.com",
      "comment": "This is a great article!",
      "date_created": "2025-10-28T12:00:00.000Z",
      "approved": false
    }
  },
  "message": "Comment submitted successfully and is pending approval"
}
```

**Response Fields:**

- `comment` (object) - The created comment object
  - Same fields as in GET comments response
  - `approved` may be false initially if moderation is enabled

**Status Codes:**

- `201` - Comment created successfully
- `400` - Invalid request (missing required fields, validation errors)
- `404` - Blog post not found
- `429` - Too many requests (rate limit exceeded)
- `500` - Server error

**Validation Rules:**

- `name`: Required, 1-100 characters, trim whitespace
- `email`: Optional, valid email format if provided
- `comment`: Required, 1-2000 characters, trim whitespace

**Implementation Notes:**

- Implement rate limiting per IP/session (e.g., max 5 comments per hour)
- Consider implementing spam detection/filtering
- Consider implementing moderation (comments pending approval before display)
- Sanitize comment text to prevent XSS attacks
- Store the commenter's IP address for spam prevention
- Send email notification to post author/admin when new comment is posted

---

## Data Models

### Comment Schema (MongoDB Example)

```javascript
{
  _id: ObjectId,
  postId: ObjectId,           // Reference to blog post
  name: String,               // Commenter's name
  email: String,              // Commenter's email (optional, not public)
  comment: String,            // Comment text
  date_created: Date,         // When comment was created
  approved: Boolean,          // Whether comment is approved (for moderation)
  ip_address: String,         // Commenter's IP (for spam prevention)
  user_agent: String,         // Browser info (for spam prevention)
  spam_score: Number,         // Optional spam detection score
  flagged: Boolean,           // Whether comment has been flagged
}
```

### Like Schema (MongoDB Example)

```javascript
{
  _id: ObjectId,
  postId: ObjectId,           // Reference to blog post
  identifier: String,         // Session ID, cookie, or IP hash
  date_created: Date,         // When like was created
}
```

Alternatively, you could store likes as an embedded array in the blog post document:

```javascript
// In BlogPost document
{
  ...
  likes: [
    {
      identifier: String,     // Session ID, cookie, or IP hash
      date_created: Date,
    }
  ],
  likeCount: Number,          // Cached count for performance
}
```

---

## Error Response Format

All error responses should follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

**Common Error Codes:**

- `POST_NOT_FOUND` - Blog post not found
- `VALIDATION_ERROR` - Request validation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVER_ERROR` - Internal server error

---

## Security Considerations

1. **Rate Limiting:**

   - Implement rate limiting on all endpoints
   - Suggested limits:
     - Likes: 10 per hour per IP/session
     - Comments: 5 per hour per IP/session

2. **Input Validation:**

   - Validate and sanitize all user input
   - Escape HTML in comments to prevent XSS
   - Validate email format
   - Enforce length limits

3. **Spam Prevention:**

   - Consider using CAPTCHA for comments
   - Implement comment moderation
   - Track IP addresses and implement IP-based blocking
   - Consider using spam detection services (e.g., Akismet)

4. **User Identification:**
   - Use secure session cookies or generate unique identifiers
   - Hash IP addresses if storing them long-term
   - Comply with privacy regulations (GDPR, CCPA)

---

## Frontend Implementation Details

The frontend has been updated with the following features:

1. **Optimistic Updates:**

   - Like button updates immediately, then confirms with server
   - Reverts if API call fails

2. **Fallback to localStorage:**

   - If API calls fail, the frontend falls back to localStorage
   - This provides a graceful degradation during API development

3. **Loading States:**

   - Shows loading indicators while fetching data
   - Disables form inputs while submitting

4. **Error Handling:**
   - Catches and logs API errors
   - Falls back to localStorage if needed
   - Provides user feedback on failures

---

## Migration Notes

The frontend currently uses these localStorage keys:

- `blog-likes-{postId}` - Number of likes
- `blog-liked-{postId}` - Boolean indicating if user liked the post
- `blog-comments-{postId}` - JSON array of comments

Once the API is implemented and tested:

1. The frontend will automatically use the API
2. localStorage will serve as a backup if API calls fail
3. You may want to add a migration script to import existing localStorage data into the database

---

## Testing

### Manual Testing Checklist

- [ ] GET /blog/:postId/likes returns correct count
- [ ] POST /blog/:postId/likes increments count
- [ ] POST /blog/:postId/likes (again) decrements count
- [ ] GET /blog/:postId/comments returns all approved comments
- [ ] POST /blog/:postId/comments creates new comment
- [ ] Rate limiting prevents spam
- [ ] Invalid postId returns 404
- [ ] Missing required fields returns 400

### Example cURL Commands

```bash
# Get likes
curl -X GET "${API_URL}/blog/507f1f77bcf86cd799439011/likes"

# Toggle like
curl -X POST "${API_URL}/blog/507f1f77bcf86cd799439011/likes" \
  -H "Content-Type: application/json"

# Get comments
curl -X GET "${API_URL}/blog/507f1f77bcf86cd799439011/comments"

# Create comment
curl -X POST "${API_URL}/blog/507f1f77bcf86cd799439011/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "comment": "Great article!"
  }'
```

---

## Questions for Backend Team

1. Do you want to implement comment moderation (approval required before display)?
2. Should we implement nested replies to comments, or just top-level comments?
3. What spam prevention strategy do you prefer?
4. How should we identify unique users (sessions, cookies, IP addresses)?
5. Do you want email notifications for new comments?
6. Should we implement comment editing/deletion by the author?

---

## Contact

For questions about this specification or the frontend implementation, please contact the frontend development team.
