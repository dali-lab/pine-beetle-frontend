// Sort posts from the newest to the oldest
const sortBlogPosts = (blogPosts) => blogPosts.sort((a, b) => {
  const dateA = new Date(a.date_created);
  const dateB = new Date(b.date_created);

  return dateB - dateA;
});

// Get the latest blog post
const getLatestBlogPost = (blogPosts) => {
  if (!blogPosts || blogPosts.length === 0) {
    return null; // Handle the empty array case
  }

  const sortedPosts = sortBlogPosts(blogPosts);
  return sortedPosts[0];
};

// Return string with US date format
const getDateToDisplay = (dateToParse) => {
  const date = new Date(dateToParse);
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
};

// Return string with blog post creation and editing dates
const formatPostDates = (created, updated) => {
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

// truncate text for the blog post preview on home page
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space within maxLength
  const truncated = text.substr(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  if (lastSpaceIndex > 0) {
    return `${truncated.substr(0, lastSpaceIndex)}...`;
  }

  return `${truncated}...`;
};

export {
  sortBlogPosts, getDateToDisplay, getLatestBlogPost, formatPostDates, truncateText,
};
