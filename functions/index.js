const functions = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const Stripe = require('stripe');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

admin.initializeApp();

const stripe = Stripe(functions.config().stripe.secret);
const db = admin.firestore();

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    const { priceId } = data;

    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You must be logged in to initiate a checkout session.'
        );
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',  // ✅ one-time payment
            payment_method_types: ['card'],
            line_items: [{ price: data.priceId, quantity: 1 }],
            success_url: 'http://localhost:5173/dashboard',
            cancel_url: 'http://localhost:5173/profile',
            customer_email: context.auth.token.email,
            metadata: {
                firebaseUid: context.auth.uid
            }
        });


        return { url: session.url };
    } catch (err) {
        console.error('Stripe error:', err.message);
        throw new functions.https.HttpsError('internal', err.message);
    }
});

exports.stripeWebhook = functions
    .runWith({ memory: '256MB', secrets: [stripeWebhookSecret] })
    .https.onRequest(async (req, res) => {
        if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

        const sig = req.headers['stripe-signature'];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                sig,
                stripeWebhookSecret.value()
            );
        } catch (err) {
            console.error('❌ Signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const uid = session.metadata?.firebaseUid;

            if (!uid) {
                console.warn('⚠️ No UID in session metadata — cannot update Firestore.');
                return res.status(400).send('Missing UID in metadata.');
            }

            try {
                await db
                    .collection('users')
                    .doc(uid)
                    .collection('profile')
                    .doc('main')
                    .set({ isPremium: true }, { merge: true });

                console.log(`🎉 Premium upgraded for UID: ${uid}`);
            } catch (err) {
                console.error(`🔥 Firestore write failed: ${err.message}`);
                return res.status(500).send('Internal error writing premium status.');
            }
        }


        res.status(200).send('Webhook received');
    });
