// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: 'Brifly',
    slug: 'brifly',
    version: '1.0.0',
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },
};