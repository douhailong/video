import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

async function handler(req: Request) {
  const { videoUrl } = await req.json();
  // const {} = await validateOpenApi(req);
  //   return new NextResponse('UNAUTHORIZED', { status: 401 });
}

export { handler as POST };
