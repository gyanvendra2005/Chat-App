import Redis from "ioredis";

const redis = new Redis({
    host: 'valkey-5d26e3e-gyanvendras2004-848f.f.aivencloud.com',
    port: 20329,
    username: "default",
    password: 'AVNS_tGCL4rvw1Oy9C08pRqX'
});

const redisKey = (groupId: string) => `group:${groupId}:messages`;

export async function GET(request: Request, { params }: { params: { groupId: string } }) {
    const { groupId } = await params;

    const list = await redis.lrange(redisKey(groupId), 0, 99); // newest first
    const messages = list.map(x => JSON.parse(x)).reverse();   // oldest first

    return Response.json({ messages });
}
