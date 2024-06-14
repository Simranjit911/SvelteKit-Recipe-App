import { auth } from "$lib/firebase";
import { json, type Actions } from "@sveltejs/kit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { RequestEvent } from "./$types";

export function GET() {
    console.log("work")
    return json("hii")

}

export async function POST(requestEvent: RequestEvent) {
    const { request } = requestEvent;

    try {
        const { userData } = await request.json();
        console.log(userData);

        const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        console.log(res.user);

        return json({ user: res.user }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);

        return json( error.code,  { status: 400 });
    }
}