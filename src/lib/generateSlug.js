// Utility function to generate a slug from the title
export const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/(^-|-$)+/g, '') // Remove leading or trailing hyphens
      .substring(0, 200); // Optional: Limit the length of the slug
  };
  