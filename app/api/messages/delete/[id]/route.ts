import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Message from '@/models/Messages';
import { getSessionUser } from '@/utils/getSessionUser';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  props: RouteParams
): Promise<NextResponse> {
  const params = await props.params;
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Message.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Message deleted successfully' },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
