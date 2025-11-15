// ... (all your existing imports: express, path, nodemailer, etc.)
const MenuItem = require('./models/menuItem');
const app = express();
// ... (all your existing middleware: cors, express.json, static paths)
// ... (your existing MongoDB connection)


// --- API Routes (Existing) ---
app.get('/api/menu', async (req, res) => {
    // ... (existing code)
});
app.post('/send-email', (req, res) => {
    // ... (existing code)
});


// --- NEW API ROUTE: SUBMIT ORDER ---
app.post('/api/submit-order', (req, res) => {
    const { name, phone, items, total } = req.body;

    // 1. Format the items list for the email
    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">${item.name}</td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">₹${item.price}</td>
        </tr>
    `).join('');

    const emailBody = `
        <h2>You've received a new pickup order!</h2>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Phone:</strong> ${phone}</p>
        <hr>
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f4f1ea;">
                    <th style="padding: 10px; text-align: left;">Item</th>
                    <th style="padding: 10px; text-align: center;">Quantity</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr style="font-weight: bold; border-top: 2px solid #333;">
                    <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
                    <td style="padding: 10px; text-align: right;">₹${total}</td>
                </tr>
            </tfoot>
        </table>
    `;

    // 2. Set up Nodemailer (uses your .env credentials)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 3. Email options
    const mailOptions = {
        from: '"The Bro Cafe Website" <noreply@brocafe.com>',
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `New Pickup Order from ${name}`,
        html: emailBody,
    };

    // 4. Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Something went wrong.');
        } else {
            console.log('Order Email sent: ' + info.response);
            res.status(200).send('Order submitted successfully!');
        }
    });
});


// --- Serve HTML pages (Update this section) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.get('/gallery.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'gallery.html'));
});
app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'contact.html'));
});
// ADD THIS NEW ROUTE
app.get('/order.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'order.html'));
});


// Start Server
app.listen(port, () => {
    // ... (existing code)
});