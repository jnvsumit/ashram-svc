const { Donor } = require('../persistence/models');
const { v4: uuidv4 } = require('uuid');

const postDonor = async (req, res) => {
    try {
        const { name, email, phone, address, city, state, postalCode, country } = req.body;

        const _data = {
            donorId: uuidv4(),
            name,
            email,
            phone,
        };

        if (address) {
            _data.address = address;
        }

        if (city) {
            _data.city = city;
        }

        if (state) {
            _data.state = state;
        }

        if (postalCode) {
            _data.postalCode = postalCode;
        }

        if (country) {
            _data.country = country;
        }

        const donor = new Donor(_data);

        await donor.save();

        return res.status(200).json({
            status: 200,
            messageCode: 'SUCCESS',
            message: 'Donor created successfully',
            data: donor,
            success: true
        });
    } catch (error) {
        console.error('Error creating donor:', error);

        return res.status(500).json({
            status: 500,
            messageCode: 'SERVER_ERROR',
            message: 'Error creating donor',
            data: null,
            success: false
        });
    }
}

const getDonor = async (req, res) => {
    const { donorId } = req.params;

    try {
        const donor = await Donor.findOne({ donorId });

        if (!donor) {
            return res.status(404).json({
                status: 404,
                messageCode: 'NOT_FOUND',
                message: 'Donor not found',
                data: null,
                success: false
            });
        }

        return res.status(200).json({
            status: 200,
            messageCode: 'SUCCESS',
            message: 'Donor found',
            data: donor,
            success: true
        });
    } catch (error) {
        console.error('Error getting donor:', error);

        return res.status(500).json({
            status: 500,
            messageCode: 'SERVER_ERROR',
            message: 'Error getting donor',
            data: null,
            success: false
        });
    }
}

module.exports = {
    postDonor,
    getDonor
};