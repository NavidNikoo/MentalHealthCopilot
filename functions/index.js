const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createCheckoutSession = functions
    .runWith({ secrets: ["STRIPE_SECRET"] }) // ✅ This now works on v4+
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }

        const stripe = require("stripe")(process.env.STRIPE_SECRET);
        const { priceId } = data;

        try {
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [{ price: priceId, quantity: 1 }],
                success_url: "http://localhost:5173/dashboard",
                cancel_url: "http://localhost:5173/cancel",
                customer_email: context.auth.token.email,
            });

            return { id: session.id };
        } catch (error) {
            console.error("Stripe error:", error.message);
            throw new functions.https.HttpsError("internal", "Stripe session creation failed");
        }
    });
