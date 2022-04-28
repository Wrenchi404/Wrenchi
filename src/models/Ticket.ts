import { Model, Schema, Document, model } from "mongoose"

export interface TicketDocument extends Document {
    channel?: string;
    guild?: string;
    user?: string;
    welcomeMessage?: string;
    status?: "OPENED" | "CLOSED";
}

export const TicketSchema: Schema = new Schema({
    channel: {
        type: String,
        required: true
    },

    guild: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },

    welcomeMessage: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true,
        default: "OPENED"
    }
});

const Ticket: Model<TicketDocument> = model("Ticket", TicketSchema);
export default Ticket