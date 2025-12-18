/**
 * Sorts blog posts from newest to oldest
 * @param {Array} blogPosts - Array of blog post objects
 * @returns {Array} Sorted array of blog posts
 */
export const sortBlogPosts = (blogPosts) => {
  if (!blogPosts || !Array.isArray(blogPosts)) {
    return [];
  }

  return [...blogPosts].sort((a, b) => {
    const dateA = new Date(a.date_created);
    const dateB = new Date(b.date_created);

    return dateB - dateA;
  });
};

/**
 * Gets the latest blog post - O(n) complexity
 * @param {Array} blogPosts - Array of blog post objects
 * @returns {Object|null} Latest blog post or null if empty
 */
export const getLatestBlogPost = (blogPosts) => {
  if (!blogPosts || blogPosts.length === 0) {
    return null;
  }

  return blogPosts.reduce((latest, post) => {
    if (!latest) return post;
    const latestDate = new Date(latest.date_created);
    const postDate = new Date(post.date_created);
    return postDate > latestDate ? post : latest;
  }, null);
};

/**
 * Formats date to US date format (MM/DD/YYYY)
 * @param {string|Date} dateToParse - Date to format
 * @returns {string} Formatted date string
 */
export const getDateToDisplay = (dateToParse) => {
  const date = new Date(dateToParse);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

/**
 * Formats blog post creation and update dates for display
 * @param {string|Date} created - Creation date
 * @param {string|Date} updated - Update date
 * @returns {string} Formatted date string
 */
export const formatPostDates = (created, updated) => {
  const options = {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  };
  const createdDate = new Date(created).toLocaleString('en-US', options);
  const updatedDate = new Date(updated).toLocaleString('en-US', options);

  let dateString = `Posted on ${createdDate}`;
  if (updated && created !== updated) {
    dateString += `, Last updated on ${updatedDate}`;
  }

  return dateString;
};

/**
 * Truncates text for blog post preview, breaking at word boundaries
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space within maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  if (lastSpaceIndex > 0) {
    return `${truncated.substring(0, lastSpaceIndex)}...`;
  }

  return `${truncated}...`;
};
