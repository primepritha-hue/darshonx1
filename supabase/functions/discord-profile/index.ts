const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DISCORD_BOT_TOKEN = Deno.env.get('DISCORD_BOT_TOKEN');
    if (!DISCORD_BOT_TOKEN) {
      throw new Error('DISCORD_BOT_TOKEN is not configured');
    }

    const DISCORD_USER_ID = Deno.env.get('DISCORD_USER_ID');
    if (!DISCORD_USER_ID) {
      throw new Error('DISCORD_USER_ID is not configured');
    }

    // Fetch user profile from Discord API
    const userRes = await fetch(`https://discord.com/api/v10/users/${DISCORD_USER_ID}`, {
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      throw new Error(`Discord API error [${userRes.status}]: ${errText}`);
    }

    const user = await userRes.json();

    // Build avatar URL
    let avatarUrl = null;
    if (user.avatar) {
      const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
      avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
    }

    // Build banner URL
    let bannerUrl = null;
    if (user.banner) {
      const ext = user.banner.startsWith('a_') ? 'gif' : 'png';
      bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=600`;
    }

    // Build profile data
    const profile = {
      id: user.id,
      username: user.username,
      global_name: user.global_name || user.username,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      banner_color: user.banner_color || null,
      accent_color: user.accent_color || null,
      discriminator: user.discriminator,
      public_flags: user.public_flags || 0,
      // Decode public flags into badge names
      badges: decodeBadges(user.public_flags || 0),
    };

    return new Response(JSON.stringify(profile), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Discord profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function decodeBadges(flags: number): string[] {
  const badgeMap: Record<number, string> = {
    1: 'Discord Staff',
    2: 'Partnered Server Owner',
    4: 'HypeSquad Events',
    8: 'Bug Hunter Level 1',
    64: 'HypeSquad Bravery',
    128: 'HypeSquad Brilliance',
    256: 'HypeSquad Balance',
    512: 'Early Supporter',
    16384: 'Bug Hunter Level 2',
    131072: 'Verified Bot Developer',
    262144: 'Active Developer',
    4194304: 'Supports Commands',
  };

  const badges: string[] = [];
  for (const [bit, name] of Object.entries(badgeMap)) {
    if (flags & parseInt(bit)) {
      badges.push(name);
    }
  }
  return badges;
}
