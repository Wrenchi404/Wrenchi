import { Model, Schema, Document, model } from "mongoose"

export interface TicketSetupDocument extends Document {
    ticketChannel?: string;
    ticketGuild?: string;
    ticketMessage?: string;
}

export const TicketSetupSchema: Schema = new Schema({
    ticketChannel: {
        type: String,
        required: true
    },

    ticketGuild: {
        type: String,
        required: true
    },

    ticketMessage: {
        type: String,
        required: true
    }
});

const TicketSetup: Model<TicketSetupDocument> = model("TicketSetup", TicketSetupSchema);

export default TicketSetup