import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { subscriptionSchema } from "@/app/schemas/subscription.schema";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
    });

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: "No subscriptions found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve subscriptions" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const parsed = subscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.message },
        { status: 400 }
      );
    }

    const newSubscription = await prisma.subscription.create(body);

    return NextResponse.json(
      { subscription: newSubscription },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
};
