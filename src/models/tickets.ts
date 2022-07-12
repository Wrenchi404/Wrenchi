import { model, Document, Schema } from "mongoose"

interface ITickets extends Document {
    _id: string;
    guildId: string;
    username: string;
    state: string;
    createdAt: Date;
    deletedAt: Date;
}

const ticketSchema = new Schema({
    _id: { type: Schema.Types.String },
    guildId: { type: Schema.Types.String },
    username: { type: Schema.Types.String },
    state: { type: Schema.Types.String, default: "Opened" },
    createdAt: { type: Schema.Types.Date },
    deletedAt: { type: Schema.Types.Date },
});

export default model<ITickets>("tickets", ticketSchema)