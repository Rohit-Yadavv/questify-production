import Contact from '../models/contactModel.js';

// Handle contact form submission
export const createContactController = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });

        res.status(200).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};
