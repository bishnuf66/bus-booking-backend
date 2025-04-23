const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = {
            email: userData.email,
            userName: userData.userName,
            phone: userData.phone,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(user);
        return { ...user, _id: result.insertedId };
    }

    async findByEmail(email) {
        return await this.collection.findOne({ email });
    }

    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async update(id, updateData) {
        const update = { $set: { ...updateData, updatedAt: new Date() } };
        
        if (updateData.password) {
            update.$set.password = await bcrypt.hash(updateData.password, 10);
        }

        return await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            update,
            { returnDocument: 'after' }
        );
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User; 