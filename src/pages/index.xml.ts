import { postsFeed } from '../lib/feed';

// Hugo served the main feed here, so readers are already subscribed to it.
export const GET = postsFeed;
