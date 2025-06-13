import mongoose from 'mongoose';

const MessageModel = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

export default mongoose.model('message', MessageModel)