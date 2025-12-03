import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!apiKey || !apiSecret) {
      return Response.json(
        { error: "Missing API credentials" },
        { status: 500 }
      );
    }

    const serverClient = new StreamClient(apiKey, apiSecret);

    // Create/upsert the user first
    const newUser = {
      id: userId,
      role: "admin",
      name: userId,
    };
    await serverClient.upsertUsers([newUser]);

    // Generate token valid for 24 hours
    const validity = 24 * 60 * 60;
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
    });

    return Response.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
