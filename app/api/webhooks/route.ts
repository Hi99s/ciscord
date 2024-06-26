import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Missing headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new NextResponse("Invalid webhook", {
            status: 400,
        });
    }

    // Do something with the payload
    // // For this guide, you simply log the payload to the console
    // const { id } = evt.data;
    // const eventType = evt.type;
    // // const {first_name,last_name, } = payload.data;
    // console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
    // console.log("打印payload",payload);
    // return new NextResponse("Webhook received")
    try {
        const eventType = evt.type;
        if(eventType === "user.updated") {
         const {first_name,last_name,id,profile_image_url,email_addresses } = payload.data;
         const emailAddress = email_addresses[0].email_address;
         
         const updatedProfile = await db.profile.update({
            where:{
                userId:id
            },
            data:{
                name:`${first_name} ${last_name}`,
                imageUrl:profile_image_url,
                email:emailAddress
            }
         })
         return NextResponse.json(updatedProfile)
        }
        return new NextResponse("Webhook received")
    } catch (error) {
        console.log("[WEBHOOKS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
